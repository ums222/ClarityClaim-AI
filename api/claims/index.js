import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(403).json({ error: 'User not associated with an organization' });
    }

    const organizationId = profile.organization_id;

    switch (req.method) {
      case 'GET':
        return handleGet(req, res, organizationId);
      case 'POST':
        return handlePost(req, res, organizationId);
      case 'PUT':
        return handlePut(req, res, organizationId);
      case 'DELETE':
        return handleDelete(req, res, organizationId);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(req, res, organizationId) {
  const { id, patient_id, status, page = 1, limit = 20 } = req.query;

  if (id) {
    const { data, error } = await supabase
      .from('claims')
      .select(`
        *,
        patient:patients(id, mrn, first_name, last_name, date_of_birth),
        payer:payers(id, name, type)
      `)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Get appeals for this claim
    const { data: appeals } = await supabase
      .from('appeals')
      .select('id, appeal_number, status, outcome, created_at')
      .eq('claim_id', id)
      .order('created_at', { ascending: false });

    return res.status(200).json({ data: { ...data, appeals: appeals || [] } });
  }

  let query = supabase
    .from('claims')
    .select(`
      *,
      patient:patients(id, mrn, first_name, last_name),
      payer:payers(id, name)
    `, { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (patient_id) {
    query = query.eq('patient_id', patient_id);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
    },
  });
}

async function handlePost(req, res, organizationId) {
  const {
    patient_id,
    payer_id,
    claim_number,
    service_date,
    filing_date,
    billed_amount,
    procedure_codes,
    diagnosis_codes,
    provider_npi,
    rendering_provider,
    place_of_service,
    notes,
  } = req.body;

  if (!patient_id || !claim_number || !service_date || !billed_amount) {
    return res.status(400).json({ 
      error: 'Required fields: patient_id, claim_number, service_date, billed_amount' 
    });
  }

  // Verify patient belongs to organization
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patient_id)
    .eq('organization_id', organizationId)
    .single();

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const { data, error } = await supabase
    .from('claims')
    .insert({
      organization_id: organizationId,
      patient_id,
      payer_id,
      claim_number,
      service_date,
      filing_date: filing_date || new Date().toISOString().split('T')[0],
      billed_amount,
      procedure_codes,
      diagnosis_codes,
      provider_npi,
      rendering_provider,
      place_of_service,
      notes,
      status: 'submitted',
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Claim with this number already exists' });
    }
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ data });
}

async function handlePut(req, res, organizationId) {
  const { id } = req.query;
  const updates = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Claim ID is required' });
  }

  delete updates.id;
  delete updates.organization_id;
  delete updates.created_at;

  const { data, error } = await supabase
    .from('claims')
    .update(updates)
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
}

async function handleDelete(req, res, organizationId) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Claim ID is required' });
  }

  const { error } = await supabase
    .from('claims')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Claim deleted successfully' });
}

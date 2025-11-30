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
  const { id, search, status, page = 1, limit = 20 } = req.query;

  if (id) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Get claim stats for this patient
    const { data: claims } = await supabase
      .from('claims')
      .select('id, status')
      .eq('patient_id', id);

    const claimStats = {
      total: claims?.length || 0,
      denied: claims?.filter(c => c.status === 'denied').length || 0,
      appealed: claims?.filter(c => c.status === 'appealed').length || 0,
    };

    return res.status(200).json({ data: { ...data, claim_stats: claimStats } });
  }

  let query = supabase
    .from('patients')
    .select('*', { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,mrn.ilike.%${search}%`);
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
    mrn,
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    email,
    address,
    city,
    state,
    zip_code,
  } = req.body;

  if (!mrn || !first_name || !last_name || !date_of_birth) {
    return res.status(400).json({ 
      error: 'Required fields: mrn, first_name, last_name, date_of_birth' 
    });
  }

  const { data, error } = await supabase
    .from('patients')
    .insert({
      organization_id: organizationId,
      mrn,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      email,
      address,
      city,
      state,
      zip_code,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Patient with this MRN already exists' });
    }
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ data });
}

async function handlePut(req, res, organizationId) {
  const { id } = req.query;
  const updates = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Patient ID is required' });
  }

  delete updates.id;
  delete updates.organization_id;
  delete updates.created_at;

  const { data, error } = await supabase
    .from('patients')
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
    return res.status(400).json({ error: 'Patient ID is required' });
  }

  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Patient deleted successfully' });
}

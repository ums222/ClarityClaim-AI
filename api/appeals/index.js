import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Verify the JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's organization
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
        return handlePost(req, res, organizationId, user.id);
      case 'PUT':
        return handlePut(req, res, organizationId, user.id);
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
  const { id, status, page = 1, limit = 20 } = req.query;

  // Get single appeal by ID
  if (id) {
    const { data, error } = await supabase
      .from('appeals')
      .select(`
        *,
        claim:claims(*),
        assigned_user:profiles!appeals_assigned_to_fkey(first_name, last_name, email),
        created_by_user:profiles!appeals_created_by_fkey(first_name, last_name)
      `)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Appeal not found' });
    }

    return res.status(200).json({ data });
  }

  // List appeals with filters
  let query = supabase
    .from('appeals')
    .select(`
      *,
      claim:claims(claim_number, patient:patients(first_name, last_name), payer:payers(name)),
      assigned_user:profiles!appeals_assigned_to_fkey(first_name, last_name)
    `, { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

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

async function handlePost(req, res, organizationId, userId) {
  const {
    claim_id,
    denial_reason,
    appeal_reason,
    letter_content,
    deadline_date,
  } = req.body;

  if (!claim_id) {
    return res.status(400).json({ error: 'claim_id is required' });
  }

  // Verify claim belongs to organization
  const { data: claim } = await supabase
    .from('claims')
    .select('id')
    .eq('id', claim_id)
    .eq('organization_id', organizationId)
    .single();

  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  // Generate appeal number
  const appealNumber = `APL-${Date.now().toString(36).toUpperCase()}`;

  const { data, error } = await supabase
    .from('appeals')
    .insert({
      organization_id: organizationId,
      claim_id,
      appeal_number: appealNumber,
      denial_reason,
      appeal_reason,
      letter_content,
      deadline_date,
      status: 'draft',
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Log activity
  await supabase.from('appeal_activities').insert({
    appeal_id: data.id,
    user_id: userId,
    activity_type: 'created',
    description: 'Appeal created',
  });

  return res.status(201).json({ data });
}

async function handlePut(req, res, organizationId, userId) {
  const { id } = req.query;
  const updates = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Appeal ID is required' });
  }

  // Verify appeal belongs to organization
  const { data: existing } = await supabase
    .from('appeals')
    .select('id, status')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single();

  if (!existing) {
    return res.status(404).json({ error: 'Appeal not found' });
  }

  // Remove fields that shouldn't be updated directly
  delete updates.id;
  delete updates.organization_id;
  delete updates.created_at;
  delete updates.created_by;

  const { data, error } = await supabase
    .from('appeals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Log status change
  if (updates.status && updates.status !== existing.status) {
    await supabase.from('appeal_activities').insert({
      appeal_id: id,
      user_id: userId,
      activity_type: 'status_changed',
      description: `Status changed from ${existing.status} to ${updates.status}`,
      metadata: { old_status: existing.status, new_status: updates.status },
    });
  }

  return res.status(200).json({ data });
}

async function handleDelete(req, res, organizationId) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Appeal ID is required' });
  }

  const { error } = await supabase
    .from('appeals')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Appeal deleted successfully' });
}

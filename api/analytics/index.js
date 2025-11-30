import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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
    const { period = '30d' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Fetch all data in parallel
    const [
      claimsData,
      appealsData,
      patientsData,
      denialReasonsData,
    ] = await Promise.all([
      // Claims stats
      supabase
        .from('claims')
        .select('id, status, billed_amount, paid_amount, denial_reason, service_date')
        .eq('organization_id', organizationId)
        .gte('service_date', startDate.toISOString().split('T')[0]),
      
      // Appeals stats
      supabase
        .from('appeals')
        .select('id, status, outcome, outcome_amount, created_at')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate.toISOString()),
      
      // Patients count
      supabase
        .from('patients')
        .select('id', { count: 'exact' })
        .eq('organization_id', organizationId),
      
      // Denial reasons breakdown
      supabase
        .from('claims')
        .select('denial_reason')
        .eq('organization_id', organizationId)
        .eq('status', 'denied')
        .gte('service_date', startDate.toISOString().split('T')[0]),
    ]);

    const claims = claimsData.data || [];
    const appeals = appealsData.data || [];
    const totalPatients = patientsData.count || 0;
    const denialReasons = denialReasonsData.data || [];

    // Calculate metrics
    const totalClaims = claims.length;
    const deniedClaims = claims.filter(c => c.status === 'denied').length;
    const denialRate = totalClaims > 0 ? (deniedClaims / totalClaims) * 100 : 0;
    
    const totalBilled = claims.reduce((sum, c) => sum + parseFloat(c.billed_amount || 0), 0);
    const totalPaid = claims.reduce((sum, c) => sum + parseFloat(c.paid_amount || 0), 0);
    
    const totalAppeals = appeals.length;
    const wonAppeals = appeals.filter(a => a.outcome === 'approved' || a.outcome === 'partially_approved').length;
    const appealWinRate = totalAppeals > 0 ? (wonAppeals / totalAppeals) * 100 : 0;
    
    const recoveredAmount = appeals
      .filter(a => a.outcome === 'approved' || a.outcome === 'partially_approved')
      .reduce((sum, a) => sum + parseFloat(a.outcome_amount || 0), 0);

    // Group denial reasons
    const denialReasonCounts = {};
    denialReasons.forEach(d => {
      const reason = d.denial_reason || 'Unknown';
      denialReasonCounts[reason] = (denialReasonCounts[reason] || 0) + 1;
    });

    const denialReasonBreakdown = Object.entries(denialReasonCounts)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: deniedClaims > 0 ? (count / deniedClaims) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Group claims by status
    const claimsByStatus = {};
    claims.forEach(c => {
      claimsByStatus[c.status] = (claimsByStatus[c.status] || 0) + 1;
    });

    // Group appeals by status
    const appealsByStatus = {};
    appeals.forEach(a => {
      appealsByStatus[a.status] = (appealsByStatus[a.status] || 0) + 1;
    });

    return res.status(200).json({
      data: {
        summary: {
          total_claims: totalClaims,
          total_denials: deniedClaims,
          denial_rate: Math.round(denialRate * 100) / 100,
          total_billed: Math.round(totalBilled * 100) / 100,
          total_paid: Math.round(totalPaid * 100) / 100,
          total_appeals: totalAppeals,
          appeals_won: wonAppeals,
          appeal_win_rate: Math.round(appealWinRate * 100) / 100,
          revenue_recovered: Math.round(recoveredAmount * 100) / 100,
          total_patients: totalPatients,
        },
        claims_by_status: claimsByStatus,
        appeals_by_status: appealsByStatus,
        denial_reasons: denialReasonBreakdown,
        period: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
        },
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import { supabase } from './supabase';

// Types
export interface Claim {
  id: string;
  organization_id: string;
  created_by: string | null;
  
  // Claim identifiers
  claim_number: string;
  external_claim_id: string | null;
  
  // Patient information
  patient_name: string;
  patient_id: string | null;
  patient_dob: string | null;
  patient_member_id: string | null;
  
  // Provider information
  provider_name: string | null;
  provider_npi: string | null;
  facility_name: string | null;
  
  // Payer information
  payer_name: string;
  payer_id: string | null;
  plan_name: string | null;
  plan_type: 'Commercial' | 'Medicare' | 'Medicaid' | 'Other' | null;
  
  // Service information
  service_date: string | null;
  service_date_end: string | null;
  place_of_service: string | null;
  procedure_codes: string[];
  diagnosis_codes: string[];
  modifiers: string[];
  
  // Financial information
  billed_amount: number;
  allowed_amount: number | null;
  paid_amount: number | null;
  patient_responsibility: number | null;
  adjustment_amount: number | null;
  
  // Status and workflow
  status: ClaimStatus;
  status_reason: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // AI/Risk scoring
  denial_risk_score: number | null;
  denial_risk_level: 'low' | 'medium' | 'high' | null;
  denial_risk_factors: RiskFactor[];
  ai_recommendations: AIRecommendation[];
  
  // Denial information
  denial_date: string | null;
  denial_codes: string[];
  denial_reasons: string[];
  denial_category: string | null;
  
  // Timeline
  received_date: string | null;
  submitted_at: string | null;
  due_date: string | null;
  follow_up_date: string | null;
  
  // Additional data
  notes: string | null;
  attachments: Attachment[];
  custom_fields: Record<string, unknown>;
  source: 'manual' | 'import' | 'ehr' | 'api';
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export type ClaimStatus = 
  | 'draft'
  | 'pending_review'
  | 'submitted'
  | 'in_process'
  | 'denied'
  | 'partially_denied'
  | 'paid'
  | 'appealed'
  | 'appeal_won'
  | 'appeal_lost'
  | 'closed';

export interface RiskFactor {
  factor: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

export interface AIRecommendation {
  type: string;
  recommendation: string;
  confidence: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface ClaimActivity {
  id: string;
  claim_id: string;
  user_id: string | null;
  action: string;
  action_details: Record<string, unknown>;
  previous_value: string | null;
  new_value: string | null;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface ClaimFilters {
  status?: ClaimStatus[];
  priority?: ('low' | 'normal' | 'high' | 'urgent')[];
  payer?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  riskLevel?: ('low' | 'medium' | 'high')[];
  search?: string;
}

export interface ClaimStats {
  total: number;
  pending: number;
  submitted: number;
  denied: number;
  paid: number;
  totalBilled: number;
  totalPaid: number;
  avgDenialRisk: number;
  highRiskCount: number;
}

// Default claim for creation
export const getDefaultClaim = (): Partial<Claim> => ({
  claim_number: `CLM-${Date.now().toString(36).toUpperCase()}`,
  status: 'draft',
  priority: 'normal',
  billed_amount: 0,
  procedure_codes: [],
  diagnosis_codes: [],
  modifiers: [],
  denial_codes: [],
  denial_reasons: [],
  attachments: [],
  denial_risk_factors: [],
  ai_recommendations: [],
  custom_fields: {},
  source: 'manual',
});

// Claims Service
export const claimsService = {
  /**
   * Get all claims with optional filters
   */
  async getClaims(filters?: ClaimFilters, page = 1, pageSize = 25) {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('claims')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }
    
    if (filters?.priority?.length) {
      query = query.in('priority', filters.priority);
    }
    
    if (filters?.payer) {
      query = query.ilike('payer_name', `%${filters.payer}%`);
    }
    
    if (filters?.riskLevel?.length) {
      query = query.in('denial_risk_level', filters.riskLevel);
    }
    
    if (filters?.dateRange) {
      if (filters.dateRange.start) {
        query = query.gte('service_date', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        query = query.lte('service_date', filters.dateRange.end);
      }
    }
    
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(`claim_number.ilike.${searchTerm},patient_name.ilike.${searchTerm},payer_name.ilike.${searchTerm}`);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      claims: data as Claim[],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  },

  /**
   * Get a single claim by ID
   */
  async getClaim(id: string) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Claim;
  },

  /**
   * Create a new claim
   */
  async createClaim(claim: Partial<Claim>) {
    if (!supabase) throw new Error('Supabase not configured');

    // Get current user's profile for organization_id
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      throw new Error('User has no organization');
    }

    const newClaim = {
      ...getDefaultClaim(),
      ...claim,
      organization_id: profile.organization_id,
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from('claims')
      .insert(newClaim)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(data.id, 'created', {
      claim_number: data.claim_number,
    });

    return data as Claim;
  },

  /**
   * Update a claim
   */
  async updateClaim(id: string, updates: Partial<Claim>) {
    if (!supabase) throw new Error('Supabase not configured');

    // Get current claim for activity logging
    const currentClaim = await this.getClaim(id);

    const { data, error } = await supabase
      .from('claims')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log status change activity
    if (updates.status && updates.status !== currentClaim.status) {
      await this.logActivity(id, 'status_changed', {
        from: currentClaim.status,
        to: updates.status,
      });
    }

    return data as Claim;
  },

  /**
   * Delete a claim
   */
  async deleteClaim(id: string) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('claims')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Get claim activities/history
   */
  async getClaimActivities(claimId: string) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('claim_activities')
      .select(`
        *,
        user:user_profiles(full_name, avatar_url)
      `)
      .eq('claim_id', claimId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ClaimActivity[];
  },

  /**
   * Log claim activity
   */
  async logActivity(
    claimId: string,
    action: string,
    details?: Record<string, unknown>
  ) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('claim_activities')
      .insert({
        claim_id: claimId,
        user_id: user?.id || null,
        action,
        action_details: details || {},
      });

    if (error) {
      console.error('Failed to log activity:', error);
    }
  },

  /**
   * Get claim statistics
   */
  async getStats(): Promise<ClaimStats> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: claims, error } = await supabase
      .from('claims')
      .select('status, billed_amount, paid_amount, denial_risk_score, denial_risk_level');

    if (error) throw error;

    const stats: ClaimStats = {
      total: claims.length,
      pending: claims.filter(c => ['draft', 'pending_review'].includes(c.status)).length,
      submitted: claims.filter(c => ['submitted', 'in_process'].includes(c.status)).length,
      denied: claims.filter(c => ['denied', 'partially_denied'].includes(c.status)).length,
      paid: claims.filter(c => c.status === 'paid').length,
      totalBilled: claims.reduce((sum, c) => sum + (c.billed_amount || 0), 0),
      totalPaid: claims.reduce((sum, c) => sum + (c.paid_amount || 0), 0),
      avgDenialRisk: claims.length > 0
        ? claims.reduce((sum, c) => sum + (c.denial_risk_score || 0), 0) / claims.length
        : 0,
      highRiskCount: claims.filter(c => c.denial_risk_level === 'high').length,
    };

    return stats;
  },

  /**
   * Calculate denial risk for a claim (client-side heuristics)
   * This is a placeholder - real AI would be server-side
   */
  calculateDenialRisk(claim: Partial<Claim>): {
    score: number;
    level: 'low' | 'medium' | 'high';
    factors: RiskFactor[];
  } {
    let score = 0;
    const factors: RiskFactor[] = [];

    // Missing procedure codes
    if (!claim.procedure_codes?.length) {
      score += 25;
      factors.push({
        factor: 'Missing procedure codes',
        impact: 'high',
        description: 'Claims without CPT codes are frequently denied',
      });
    }

    // Missing diagnosis codes
    if (!claim.diagnosis_codes?.length) {
      score += 25;
      factors.push({
        factor: 'Missing diagnosis codes',
        impact: 'high',
        description: 'ICD-10 codes are required for medical necessity',
      });
    }

    // High billed amount
    if (claim.billed_amount && claim.billed_amount > 10000) {
      score += 15;
      factors.push({
        factor: 'High billed amount',
        impact: 'medium',
        description: 'Claims over $10,000 receive additional scrutiny',
      });
    }

    // Medicare/Medicaid plans
    if (claim.plan_type === 'Medicare' || claim.plan_type === 'Medicaid') {
      score += 10;
      factors.push({
        factor: 'Government payer',
        impact: 'medium',
        description: 'Medicare/Medicaid have stricter documentation requirements',
      });
    }

    // Missing provider NPI
    if (!claim.provider_npi) {
      score += 10;
      factors.push({
        factor: 'Missing provider NPI',
        impact: 'low',
        description: 'Provider identification is required for most claims',
      });
    }

    // Missing service date
    if (!claim.service_date) {
      score += 15;
      factors.push({
        factor: 'Missing service date',
        impact: 'medium',
        description: 'Service date is required for claim processing',
      });
    }

    // Cap at 100
    score = Math.min(score, 100);

    // Determine risk level
    let level: 'low' | 'medium' | 'high' = 'low';
    if (score >= 60) level = 'high';
    else if (score >= 30) level = 'medium';

    return { score, level, factors };
  },

  /**
   * Bulk import claims from CSV data
   */
  async importClaims(claimsData: Partial<Claim>[]) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      throw new Error('User has no organization');
    }

    const claimsToInsert = claimsData.map(claim => ({
      ...getDefaultClaim(),
      ...claim,
      organization_id: profile.organization_id,
      created_by: user.id,
      source: 'import' as const,
    }));

    const { data, error } = await supabase
      .from('claims')
      .insert(claimsToInsert)
      .select();

    if (error) throw error;
    return data as Claim[];
  },
};

// Status helpers
export const STATUS_LABELS: Record<ClaimStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  submitted: 'Submitted',
  in_process: 'In Process',
  denied: 'Denied',
  partially_denied: 'Partially Denied',
  paid: 'Paid',
  appealed: 'Appealed',
  appeal_won: 'Appeal Won',
  appeal_lost: 'Appeal Lost',
  closed: 'Closed',
};

export const STATUS_COLORS: Record<ClaimStatus, string> = {
  draft: 'gray',
  pending_review: 'yellow',
  submitted: 'blue',
  in_process: 'indigo',
  denied: 'red',
  partially_denied: 'orange',
  paid: 'green',
  appealed: 'purple',
  appeal_won: 'emerald',
  appeal_lost: 'rose',
  closed: 'slate',
};

export const STATUS_ORDER: ClaimStatus[] = [
  'draft',
  'pending_review',
  'submitted',
  'in_process',
  'paid',
  'denied',
  'partially_denied',
  'appealed',
  'appeal_won',
  'appeal_lost',
  'closed',
];

// Format helpers
export const formatCurrency = (amount: number | null | undefined) => {
  if (amount == null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string | null | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (date: string | null | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

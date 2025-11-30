import { supabase } from './supabase';

// Helper to get supabase client with null check
function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }
  return supabase;
}

// ============================================
// Types
// ============================================

export type AppealStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'ready_to_submit' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'partially_approved' 
  | 'denied' 
  | 'withdrawn'
  | 'escalated';

export type AppealType = 'standard' | 'expedited' | 'external' | 'peer_to_peer';
export type AppealOutcome = 'approved' | 'partially_approved' | 'denied' | 'pending' | null;
export type AppealPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Appeal {
  id: string;
  claim_id: string;
  organization_id: string;
  created_by?: string;
  assigned_to?: string;
  
  // Identification
  appeal_number: string;
  appeal_level: number;
  appeal_type: AppealType;
  
  // Content
  appeal_letter?: string;
  appeal_summary?: string;
  appeal_grounds?: string[];
  supporting_documents?: any[];
  
  // AI fields
  ai_generated: boolean;
  ai_model?: string;
  ai_confidence?: number;
  ai_suggestions?: any[];
  
  // Denial info
  original_denial_reason?: string;
  original_denial_code?: string;
  original_denial_date?: string;
  original_denial_amount?: number;
  
  // Status
  status: AppealStatus;
  priority: AppealPriority;
  
  // Submission
  submitted_at?: string;
  submitted_by?: string;
  submission_method?: string;
  submission_reference?: string;
  
  // Response
  payer_response_date?: string;
  payer_response?: string;
  outcome?: AppealOutcome;
  outcome_date?: string;
  outcome_reason?: string;
  
  // Financial
  amount_appealed?: number;
  amount_approved?: number;
  amount_recovered?: number;
  adjustment_codes?: string[];
  
  // Deadlines
  deadline?: string;
  expected_response_date?: string;
  follow_up_date?: string;
  days_to_deadline?: number;
  
  // Meta
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Joined data
  claim?: {
    claim_number: string;
    patient_name: string;
    payer_name: string;
    service_date: string;
    billed_amount: number;
  };
  created_by_user?: { full_name: string; email: string };
  assigned_to_user?: { full_name: string; email: string };
}

export interface AppealActivity {
  id: string;
  appeal_id: string;
  user_id?: string;
  action: string;
  action_details?: Record<string, any>;
  previous_value?: string;
  new_value?: string;
  created_at: string;
  user?: { full_name: string; email: string };
}

export interface AppealTemplate {
  id: string;
  organization_id?: string;
  created_by?: string;
  name: string;
  description?: string;
  category: string;
  denial_codes?: string[];
  subject_line?: string;
  letter_template: string;
  placeholders?: string[];
  is_active: boolean;
  is_system: boolean;
  usage_count: number;
  success_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface AppealDocument {
  id: string;
  appeal_id: string;
  uploaded_by?: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  file_url?: string;
  storage_path?: string;
  document_type?: string;
  description?: string;
  created_at: string;
}

export interface AppealFilters {
  status?: AppealStatus[];
  outcome?: AppealOutcome[];
  priority?: AppealPriority[];
  appeal_type?: AppealType[];
  appeal_level?: number[];
  assigned_to?: string;
  dateRange?: { start: string; end: string };
  deadlineRange?: { start: string; end: string };
  search?: string;
}

export interface AppealStats {
  total: number;
  byStatus: Record<AppealStatus, number>;
  byOutcome: Record<string, number>;
  byPriority: Record<AppealPriority, number>;
  totalAppealed: number;
  totalRecovered: number;
  recoveryRate: number;
  avgDaysToResolution: number;
  pendingDeadlines: number;
  successRate: number;
}

// ============================================
// Appeal CRUD Operations
// ============================================

export async function getAppeals(
  filters: AppealFilters = {},
  page = 1,
  pageSize = 20,
  sortBy = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ appeals: Appeal[]; total: number }> {
  const sb = getSupabase();
  let query = sb
    .from('appeals')
    .select(`
      *,
      claim:claims(claim_number, patient_name, payer_name, service_date, billed_amount),
      created_by_user:user_profiles!appeals_created_by_fkey(full_name, email),
      assigned_to_user:user_profiles!appeals_assigned_to_fkey(full_name, email)
    `, { count: 'exact' });

  // Apply filters
  if (filters.status?.length) {
    query = query.in('status', filters.status);
  }
  if (filters.outcome?.length) {
    query = query.in('outcome', filters.outcome);
  }
  if (filters.priority?.length) {
    query = query.in('priority', filters.priority);
  }
  if (filters.appeal_type?.length) {
    query = query.in('appeal_type', filters.appeal_type);
  }
  if (filters.appeal_level?.length) {
    query = query.in('appeal_level', filters.appeal_level);
  }
  if (filters.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }
  if (filters.dateRange) {
    query = query.gte('created_at', filters.dateRange.start);
    query = query.lte('created_at', filters.dateRange.end);
  }
  if (filters.deadlineRange) {
    query = query.gte('deadline', filters.deadlineRange.start);
    query = query.lte('deadline', filters.deadlineRange.end);
  }
  if (filters.search) {
    query = query.or(`appeal_number.ilike.%${filters.search}%,original_denial_reason.ilike.%${filters.search}%`);
  }

  // Pagination and sorting
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

  const { data, count, error } = await query;
  
  if (error) throw error;
  
  return { appeals: data || [], total: count || 0 };
}

export async function getAppeal(id: string): Promise<Appeal | null> {
  const { data, error } = await getSupabase()
    .from('appeals')
    .select(`
      *,
      claim:claims(
        id, claim_number, patient_name, patient_dob, patient_id, 
        payer_name, payer_id, service_date, service_end_date,
        procedure_codes, diagnosis_codes, billed_amount, allowed_amount,
        denial_reason, denial_code, status, risk_score
      ),
      created_by_user:user_profiles!appeals_created_by_fkey(full_name, email),
      assigned_to_user:user_profiles!appeals_assigned_to_fkey(full_name, email)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createAppeal(appeal: Partial<Appeal>): Promise<Appeal> {
  // Generate appeal number
  const appealNumber = `APL-${Date.now().toString(36).toUpperCase()}`;
  
  const { data: userData } = await getSupabase().auth.getUser();
  const { data: profile } = await getSupabase()
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user?.id)
    .single();

  const newAppeal = {
    ...appeal,
    appeal_number: appealNumber,
    organization_id: profile?.organization_id,
    created_by: userData.user?.id,
    status: appeal.status || 'draft',
    priority: appeal.priority || 'normal',
    appeal_level: appeal.appeal_level || 1,
    appeal_type: appeal.appeal_type || 'standard',
  };

  const { data, error } = await getSupabase()
    .from('appeals')
    .insert(newAppeal)
    .select()
    .single();

  if (error) throw error;

  // Log activity
  await logAppealActivity(data.id, 'created', { appeal_number: data.appeal_number });

  return data;
}

export async function updateAppeal(id: string, updates: Partial<Appeal>): Promise<Appeal> {
  const { data: oldAppeal } = await getSupabase()
    .from('appeals')
    .select('*')
    .eq('id', id)
    .single();

  const { data, error } = await getSupabase()
    .from('appeals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Log status change
  if (oldAppeal && updates.status && oldAppeal.status !== updates.status) {
    await logAppealActivity(id, 'status_changed', {
      from: oldAppeal.status,
      to: updates.status,
    });
  }

  // Log outcome
  if (oldAppeal && updates.outcome && oldAppeal.outcome !== updates.outcome) {
    await logAppealActivity(id, 'outcome_received', {
      outcome: updates.outcome,
      amount_approved: updates.amount_approved,
    });
  }

  return data;
}

export async function deleteAppeal(id: string): Promise<void> {
  const { error } = await getSupabase().from('appeals').delete().eq('id', id);
  if (error) throw error;
}

export async function submitAppeal(id: string, submissionMethod: string): Promise<Appeal> {
  const { data: userData } = await getSupabase().auth.getUser();
  
  const { data, error } = await getSupabase()
    .from('appeals')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      submitted_by: userData.user?.id,
      submission_method: submissionMethod,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  await logAppealActivity(id, 'submitted', {
    method: submissionMethod,
    submitted_at: data.submitted_at,
  });

  return data;
}

// ============================================
// Appeal Activities
// ============================================

export async function getAppealActivities(appealId: string): Promise<AppealActivity[]> {
  const { data, error } = await getSupabase()
    .from('appeal_activities')
    .select(`
      *,
      user:user_profiles(full_name, email)
    `)
    .eq('appeal_id', appealId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function logAppealActivity(
  appealId: string,
  action: string,
  details?: Record<string, any>,
  previousValue?: string,
  newValue?: string
): Promise<void> {
  const { data: userData } = await getSupabase().auth.getUser();

  await getSupabase().from('appeal_activities').insert({
    appeal_id: appealId,
    user_id: userData.user?.id,
    action,
    action_details: details || {},
    previous_value: previousValue,
    new_value: newValue,
  });
}

// ============================================
// Appeal Templates
// ============================================

export async function getAppealTemplates(
  category?: string,
  includeSystem = true
): Promise<AppealTemplate[]> {
  const sb = getSupabase();
  let query = sb
    .from('appeal_templates')
    .select('*')
    .eq('is_active', true);

  if (category) {
    query = query.eq('category', category);
  }

  if (!includeSystem) {
    query = query.eq('is_system', false);
  }

  const { data, error } = await query.order('usage_count', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAppealTemplate(id: string): Promise<AppealTemplate | null> {
  const { data, error } = await getSupabase()
    .from('appeal_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createAppealTemplate(template: Partial<AppealTemplate>): Promise<AppealTemplate> {
  const { data: userData } = await getSupabase().auth.getUser();
  const { data: profile } = await getSupabase()
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user?.id)
    .single();

  const { data, error } = await getSupabase()
    .from('appeal_templates')
    .insert({
      ...template,
      organization_id: profile?.organization_id,
      created_by: userData.user?.id,
      is_system: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAppealTemplate(
  id: string,
  updates: Partial<AppealTemplate>
): Promise<AppealTemplate> {
  const { data, error } = await getSupabase()
    .from('appeal_templates')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function incrementTemplateUsage(id: string): Promise<void> {
  const { data: template } = await getSupabase()
    .from('appeal_templates')
    .select('usage_count')
    .eq('id', id)
    .single();

  await getSupabase()
    .from('appeal_templates')
    .update({ usage_count: (template?.usage_count || 0) + 1 })
    .eq('id', id);
}

// ============================================
// Appeal Statistics
// ============================================

export async function getAppealStats(): Promise<AppealStats> {
  const { data, error } = await getSupabase()
    .from('appeals')
    .select('*');

  if (error) throw error;

  const appeals = data || [];
  
  const stats: AppealStats = {
    total: appeals.length,
    byStatus: {} as Record<AppealStatus, number>,
    byOutcome: {},
    byPriority: {} as Record<AppealPriority, number>,
    totalAppealed: 0,
    totalRecovered: 0,
    recoveryRate: 0,
    avgDaysToResolution: 0,
    pendingDeadlines: 0,
    successRate: 0,
  };

  const statusCounts: Record<string, number> = {};
  const outcomeCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};
  let resolvedCount = 0;
  let totalDays = 0;
  let successCount = 0;
  const today = new Date();

  appeals.forEach(appeal => {
    // Status counts
    statusCounts[appeal.status] = (statusCounts[appeal.status] || 0) + 1;

    // Outcome counts
    if (appeal.outcome) {
      outcomeCounts[appeal.outcome] = (outcomeCounts[appeal.outcome] || 0) + 1;
      if (appeal.outcome === 'approved' || appeal.outcome === 'partially_approved') {
        successCount++;
      }
    }

    // Priority counts
    priorityCounts[appeal.priority] = (priorityCounts[appeal.priority] || 0) + 1;

    // Financial totals
    stats.totalAppealed += appeal.amount_appealed || 0;
    stats.totalRecovered += appeal.amount_recovered || 0;

    // Resolution time
    if (appeal.outcome_date && appeal.created_at) {
      const created = new Date(appeal.created_at);
      const resolved = new Date(appeal.outcome_date);
      totalDays += Math.floor((resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      resolvedCount++;
    }

    // Pending deadlines (within 7 days)
    if (appeal.deadline && appeal.status !== 'submitted' && appeal.status !== 'approved' && appeal.status !== 'denied') {
      const deadline = new Date(appeal.deadline);
      const daysToDeadline = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysToDeadline <= 7 && daysToDeadline >= 0) {
        stats.pendingDeadlines++;
      }
    }
  });

  stats.byStatus = statusCounts as Record<AppealStatus, number>;
  stats.byOutcome = outcomeCounts;
  stats.byPriority = priorityCounts as Record<AppealPriority, number>;
  stats.recoveryRate = stats.totalAppealed > 0 
    ? (stats.totalRecovered / stats.totalAppealed) * 100 
    : 0;
  stats.avgDaysToResolution = resolvedCount > 0 ? Math.round(totalDays / resolvedCount) : 0;
  stats.successRate = (outcomeCounts.approved || 0) + (outcomeCounts.partially_approved || 0) + (outcomeCounts.denied || 0) > 0
    ? (successCount / ((outcomeCounts.approved || 0) + (outcomeCounts.partially_approved || 0) + (outcomeCounts.denied || 0))) * 100
    : 0;

  return stats;
}

// ============================================
// Helper Functions
// ============================================

export function applyTemplate(
  template: AppealTemplate,
  data: Record<string, string>
): string {
  let letter = template.letter_template;
  
  // Replace all placeholders
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    letter = letter.replace(regex, value || '');
  });

  return letter;
}

export function getDefaultTemplateData(claim: any): Record<string, string> {
  const today = new Date();
  return {
    current_date: today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    claim_number: claim?.claim_number || '',
    patient_name: claim?.patient_name || '',
    patient_id: claim?.patient_id || '',
    service_date: claim?.service_date 
      ? new Date(claim.service_date).toLocaleDateString() 
      : '',
    denial_date: claim?.denial_date 
      ? new Date(claim.denial_date).toLocaleDateString() 
      : '',
    payer_name: claim?.payer_name || '',
    payer_address: '', // Would need to be filled in
    procedure_codes: claim?.procedure_codes?.join(', ') || '',
    diagnosis_codes: claim?.diagnosis_codes?.join(', ') || '',
    provider_name: '',
    provider_npi: '',
    provider_credentials: '',
    facility_name: '',
  };
}

// ============================================
// Constants
// ============================================

export const STATUS_LABELS: Record<AppealStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  ready_to_submit: 'Ready to Submit',
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  partially_approved: 'Partially Approved',
  denied: 'Denied',
  withdrawn: 'Withdrawn',
  escalated: 'Escalated',
};

export const STATUS_COLORS: Record<AppealStatus, string> = {
  draft: 'gray',
  pending_review: 'yellow',
  ready_to_submit: 'blue',
  submitted: 'indigo',
  under_review: 'purple',
  approved: 'green',
  partially_approved: 'lime',
  denied: 'red',
  withdrawn: 'slate',
  escalated: 'orange',
};

export const PRIORITY_LABELS: Record<AppealPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
};

export const PRIORITY_COLORS: Record<AppealPriority, string> = {
  low: 'slate',
  normal: 'blue',
  high: 'orange',
  urgent: 'red',
};

export const APPEAL_TYPE_LABELS: Record<AppealType, string> = {
  standard: 'Standard',
  expedited: 'Expedited',
  external: 'External Review',
  peer_to_peer: 'Peer to Peer',
};

export const OUTCOME_LABELS: Record<string, string> = {
  approved: 'Approved',
  partially_approved: 'Partially Approved',
  denied: 'Denied',
  pending: 'Pending',
};

export const TEMPLATE_CATEGORIES = [
  { value: 'medical_necessity', label: 'Medical Necessity' },
  { value: 'authorization', label: 'Prior Authorization' },
  { value: 'coding', label: 'Coding/Billing' },
  { value: 'timely_filing', label: 'Timely Filing' },
  { value: 'eligibility', label: 'Eligibility' },
  { value: 'duplicate', label: 'Duplicate Claim' },
  { value: 'custom', label: 'Custom' },
];

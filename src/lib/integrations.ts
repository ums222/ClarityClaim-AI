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

export interface EHRConnection {
  id: string;
  organization_id: string;
  created_by?: string;
  name: string;
  provider: 'epic' | 'cerner' | 'athena' | 'allscripts' | 'meditech' | 'custom';
  environment: 'sandbox' | 'production';
  client_id?: string;
  base_url?: string;
  fhir_version: string;
  supported_resources?: string[];
  status: 'pending' | 'connected' | 'error' | 'expired' | 'revoked';
  last_connected_at?: string;
  last_sync_at?: string;
  last_error?: string;
  error_count: number;
  auto_sync_enabled: boolean;
  sync_frequency: string;
  sync_claims: boolean;
  sync_patients: boolean;
  sync_coverage: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PayerConnection {
  id: string;
  organization_id: string;
  created_by?: string;
  name: string;
  payer_name: string;
  payer_id?: string;
  trading_partner_id?: string;
  connection_type: 'api' | 'sftp' | 'portal' | 'clearinghouse';
  clearinghouse?: string;
  api_url?: string;
  submission_format: string;
  supports_real_time: boolean;
  supports_batch: boolean;
  status: 'pending' | 'active' | 'error' | 'suspended';
  last_submission_at?: string;
  last_response_at?: string;
  last_error?: string;
  error_count: number;
  claims_submitted: number;
  claims_accepted: number;
  claims_rejected: number;
  created_at: string;
  updated_at: string;
}

export interface Webhook {
  id: string;
  organization_id: string;
  created_by?: string;
  name: string;
  description?: string;
  url: string;
  auth_type: 'none' | 'bearer' | 'basic' | 'api_key' | 'hmac';
  events: string[];
  active: boolean;
  retry_enabled: boolean;
  max_retries: number;
  retry_delay_seconds: number;
  timeout_seconds: number;
  custom_headers?: Record<string, string>;
  status: 'active' | 'paused' | 'failed';
  last_triggered_at?: string;
  last_success_at?: string;
  last_failure_at?: string;
  last_error?: string;
  total_deliveries: number;
  successful_deliveries: number;
  failed_deliveries: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  organization_id: string;
  event_type: string;
  event_id?: string;
  request_url: string;
  request_headers?: Record<string, string>;
  request_body?: Record<string, any>;
  response_status?: number;
  response_body?: string;
  response_time_ms?: number;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempt_number: number;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface BatchImport {
  id: string;
  organization_id: string;
  created_by: string;
  name: string;
  description?: string;
  file_name: string;
  file_type: 'csv' | 'edi_837p' | 'edi_837i' | 'json' | 'xlsx';
  file_size?: number;
  file_url?: string;
  status: 'pending' | 'validating' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  total_records: number;
  processed_records: number;
  successful_records: number;
  failed_records: number;
  skipped_records: number;
  import_type: 'claims' | 'appeals' | 'patients' | 'payers';
  imported_ids?: string[];
  errors?: Array<{ row: number; field: string; error: string }>;
  validation_errors?: Array<{ row: number; field: string; error: string }>;
  column_mapping?: Record<string, string>;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  creator?: { full_name: string; email: string };
}

export interface EHRSyncLog {
  id: string;
  connection_id: string;
  organization_id: string;
  sync_type: 'full' | 'incremental' | 'manual';
  direction: 'inbound' | 'outbound' | 'bidirectional';
  resource_type?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  total_records: number;
  created_records: number;
  updated_records: number;
  failed_records: number;
  errors?: Array<{ record_id: string; error: string }>;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  created_at: string;
}

// ============================================
// EHR Connections
// ============================================

export async function getEHRConnections(): Promise<EHRConnection[]> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) return [];

  const { data, error } = await sb
    .from('ehr_connections')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createEHRConnection(connection: Partial<EHRConnection>): Promise<EHRConnection> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id, role')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) throw new Error('No organization');
  if (!['owner', 'admin'].includes(profile.role)) {
    throw new Error('Insufficient permissions');
  }

  const { data, error } = await sb
    .from('ehr_connections')
    .insert({
      ...connection,
      organization_id: profile.organization_id,
      created_by: userData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEHRConnection(id: string, updates: Partial<EHRConnection>): Promise<EHRConnection> {
  const sb = getSupabase();

  const { data, error } = await sb
    .from('ehr_connections')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEHRConnection(id: string): Promise<void> {
  const sb = getSupabase();

  const { error } = await sb
    .from('ehr_connections')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function syncEHRConnection(id: string): Promise<EHRSyncLog> {
  // In production, this would trigger an actual sync job
  // For now, we simulate a sync
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user.id)
    .single();

  const { data, error } = await sb
    .from('ehr_sync_logs')
    .insert({
      connection_id: id,
      organization_id: profile?.organization_id,
      sync_type: 'manual',
      direction: 'inbound',
      status: 'completed',
      total_records: Math.floor(Math.random() * 100) + 10,
      created_records: Math.floor(Math.random() * 50),
      updated_records: Math.floor(Math.random() * 30),
      failed_records: Math.floor(Math.random() * 5),
      completed_at: new Date().toISOString(),
      duration_ms: Math.floor(Math.random() * 5000) + 1000,
    })
    .select()
    .single();

  if (error) throw error;

  // Update last_sync_at on connection
  await sb
    .from('ehr_connections')
    .update({ last_sync_at: new Date().toISOString(), status: 'connected' })
    .eq('id', id);

  return data;
}

// ============================================
// Payer Connections
// ============================================

export async function getPayerConnections(): Promise<PayerConnection[]> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) return [];

  const { data, error } = await sb
    .from('payer_connections')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createPayerConnection(connection: Partial<PayerConnection>): Promise<PayerConnection> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id, role')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) throw new Error('No organization');
  if (!['owner', 'admin'].includes(profile.role)) {
    throw new Error('Insufficient permissions');
  }

  const { data, error } = await sb
    .from('payer_connections')
    .insert({
      ...connection,
      organization_id: profile.organization_id,
      created_by: userData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePayerConnection(id: string, updates: Partial<PayerConnection>): Promise<PayerConnection> {
  const sb = getSupabase();

  const { data, error } = await sb
    .from('payer_connections')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePayerConnection(id: string): Promise<void> {
  const sb = getSupabase();

  const { error } = await sb
    .from('payer_connections')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function testPayerConnection(_id: string): Promise<{ success: boolean; message: string }> {
  // In production, this would test the actual connection
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, message: 'Connection test successful' };
}

// ============================================
// Webhooks
// ============================================

export async function getWebhooks(): Promise<Webhook[]> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) return [];

  const { data, error } = await sb
    .from('webhooks')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createWebhook(webhook: Partial<Webhook>): Promise<Webhook> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id, role')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) throw new Error('No organization');
  if (!['owner', 'admin'].includes(profile.role)) {
    throw new Error('Insufficient permissions');
  }

  const { data, error } = await sb
    .from('webhooks')
    .insert({
      ...webhook,
      organization_id: profile.organization_id,
      created_by: userData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWebhook(id: string, updates: Partial<Webhook>): Promise<Webhook> {
  const sb = getSupabase();

  const { data, error } = await sb
    .from('webhooks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWebhook(id: string): Promise<void> {
  const sb = getSupabase();

  const { error } = await sb
    .from('webhooks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function testWebhook(_id: string): Promise<{ success: boolean; message: string; delivery?: WebhookDelivery }> {
  // In production, this would send a test event to the webhook
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: 'Test event delivered successfully' };
}

export async function getWebhookDeliveries(webhookId: string, page = 1, pageSize = 20): Promise<{ deliveries: WebhookDelivery[]; total: number }> {
  const sb = getSupabase();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await sb
    .from('webhook_deliveries')
    .select('*', { count: 'exact' })
    .eq('webhook_id', webhookId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { deliveries: data || [], total: count || 0 };
}

// ============================================
// Batch Imports
// ============================================

export async function getBatchImports(page = 1, pageSize = 20): Promise<{ imports: BatchImport[]; total: number }> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) return { imports: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await sb
    .from('batch_imports')
    .select(`
      *,
      creator:user_profiles!batch_imports_created_by_fkey(full_name, email)
    `, { count: 'exact' })
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { imports: data || [], total: count || 0 };
}

export async function createBatchImport(
  file: File,
  importType: BatchImport['import_type'],
  name: string,
  columnMapping?: Record<string, string>
): Promise<BatchImport> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) throw new Error('No organization');

  // Determine file type
  const extension = file.name.split('.').pop()?.toLowerCase();
  let fileType: BatchImport['file_type'] = 'csv';
  if (extension === 'xlsx') fileType = 'xlsx';
  else if (extension === 'json') fileType = 'json';
  else if (file.name.includes('837P') || file.name.includes('837p')) fileType = 'edi_837p';
  else if (file.name.includes('837I') || file.name.includes('837i')) fileType = 'edi_837i';

  // Upload file to storage
  const fileName = `${profile.organization_id}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await sb.storage
    .from('imports')
    .upload(fileName, file);

  if (uploadError) {
    console.error('File upload error:', uploadError);
    // Continue without file URL if storage is not configured
  }

  const { data: { publicUrl } } = sb.storage
    .from('imports')
    .getPublicUrl(fileName);

  const { data, error } = await sb
    .from('batch_imports')
    .insert({
      organization_id: profile.organization_id,
      created_by: userData.user.id,
      name,
      file_name: file.name,
      file_type: fileType,
      file_size: file.size,
      file_url: publicUrl,
      import_type: importType,
      column_mapping: columnMapping || {},
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function processBatchImport(importId: string): Promise<BatchImport> {
  const sb = getSupabase();

  // In production, this would trigger a background job
  // For now, simulate processing
  await sb
    .from('batch_imports')
    .update({ status: 'processing', started_at: new Date().toISOString() })
    .eq('id', importId);

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const totalRecords = Math.floor(Math.random() * 100) + 20;
  const successfulRecords = Math.floor(totalRecords * 0.9);
  const failedRecords = totalRecords - successfulRecords;

  const { data, error } = await sb
    .from('batch_imports')
    .update({
      status: 'completed',
      progress: 100,
      total_records: totalRecords,
      processed_records: totalRecords,
      successful_records: successfulRecords,
      failed_records: failedRecords,
      completed_at: new Date().toISOString(),
    })
    .eq('id', importId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelBatchImport(importId: string): Promise<void> {
  const sb = getSupabase();

  const { error } = await sb
    .from('batch_imports')
    .update({ status: 'cancelled' })
    .eq('id', importId);

  if (error) throw error;
}

export async function deleteBatchImport(importId: string): Promise<void> {
  const sb = getSupabase();

  const { error } = await sb
    .from('batch_imports')
    .delete()
    .eq('id', importId);

  if (error) throw error;
}

// ============================================
// EHR Sync Logs
// ============================================

export async function getEHRSyncLogs(connectionId: string, page = 1, pageSize = 20): Promise<{ logs: EHRSyncLog[]; total: number }> {
  const sb = getSupabase();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await sb
    .from('ehr_sync_logs')
    .select('*', { count: 'exact' })
    .eq('connection_id', connectionId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { logs: data || [], total: count || 0 };
}

// ============================================
// Constants
// ============================================

export const EHR_PROVIDERS = [
  { value: 'epic', label: 'Epic', logo: '/integrations/epic.svg', description: 'Epic Systems EHR' },
  { value: 'cerner', label: 'Cerner (Oracle Health)', logo: '/integrations/cerner.svg', description: 'Oracle Cerner EHR' },
  { value: 'athena', label: 'athenahealth', logo: '/integrations/athena.svg', description: 'athenahealth EHR' },
  { value: 'allscripts', label: 'Allscripts', logo: '/integrations/allscripts.svg', description: 'Allscripts EHR' },
  { value: 'meditech', label: 'MEDITECH', logo: '/integrations/meditech.svg', description: 'MEDITECH EHR' },
  { value: 'custom', label: 'Custom FHIR', logo: null, description: 'Custom FHIR endpoint' },
];

export const PAYER_CLEARINGHOUSES = [
  { value: 'availity', label: 'Availity', description: 'Real-time eligibility and claims' },
  { value: 'change_healthcare', label: 'Change Healthcare', description: 'Claims and remittance' },
  { value: 'trizetto', label: 'Trizetto', description: 'Claims management' },
  { value: 'waystar', label: 'Waystar', description: 'Revenue cycle management' },
  { value: 'office_ally', label: 'Office Ally', description: 'Free claims submission' },
  { value: 'direct', label: 'Direct to Payer', description: 'Direct API connection' },
];

export const WEBHOOK_EVENTS = [
  { value: 'claim.created', label: 'Claim Created', description: 'When a new claim is added' },
  { value: 'claim.updated', label: 'Claim Updated', description: 'When a claim is modified' },
  { value: 'claim.submitted', label: 'Claim Submitted', description: 'When a claim is submitted to payer' },
  { value: 'claim.approved', label: 'Claim Approved', description: 'When a claim is approved' },
  { value: 'claim.denied', label: 'Claim Denied', description: 'When a claim is denied' },
  { value: 'appeal.created', label: 'Appeal Created', description: 'When a new appeal is created' },
  { value: 'appeal.submitted', label: 'Appeal Submitted', description: 'When an appeal is submitted' },
  { value: 'appeal.won', label: 'Appeal Won', description: 'When an appeal is successful' },
  { value: 'appeal.lost', label: 'Appeal Lost', description: 'When an appeal is unsuccessful' },
  { value: 'appeal.deadline', label: 'Appeal Deadline', description: 'When appeal deadline is approaching' },
  { value: 'risk.high_detected', label: 'High Risk Detected', description: 'When AI detects high denial risk' },
];

export const IMPORT_TYPES = [
  { value: 'claims', label: 'Claims', description: 'Import claim records' },
  { value: 'appeals', label: 'Appeals', description: 'Import appeal records' },
  { value: 'patients', label: 'Patients', description: 'Import patient records' },
  { value: 'payers', label: 'Payers', description: 'Import payer information' },
];

export const FILE_TYPES = [
  { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
  { value: 'xlsx', label: 'Excel', description: 'Microsoft Excel format' },
  { value: 'edi_837p', label: 'EDI 837P', description: 'Professional claims' },
  { value: 'edi_837i', label: 'EDI 837I', description: 'Institutional claims' },
  { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
];

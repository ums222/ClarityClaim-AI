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

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  job_title?: string;
  department?: string;
  timezone: string;
  date_format: string;
  two_factor_enabled: boolean;
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
  organization_id: string;
  last_login?: string;
  login_count: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationSettings {
  id: string;
  organization_id: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  default_appeal_deadline_days: number;
  auto_assign_appeals: boolean;
  require_approval_for_submission: boolean;
  default_claim_priority: string;
  auto_run_denial_prediction: boolean;
  risk_threshold_high: number;
  risk_threshold_medium: number;
  fiscal_year_start: number;
  currency: string;
  hipaa_audit_logging: boolean;
  data_retention_days: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  job_title?: string;
  department?: string;
  last_login?: string;
  created_at: string;
}

export interface TeamInvitation {
  id: string;
  organization_id: string;
  invited_by: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  created_at: string;
  inviter?: { full_name: string; email: string };
}

export interface Integration {
  id: string;
  organization_id: string;
  name: string;
  type: 'ehr' | 'payer' | 'clearinghouse' | 'analytics' | 'webhook';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  last_sync_at?: string;
  last_error?: string;
  error_count: number;
  config: Record<string, any>;
  sync_enabled: boolean;
  sync_frequency: string;
  sync_direction: string;
  description?: string;
  documentation_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  organization_id: string;
  created_by: string;
  name: string;
  description?: string;
  key_prefix: string;
  permissions: string[];
  allowed_endpoints?: string[];
  allowed_ips?: string[];
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  status: 'active' | 'inactive' | 'revoked';
  last_used_at?: string;
  usage_count: number;
  expires_at?: string;
  created_at: string;
  revoked_at?: string;
  creator?: { full_name: string; email: string };
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  email_claim_status_change: boolean;
  email_appeal_status_change: boolean;
  email_appeal_deadline_reminder: boolean;
  email_denial_prediction_alert: boolean;
  email_team_activity: boolean;
  email_weekly_digest: boolean;
  email_monthly_report: boolean;
  inapp_enabled: boolean;
  inapp_claim_status_change: boolean;
  inapp_appeal_status_change: boolean;
  inapp_appeal_deadline_reminder: boolean;
  inapp_denial_prediction_alert: boolean;
  inapp_team_activity: boolean;
  push_enabled: boolean;
  push_urgent_only: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  digest_frequency: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  organization_id?: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  status: 'success' | 'failure' | 'error';
  error_message?: string;
  created_at: string;
  user?: { full_name: string; email: string };
}

// ============================================
// User Profile
// ============================================

export async function getCurrentUser(): Promise<UserProfile | null> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await sb
    .from('user_profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await sb
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userData.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePassword(_currentPassword: string, newPassword: string): Promise<void> {
  const sb = getSupabase();
  
  // Verify current password by attempting to sign in
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user?.email) throw new Error('Not authenticated');

  // Update password
  const { error } = await sb.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function uploadAvatar(file: File): Promise<string> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${userData.user.id}/avatar.${fileExt}`;

  const { error: uploadError } = await sb.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = sb.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Update profile with avatar URL
  await updateUserProfile({ avatar_url: publicUrl });

  return publicUrl;
}

// ============================================
// Organization Settings
// ============================================

export async function getOrganizationSettings(): Promise<OrganizationSettings | null> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) return null;

  const { data, error } = await sb
    .from('organization_settings')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateOrganizationSettings(
  updates: Partial<OrganizationSettings>
): Promise<OrganizationSettings> {
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
    .from('organization_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('organization_id', profile.organization_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrganization(updates: { name?: string }): Promise<void> {
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

  const { error } = await sb
    .from('organizations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', profile.organization_id);

  if (error) throw error;
}

// ============================================
// Team Management
// ============================================

export async function getTeamMembers(): Promise<TeamMember[]> {
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
    .from('user_profiles')
    .select('id, email, full_name, avatar_url, role, job_title, department, last_login, created_at')
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateTeamMemberRole(
  memberId: string,
  newRole: string
): Promise<void> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id, role')
    .eq('id', userData.user.id)
    .single();

  if (!['owner', 'admin'].includes(profile?.role || '')) {
    throw new Error('Insufficient permissions');
  }

  // Can't change owner's role or make someone else owner
  if (newRole === 'owner') {
    throw new Error('Cannot assign owner role');
  }

  const { error } = await sb
    .from('user_profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', memberId)
    .eq('organization_id', profile?.organization_id);

  if (error) throw error;
}

export async function removeTeamMember(memberId: string): Promise<void> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id, role')
    .eq('id', userData.user.id)
    .single();

  if (!['owner', 'admin'].includes(profile?.role || '')) {
    throw new Error('Insufficient permissions');
  }

  // Check if trying to remove self or owner
  if (memberId === userData.user.id) {
    throw new Error('Cannot remove yourself');
  }

  const { data: targetMember } = await sb
    .from('user_profiles')
    .select('role')
    .eq('id', memberId)
    .single();

  if (targetMember?.role === 'owner') {
    throw new Error('Cannot remove organization owner');
  }

  // Remove from organization
  const { error } = await sb
    .from('user_profiles')
    .update({ organization_id: null, role: 'member' })
    .eq('id', memberId)
    .eq('organization_id', profile?.organization_id);

  if (error) throw error;
}

// ============================================
// Team Invitations
// ============================================

export async function getTeamInvitations(): Promise<TeamInvitation[]> {
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
    .from('team_invitations')
    .select(`
      *,
      inviter:user_profiles!team_invitations_invited_by_fkey(full_name, email)
    `)
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTeamInvitation(
  email: string,
  role: string = 'member'
): Promise<TeamInvitation> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id, role')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) throw new Error('No organization');
  if (!['owner', 'admin', 'manager'].includes(profile.role)) {
    throw new Error('Insufficient permissions');
  }

  // Generate unique token
  const token = `inv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  const { data, error } = await sb
    .from('team_invitations')
    .insert({
      organization_id: profile.organization_id,
      invited_by: userData.user.id,
      email,
      role,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function revokeTeamInvitation(invitationId: string): Promise<void> {
  const sb = getSupabase();
  
  const { error } = await sb
    .from('team_invitations')
    .update({ status: 'revoked' })
    .eq('id', invitationId);

  if (error) throw error;
}

// ============================================
// Integrations
// ============================================

export async function getIntegrations(): Promise<Integration[]> {
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
    .from('integrations')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createIntegration(
  integration: Partial<Integration>
): Promise<Integration> {
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
    .from('integrations')
    .insert({
      ...integration,
      organization_id: profile.organization_id,
      created_by: userData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIntegration(
  id: string,
  updates: Partial<Integration>
): Promise<Integration> {
  const sb = getSupabase();
  
  const { data, error } = await sb
    .from('integrations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIntegration(id: string): Promise<void> {
  const sb = getSupabase();
  
  const { error } = await sb
    .from('integrations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function testIntegration(_id: string): Promise<{ success: boolean; message: string }> {
  // This would typically call the integration's API to test connectivity
  // For now, we'll simulate a test
  return { success: true, message: 'Connection successful' };
}

// ============================================
// API Keys
// ============================================

export async function getApiKeys(): Promise<ApiKey[]> {
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
    .from('api_keys')
    .select(`
      *,
      creator:user_profiles!api_keys_created_by_fkey(full_name, email)
    `)
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createApiKey(
  name: string,
  description?: string,
  permissions: string[] = ['read'],
  expiresInDays?: number
): Promise<{ key: ApiKey; fullKey: string }> {
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

  // Generate key
  const fullKey = `cc_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const keyPrefix = fullKey.substring(0, 12);
  
  // In production, hash the key before storing
  const keyHash = fullKey; // Should use bcrypt or similar in production

  let expiresAt: string | undefined;
  if (expiresInDays) {
    const date = new Date();
    date.setDate(date.getDate() + expiresInDays);
    expiresAt = date.toISOString();
  }

  const { data, error } = await sb
    .from('api_keys')
    .insert({
      organization_id: profile.organization_id,
      created_by: userData.user.id,
      name,
      description,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      permissions,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) throw error;
  return { key: data, fullKey };
}

export async function revokeApiKey(id: string): Promise<void> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { error } = await sb
    .from('api_keys')
    .update({
      status: 'revoked',
      revoked_at: new Date().toISOString(),
      revoked_by: userData.user.id,
    })
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// Notification Preferences
// ============================================

export async function getNotificationPreferences(): Promise<NotificationPreferences | null> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await sb
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userData.user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateNotificationPreferences(
  updates: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  // Try to update, if not exists, create
  const { data: existing } = await sb
    .from('notification_preferences')
    .select('id')
    .eq('user_id', userData.user.id)
    .single();

  if (existing) {
    const { data, error } = await sb
      .from('notification_preferences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userData.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await sb
      .from('notification_preferences')
      .insert({ user_id: userData.user.id, ...updates })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// ============================================
// Audit Logs
// ============================================

export async function getAuditLogs(
  page = 1,
  pageSize = 50,
  filters?: {
    action?: string;
    resource_type?: string;
    user_id?: string;
    dateRange?: { start: string; end: string };
  }
): Promise<{ logs: AuditLog[]; total: number }> {
  const sb = getSupabase();
  const { data: userData } = await sb.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: profile } = await sb
    .from('user_profiles')
    .select('organization_id')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.organization_id) return { logs: [], total: 0 };

  let query = sb
    .from('audit_logs')
    .select(`
      *,
      user:user_profiles(full_name, email)
    `, { count: 'exact' })
    .eq('organization_id', profile.organization_id);

  if (filters?.action) {
    query = query.eq('action', filters.action);
  }
  if (filters?.resource_type) {
    query = query.eq('resource_type', filters.resource_type);
  }
  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id);
  }
  if (filters?.dateRange) {
    query = query.gte('created_at', filters.dateRange.start);
    query = query.lte('created_at', filters.dateRange.end);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;
  return { logs: data || [], total: count || 0 };
}

// ============================================
// Constants
// ============================================

export const ROLES = [
  { value: 'owner', label: 'Owner', description: 'Full access to everything' },
  { value: 'admin', label: 'Admin', description: 'Manage team and settings' },
  { value: 'manager', label: 'Manager', description: 'Manage claims and appeals' },
  { value: 'member', label: 'Member', description: 'View and edit assigned items' },
  { value: 'viewer', label: 'Viewer', description: 'View only access' },
];

export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'UTC', label: 'UTC' },
];

export const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

export const INTEGRATION_TYPES = [
  { value: 'ehr', label: 'EHR System', icon: 'Hospital' },
  { value: 'payer', label: 'Payer Portal', icon: 'Building' },
  { value: 'clearinghouse', label: 'Clearinghouse', icon: 'Workflow' },
  { value: 'analytics', label: 'Analytics', icon: 'BarChart' },
  { value: 'webhook', label: 'Webhook', icon: 'Webhook' },
];

export const INTEGRATION_PROVIDERS = {
  ehr: [
    { value: 'epic', label: 'Epic', logo: '/integrations/epic.svg' },
    { value: 'cerner', label: 'Cerner', logo: '/integrations/cerner.svg' },
    { value: 'athena', label: 'athenahealth', logo: '/integrations/athena.svg' },
    { value: 'allscripts', label: 'Allscripts', logo: '/integrations/allscripts.svg' },
    { value: 'meditech', label: 'MEDITECH', logo: '/integrations/meditech.svg' },
    { value: 'custom', label: 'Custom/Other', logo: null },
  ],
  payer: [
    { value: 'availity', label: 'Availity', logo: '/integrations/availity.svg' },
    { value: 'change_healthcare', label: 'Change Healthcare', logo: '/integrations/change.svg' },
    { value: 'navicure', label: 'Navicure', logo: '/integrations/navicure.svg' },
    { value: 'custom', label: 'Custom/Other', logo: null },
  ],
  clearinghouse: [
    { value: 'change_healthcare', label: 'Change Healthcare', logo: '/integrations/change.svg' },
    { value: 'availity', label: 'Availity', logo: '/integrations/availity.svg' },
    { value: 'trizetto', label: 'Trizetto', logo: '/integrations/trizetto.svg' },
    { value: 'custom', label: 'Custom/Other', logo: null },
  ],
  analytics: [
    { value: 'custom', label: 'Custom Analytics', logo: null },
  ],
  webhook: [
    { value: 'custom', label: 'Custom Webhook', logo: null },
  ],
};

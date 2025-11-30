import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Get auth header
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============================================
// Types
// ============================================

export interface TwoFactorSettings {
  id: string;
  user_id: string;
  totp_enabled: boolean;
  totp_verified_at?: string;
  sms_enabled: boolean;
  sms_phone_number?: string;
  sms_verified_at?: string;
  backup_codes_generated_at?: string;
  backup_codes_used: number;
  recovery_email?: string;
  require_2fa_for_sensitive: boolean;
  trusted_devices: TrustedDevice[];
  created_at: string;
  updated_at: string;
}

export interface TrustedDevice {
  id: string;
  name: string;
  browser: string;
  os: string;
  last_used: string;
  trusted_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  device_name?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  ip_address?: string;
  location_city?: string;
  location_country?: string;
  is_current: boolean;
  is_trusted: boolean;
  last_active_at: string;
  expires_at: string;
  status: 'active' | 'expired' | 'revoked' | 'suspicious';
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  action_type: string;
  action_category: string;
  resource_type?: string;
  resource_id?: string;
  resource_name?: string;
  phi_accessed: boolean;
  phi_fields_accessed?: string[];
  description?: string;
  severity: 'info' | 'warning' | 'alert' | 'critical';
  ip_address?: string;
  created_at: string;
}

export interface RolePermission {
  id: string;
  organization_id: string;
  role: string;
  role_name: string;
  role_description?: string;
  is_custom: boolean;
  is_system: boolean;
  permissions: PermissionsMap;
  phi_access_level: 'none' | 'limited' | 'full';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PermissionsMap {
  claims: ResourcePermissions;
  appeals: ResourcePermissions;
  patients: PatientPermissions;
  analytics: { view: boolean; export: boolean };
  integrations: { view: boolean; manage: boolean };
  team: TeamPermissions;
  billing: { view: boolean; manage: boolean };
  settings: { view: boolean; manage: boolean };
  security: SecurityPermissions;
  api: ApiPermissions;
}

export interface ResourcePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export?: boolean;
  submit?: boolean;
}

export interface PatientPermissions extends ResourcePermissions {
  view_phi: boolean;
}

export interface TeamPermissions {
  view: boolean;
  invite: boolean;
  manage_roles: boolean;
  remove: boolean;
}

export interface SecurityPermissions {
  view_logs: boolean;
  manage_2fa: boolean;
  manage_sessions: boolean;
}

export interface ApiPermissions {
  view_keys: boolean;
  create_keys: boolean;
  revoke_keys: boolean;
}

export interface SecuritySettings {
  id: string;
  organization_id: string;
  
  // 2FA
  require_2fa_all_users: boolean;
  require_2fa_admins: boolean;
  require_2fa_phi_access: boolean;
  allowed_2fa_methods: string[];
  
  // Session
  session_timeout_minutes: number;
  absolute_session_timeout_hours: number;
  max_concurrent_sessions: number;
  force_single_session: boolean;
  notify_new_session: boolean;
  
  // Password Policy
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  password_require_special: boolean;
  password_expiry_days: number;
  password_history_count: number;
  
  // Login Security
  max_login_attempts: number;
  lockout_duration_minutes: number;
  notify_failed_logins: boolean;
  notify_login_from_new_device: boolean;
  notify_login_from_new_location: boolean;
  
  // IP Restrictions
  ip_whitelist_enabled: boolean;
  ip_whitelist: string[];
  ip_blacklist: string[];
  
  // Data Security
  encryption_at_rest: boolean;
  encryption_in_transit: boolean;
  phi_access_logging: boolean;
  auto_logout_on_close: boolean;
  mask_phi_in_logs: boolean;
  
  // Audit
  audit_log_retention_days: number;
  detailed_audit_logging: boolean;
  export_audit_logs_enabled: boolean;
  
  // Compliance
  hipaa_mode: boolean;
  baa_signed: boolean;
  baa_signed_date?: string;
  compliance_officer_email?: string;
  last_security_review?: string;
  next_security_review?: string;
  
  created_at: string;
  updated_at: string;
}

export interface LoginHistoryEntry {
  id: string;
  user_id: string;
  login_type: string;
  status: 'success' | 'failed' | 'blocked' | 'locked';
  failure_reason?: string;
  ip_address?: string;
  user_agent?: string;
  location_city?: string;
  location_country?: string;
  used_2fa: boolean;
  twofa_method?: string;
  risk_score: number;
  is_suspicious: boolean;
  created_at: string;
}

export interface EncryptionStatus {
  at_rest: {
    enabled: boolean;
    algorithm: string;
    key_rotation_days: number;
    last_rotation?: string;
  };
  in_transit: {
    enabled: boolean;
    tls_version: string;
    cipher_suites: string[];
  };
  phi_encryption: {
    enabled: boolean;
    fields_encrypted: string[];
    last_audit?: string;
  };
}

// ============================================
// Two-Factor Authentication API
// ============================================

export async function get2FASettings(): Promise<TwoFactorSettings | null> {
  try {
    const response = await axios.get(`${API_URL}/security/2fa`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching 2FA settings:', error);
    return null;
  }
}

export async function setup2FA(): Promise<{ secret: string; qrCode: string; backupCodes: string[] }> {
  const response = await axios.post(
    `${API_URL}/security/2fa/setup`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
}

export async function verify2FA(code: string): Promise<{ success: boolean }> {
  const response = await axios.post(
    `${API_URL}/security/2fa/verify`,
    { code },
    { headers: getAuthHeader() }
  );
  return response.data;
}

export async function disable2FA(code: string): Promise<void> {
  await axios.post(
    `${API_URL}/security/2fa/disable`,
    { code },
    { headers: getAuthHeader() }
  );
}

export async function regenerateBackupCodes(code: string): Promise<{ backupCodes: string[] }> {
  const response = await axios.post(
    `${API_URL}/security/2fa/backup-codes`,
    { code },
    { headers: getAuthHeader() }
  );
  return response.data;
}

export async function removeTrustedDevice(deviceId: string): Promise<void> {
  await axios.delete(`${API_URL}/security/2fa/trusted-devices/${deviceId}`, {
    headers: getAuthHeader(),
  });
}

// ============================================
// Session Management API
// ============================================

export async function getSessions(): Promise<UserSession[]> {
  try {
    const response = await axios.get(`${API_URL}/security/sessions`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}

export async function revokeSession(sessionId: string): Promise<void> {
  await axios.post(
    `${API_URL}/security/sessions/${sessionId}/revoke`,
    {},
    { headers: getAuthHeader() }
  );
}

export async function revokeAllOtherSessions(): Promise<{ count: number }> {
  const response = await axios.post(
    `${API_URL}/security/sessions/revoke-all`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
}

export async function trustDevice(sessionId: string): Promise<void> {
  await axios.post(
    `${API_URL}/security/sessions/${sessionId}/trust`,
    {},
    { headers: getAuthHeader() }
  );
}

// ============================================
// Audit Logs API
// ============================================

export interface AuditLogFilters {
  category?: string;
  action_type?: string;
  user_id?: string;
  severity?: string;
  phi_only?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export async function getAuditLogs(filters: AuditLogFilters = {}): Promise<{
  logs: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
}> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(`${API_URL}/security/audit-logs?${params}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return { logs: [], total: 0, page: 1, pageSize: 50 };
  }
}

export async function exportAuditLogs(filters: AuditLogFilters = {}): Promise<Blob> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const response = await axios.get(`${API_URL}/security/audit-logs/export?${params}`, {
    headers: getAuthHeader(),
    responseType: 'blob',
  });
  return response.data;
}

// ============================================
// Role & Permissions API
// ============================================

export async function getRoles(): Promise<RolePermission[]> {
  try {
    const response = await axios.get(`${API_URL}/security/roles`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

export async function getRole(roleId: string): Promise<RolePermission | null> {
  try {
    const response = await axios.get(`${API_URL}/security/roles/${roleId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching role:', error);
    return null;
  }
}

export async function createCustomRole(data: Partial<RolePermission>): Promise<RolePermission> {
  const response = await axios.post(
    `${API_URL}/security/roles`,
    data,
    { headers: getAuthHeader() }
  );
  return response.data;
}

export async function updateRole(roleId: string, data: Partial<RolePermission>): Promise<RolePermission> {
  const response = await axios.put(
    `${API_URL}/security/roles/${roleId}`,
    data,
    { headers: getAuthHeader() }
  );
  return response.data;
}

export async function deleteRole(roleId: string): Promise<void> {
  await axios.delete(`${API_URL}/security/roles/${roleId}`, {
    headers: getAuthHeader(),
  });
}

// ============================================
// Security Settings API
// ============================================

export async function getSecuritySettings(): Promise<SecuritySettings | null> {
  try {
    const response = await axios.get(`${API_URL}/security/settings`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching security settings:', error);
    return null;
  }
}

export async function updateSecuritySettings(data: Partial<SecuritySettings>): Promise<SecuritySettings> {
  const response = await axios.put(
    `${API_URL}/security/settings`,
    data,
    { headers: getAuthHeader() }
  );
  return response.data;
}

// ============================================
// Login History API
// ============================================

export async function getLoginHistory(limit: number = 20): Promise<LoginHistoryEntry[]> {
  try {
    const response = await axios.get(`${API_URL}/security/login-history?limit=${limit}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching login history:', error);
    return [];
  }
}

// ============================================
// Encryption Status API
// ============================================

export async function getEncryptionStatus(): Promise<EncryptionStatus> {
  try {
    const response = await axios.get(`${API_URL}/security/encryption`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching encryption status:', error);
    // Return default status
    return {
      at_rest: {
        enabled: true,
        algorithm: 'AES-256-GCM',
        key_rotation_days: 90,
      },
      in_transit: {
        enabled: true,
        tls_version: 'TLS 1.3',
        cipher_suites: ['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256'],
      },
      phi_encryption: {
        enabled: true,
        fields_encrypted: ['ssn', 'date_of_birth', 'medical_record_number', 'diagnosis_codes'],
      },
    };
  }
}

// ============================================
// Helper Functions
// ============================================

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'red';
    case 'alert':
      return 'orange';
    case 'warning':
      return 'yellow';
    default:
      return 'gray';
  }
}

export function getActionCategoryIcon(category: string): string {
  switch (category) {
    case 'auth':
      return 'shield';
    case 'phi_access':
      return 'eye';
    case 'data_export':
      return 'download';
    case 'admin':
      return 'settings';
    case 'settings':
      return 'sliders';
    default:
      return 'activity';
  }
}

export const ACTION_CATEGORIES = [
  { id: 'auth', label: 'Authentication', color: 'blue' },
  { id: 'phi_access', label: 'PHI Access', color: 'purple' },
  { id: 'data_export', label: 'Data Export', color: 'orange' },
  { id: 'admin', label: 'Administration', color: 'indigo' },
  { id: 'settings', label: 'Settings', color: 'gray' },
  { id: 'api', label: 'API Activity', color: 'cyan' },
];

export const SEVERITY_LEVELS = [
  { id: 'info', label: 'Info', color: 'gray' },
  { id: 'warning', label: 'Warning', color: 'yellow' },
  { id: 'alert', label: 'Alert', color: 'orange' },
  { id: 'critical', label: 'Critical', color: 'red' },
];

export default {
  get2FASettings,
  setup2FA,
  verify2FA,
  disable2FA,
  regenerateBackupCodes,
  removeTrustedDevice,
  getSessions,
  revokeSession,
  revokeAllOtherSessions,
  trustDevice,
  getAuditLogs,
  exportAuditLogs,
  getRoles,
  getRole,
  createCustomRole,
  updateRole,
  deleteRole,
  getSecuritySettings,
  updateSecuritySettings,
  getLoginHistory,
  getEncryptionStatus,
  formatDate,
  formatRelativeTime,
  getSeverityColor,
  getActionCategoryIcon,
};

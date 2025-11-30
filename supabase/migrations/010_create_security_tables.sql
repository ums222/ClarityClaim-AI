-- ============================================
-- ClarityClaim AI - Security & Compliance Migration
-- HIPAA-compliant security features for healthcare
-- ============================================

-- ============================================
-- 1. Two-Factor Authentication Settings
-- ============================================

CREATE TABLE IF NOT EXISTS user_2fa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- TOTP Settings
  totp_enabled BOOLEAN DEFAULT FALSE,
  totp_secret TEXT, -- Encrypted TOTP secret
  totp_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Backup Codes (stored as encrypted JSON array)
  backup_codes TEXT, -- Encrypted backup codes
  backup_codes_generated_at TIMESTAMP WITH TIME ZONE,
  backup_codes_used INTEGER DEFAULT 0,
  
  -- SMS 2FA (optional)
  sms_enabled BOOLEAN DEFAULT FALSE,
  sms_phone_number VARCHAR(20),
  sms_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Recovery
  recovery_email VARCHAR(255),
  recovery_email_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Settings
  require_2fa_for_sensitive BOOLEAN DEFAULT TRUE, -- Require 2FA for PHI access
  trusted_devices JSONB DEFAULT '[]', -- List of trusted device fingerprints
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_2fa_user ON user_2fa(user_id);

-- ============================================
-- 2. User Sessions Table (for session management)
-- ============================================

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Session Info
  session_token VARCHAR(255) UNIQUE NOT NULL,
  refresh_token VARCHAR(255),
  
  -- Device Info
  device_name VARCHAR(255),
  device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  browser VARCHAR(100),
  os VARCHAR(100),
  ip_address INET,
  
  -- Location (for security alerts)
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  location_lat DECIMAL(10, 7),
  location_lng DECIMAL(10, 7),
  
  -- Security
  is_trusted BOOLEAN DEFAULT FALSE,
  is_current BOOLEAN DEFAULT FALSE,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Session Settings
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  idle_timeout_minutes INTEGER DEFAULT 30, -- HIPAA requires reasonable timeout
  absolute_timeout_hours INTEGER DEFAULT 12, -- Maximum session length
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'revoked', 'suspicious'
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_org ON user_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(user_id, status, expires_at);

-- ============================================
-- 3. Enhanced Audit Logs (HIPAA Compliance)
-- ============================================

-- Drop and recreate audit_logs with more fields if it exists
CREATE TABLE IF NOT EXISTS security_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Actor Info
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Session Info
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  
  -- Action Details
  action_type VARCHAR(100) NOT NULL, -- 'login', 'logout', 'view_phi', 'export_data', etc.
  action_category VARCHAR(50) NOT NULL, -- 'auth', 'phi_access', 'admin', 'data_export', 'settings'
  resource_type VARCHAR(100), -- 'claim', 'appeal', 'patient', 'user', 'organization'
  resource_id VARCHAR(255),
  resource_name VARCHAR(255),
  
  -- PHI Tracking (HIPAA specific)
  phi_accessed BOOLEAN DEFAULT FALSE,
  phi_fields_accessed TEXT[], -- List of PHI fields accessed
  phi_patient_ids TEXT[], -- Patient identifiers involved
  
  -- Change Details
  changes JSONB, -- Before/after values for modifications
  request_body JSONB, -- Sanitized request body
  response_status INTEGER,
  
  -- Context
  description TEXT,
  severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'alert', 'critical'
  is_suspicious BOOLEAN DEFAULT FALSE,
  
  -- Compliance
  hipaa_relevant BOOLEAN DEFAULT FALSE,
  retention_days INTEGER DEFAULT 2555, -- 7 years for HIPAA (default)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent modification
  CONSTRAINT no_update CHECK (TRUE)
);

CREATE INDEX IF NOT EXISTS idx_security_audit_user ON security_audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_org ON security_audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_action ON security_audit_logs(action_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_category ON security_audit_logs(action_category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_phi ON security_audit_logs(phi_accessed, created_at DESC) WHERE phi_accessed = TRUE;
CREATE INDEX IF NOT EXISTS idx_security_audit_date ON security_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_severity ON security_audit_logs(severity, created_at DESC) WHERE severity IN ('warning', 'alert', 'critical');

-- ============================================
-- 4. Role Permissions Table
-- ============================================

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Role Definition
  role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'manager', 'member', 'viewer', 'custom_*'
  role_name VARCHAR(100) NOT NULL,
  role_description TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  is_system BOOLEAN DEFAULT FALSE, -- System roles cannot be deleted
  
  -- Permissions (granular access control)
  permissions JSONB NOT NULL DEFAULT '{
    "claims": {"view": false, "create": false, "edit": false, "delete": false, "export": false},
    "appeals": {"view": false, "create": false, "edit": false, "delete": false, "submit": false},
    "patients": {"view": false, "create": false, "edit": false, "delete": false, "view_phi": false},
    "analytics": {"view": false, "export": false},
    "integrations": {"view": false, "manage": false},
    "team": {"view": false, "invite": false, "manage_roles": false, "remove": false},
    "billing": {"view": false, "manage": false},
    "settings": {"view": false, "manage": false},
    "security": {"view_logs": false, "manage_2fa": false, "manage_sessions": false},
    "api": {"view_keys": false, "create_keys": false, "revoke_keys": false}
  }',
  
  -- PHI Access Level
  phi_access_level VARCHAR(20) DEFAULT 'none', -- 'none', 'limited', 'full'
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique role per org
  UNIQUE(organization_id, role)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_org ON role_permissions(organization_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(organization_id, role);

-- Insert default system roles
INSERT INTO role_permissions (organization_id, role, role_name, role_description, is_system, phi_access_level, permissions)
SELECT 
  id as organization_id,
  'owner' as role,
  'Owner' as role_name,
  'Full access to all features and settings' as role_description,
  TRUE as is_system,
  'full' as phi_access_level,
  '{
    "claims": {"view": true, "create": true, "edit": true, "delete": true, "export": true},
    "appeals": {"view": true, "create": true, "edit": true, "delete": true, "submit": true},
    "patients": {"view": true, "create": true, "edit": true, "delete": true, "view_phi": true},
    "analytics": {"view": true, "export": true},
    "integrations": {"view": true, "manage": true},
    "team": {"view": true, "invite": true, "manage_roles": true, "remove": true},
    "billing": {"view": true, "manage": true},
    "settings": {"view": true, "manage": true},
    "security": {"view_logs": true, "manage_2fa": true, "manage_sessions": true},
    "api": {"view_keys": true, "create_keys": true, "revoke_keys": true}
  }'::jsonb as permissions
FROM organizations
ON CONFLICT (organization_id, role) DO NOTHING;

INSERT INTO role_permissions (organization_id, role, role_name, role_description, is_system, phi_access_level, permissions)
SELECT 
  id as organization_id,
  'admin' as role,
  'Administrator' as role_name,
  'Manage team and most settings, no billing access' as role_description,
  TRUE as is_system,
  'full' as phi_access_level,
  '{
    "claims": {"view": true, "create": true, "edit": true, "delete": true, "export": true},
    "appeals": {"view": true, "create": true, "edit": true, "delete": true, "submit": true},
    "patients": {"view": true, "create": true, "edit": true, "delete": true, "view_phi": true},
    "analytics": {"view": true, "export": true},
    "integrations": {"view": true, "manage": true},
    "team": {"view": true, "invite": true, "manage_roles": false, "remove": true},
    "billing": {"view": true, "manage": false},
    "settings": {"view": true, "manage": true},
    "security": {"view_logs": true, "manage_2fa": true, "manage_sessions": true},
    "api": {"view_keys": true, "create_keys": true, "revoke_keys": true}
  }'::jsonb as permissions
FROM organizations
ON CONFLICT (organization_id, role) DO NOTHING;

INSERT INTO role_permissions (organization_id, role, role_name, role_description, is_system, phi_access_level, permissions)
SELECT 
  id as organization_id,
  'manager' as role,
  'Manager' as role_name,
  'Manage claims and appeals, view team' as role_description,
  TRUE as is_system,
  'full' as phi_access_level,
  '{
    "claims": {"view": true, "create": true, "edit": true, "delete": false, "export": true},
    "appeals": {"view": true, "create": true, "edit": true, "delete": false, "submit": true},
    "patients": {"view": true, "create": true, "edit": true, "delete": false, "view_phi": true},
    "analytics": {"view": true, "export": false},
    "integrations": {"view": true, "manage": false},
    "team": {"view": true, "invite": false, "manage_roles": false, "remove": false},
    "billing": {"view": false, "manage": false},
    "settings": {"view": true, "manage": false},
    "security": {"view_logs": false, "manage_2fa": false, "manage_sessions": false},
    "api": {"view_keys": false, "create_keys": false, "revoke_keys": false}
  }'::jsonb as permissions
FROM organizations
ON CONFLICT (organization_id, role) DO NOTHING;

INSERT INTO role_permissions (organization_id, role, role_name, role_description, is_system, phi_access_level, permissions)
SELECT 
  id as organization_id,
  'member' as role,
  'Member' as role_name,
  'Standard access to claims and appeals' as role_description,
  TRUE as is_system,
  'limited' as phi_access_level,
  '{
    "claims": {"view": true, "create": true, "edit": true, "delete": false, "export": false},
    "appeals": {"view": true, "create": true, "edit": true, "delete": false, "submit": false},
    "patients": {"view": true, "create": false, "edit": false, "delete": false, "view_phi": false},
    "analytics": {"view": true, "export": false},
    "integrations": {"view": false, "manage": false},
    "team": {"view": true, "invite": false, "manage_roles": false, "remove": false},
    "billing": {"view": false, "manage": false},
    "settings": {"view": true, "manage": false},
    "security": {"view_logs": false, "manage_2fa": false, "manage_sessions": false},
    "api": {"view_keys": false, "create_keys": false, "revoke_keys": false}
  }'::jsonb as permissions
FROM organizations
ON CONFLICT (organization_id, role) DO NOTHING;

INSERT INTO role_permissions (organization_id, role, role_name, role_description, is_system, phi_access_level, permissions)
SELECT 
  id as organization_id,
  'viewer' as role,
  'Viewer' as role_name,
  'Read-only access to claims and appeals' as role_description,
  TRUE as is_system,
  'none' as phi_access_level,
  '{
    "claims": {"view": true, "create": false, "edit": false, "delete": false, "export": false},
    "appeals": {"view": true, "create": false, "edit": false, "delete": false, "submit": false},
    "patients": {"view": false, "create": false, "edit": false, "delete": false, "view_phi": false},
    "analytics": {"view": true, "export": false},
    "integrations": {"view": false, "manage": false},
    "team": {"view": false, "invite": false, "manage_roles": false, "remove": false},
    "billing": {"view": false, "manage": false},
    "settings": {"view": false, "manage": false},
    "security": {"view_logs": false, "manage_2fa": false, "manage_sessions": false},
    "api": {"view_keys": false, "create_keys": false, "revoke_keys": false}
  }'::jsonb as permissions
FROM organizations
ON CONFLICT (organization_id, role) DO NOTHING;

-- ============================================
-- 5. Security Settings per Organization
-- ============================================

CREATE TABLE IF NOT EXISTS security_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  
  -- 2FA Requirements
  require_2fa_all_users BOOLEAN DEFAULT FALSE,
  require_2fa_admins BOOLEAN DEFAULT TRUE,
  require_2fa_phi_access BOOLEAN DEFAULT TRUE,
  allowed_2fa_methods TEXT[] DEFAULT ARRAY['totp', 'backup_codes'],
  
  -- Session Settings
  session_timeout_minutes INTEGER DEFAULT 30, -- HIPAA recommends 15-30 minutes
  absolute_session_timeout_hours INTEGER DEFAULT 12,
  max_concurrent_sessions INTEGER DEFAULT 3,
  force_single_session BOOLEAN DEFAULT FALSE,
  notify_new_session BOOLEAN DEFAULT TRUE,
  
  -- Password Policy
  password_min_length INTEGER DEFAULT 12,
  password_require_uppercase BOOLEAN DEFAULT TRUE,
  password_require_lowercase BOOLEAN DEFAULT TRUE,
  password_require_numbers BOOLEAN DEFAULT TRUE,
  password_require_special BOOLEAN DEFAULT TRUE,
  password_expiry_days INTEGER DEFAULT 90, -- HIPAA recommends 60-90 days
  password_history_count INTEGER DEFAULT 12, -- Prevent reuse of last N passwords
  
  -- Login Security
  max_login_attempts INTEGER DEFAULT 5,
  lockout_duration_minutes INTEGER DEFAULT 30,
  notify_failed_logins BOOLEAN DEFAULT TRUE,
  notify_login_from_new_device BOOLEAN DEFAULT TRUE,
  notify_login_from_new_location BOOLEAN DEFAULT TRUE,
  
  -- IP Restrictions
  ip_whitelist_enabled BOOLEAN DEFAULT FALSE,
  ip_whitelist TEXT[], -- Array of allowed IP addresses/ranges
  ip_blacklist TEXT[], -- Array of blocked IP addresses/ranges
  
  -- Data Security
  encryption_at_rest BOOLEAN DEFAULT TRUE,
  encryption_in_transit BOOLEAN DEFAULT TRUE,
  phi_access_logging BOOLEAN DEFAULT TRUE,
  auto_logout_on_close BOOLEAN DEFAULT FALSE,
  mask_phi_in_logs BOOLEAN DEFAULT TRUE,
  
  -- Audit Settings
  audit_log_retention_days INTEGER DEFAULT 2555, -- 7 years for HIPAA
  detailed_audit_logging BOOLEAN DEFAULT TRUE,
  export_audit_logs_enabled BOOLEAN DEFAULT TRUE,
  
  -- Compliance
  hipaa_mode BOOLEAN DEFAULT TRUE,
  baa_signed BOOLEAN DEFAULT FALSE,
  baa_signed_date DATE,
  compliance_officer_email VARCHAR(255),
  last_security_review DATE,
  next_security_review DATE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_settings_org ON security_settings(organization_id);

-- ============================================
-- 6. Login History
-- ============================================

CREATE TABLE IF NOT EXISTS login_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Login Details
  login_type VARCHAR(20) DEFAULT 'password', -- 'password', '2fa', 'sso', 'magic_link'
  status VARCHAR(20) NOT NULL, -- 'success', 'failed', 'blocked', 'locked'
  failure_reason VARCHAR(100), -- 'invalid_password', 'invalid_2fa', 'account_locked', etc.
  
  -- Device Info
  ip_address INET,
  user_agent TEXT,
  device_fingerprint VARCHAR(255),
  
  -- Location
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  
  -- 2FA
  used_2fa BOOLEAN DEFAULT FALSE,
  twofa_method VARCHAR(20), -- 'totp', 'sms', 'backup_code'
  
  -- Risk Assessment
  risk_score INTEGER DEFAULT 0, -- 0-100, higher = more suspicious
  risk_factors TEXT[],
  is_suspicious BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_history_user ON login_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_status ON login_history(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_suspicious ON login_history(is_suspicious, created_at DESC) WHERE is_suspicious = TRUE;

-- ============================================
-- 7. Data Access Requests (for HIPAA compliance)
-- ============================================

CREATE TABLE IF NOT EXISTS data_access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Requester Info
  requester_name VARCHAR(255) NOT NULL,
  requester_email VARCHAR(255) NOT NULL,
  requester_type VARCHAR(50) NOT NULL, -- 'patient', 'legal', 'government', 'other'
  
  -- Request Details
  request_type VARCHAR(50) NOT NULL, -- 'access', 'amendment', 'restriction', 'accounting', 'deletion'
  request_reason TEXT,
  patient_identifier VARCHAR(255),
  date_range_start DATE,
  date_range_end DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'denied', 'completed'
  
  -- Processing
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  
  -- Compliance
  response_due_date DATE, -- HIPAA requires response within 30 days
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_data_access_requests_org ON data_access_requests(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_access_requests_status ON data_access_requests(status, created_at DESC);

-- ============================================
-- 8. Enable RLS
-- ============================================

ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_access_requests ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. RLS Policies
-- ============================================

-- user_2fa: Users can only see their own 2FA settings
DROP POLICY IF EXISTS "Users can view own 2fa" ON user_2fa;
CREATE POLICY "Users can view own 2fa"
  ON user_2fa FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own 2fa" ON user_2fa;
CREATE POLICY "Users can update own 2fa"
  ON user_2fa FOR UPDATE
  USING (user_id = auth.uid());

-- user_sessions: Users can see their own sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view org sessions" ON user_sessions;
CREATE POLICY "Admins can view org sessions"
  ON user_sessions FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- security_audit_logs: Admins can view org audit logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON security_audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON security_audit_logs FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- role_permissions: Users can view their org's roles
DROP POLICY IF EXISTS "Users can view org roles" ON role_permissions;
CREATE POLICY "Users can view org roles"
  ON role_permissions FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage roles" ON role_permissions;
CREATE POLICY "Admins can manage roles"
  ON role_permissions FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- security_settings: Users can view, admins can manage
DROP POLICY IF EXISTS "Users can view security settings" ON security_settings;
CREATE POLICY "Users can view security settings"
  ON security_settings FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage security settings" ON security_settings;
CREATE POLICY "Admins can manage security settings"
  ON security_settings FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- login_history: Users can see their own login history
DROP POLICY IF EXISTS "Users can view own login history" ON login_history;
CREATE POLICY "Users can view own login history"
  ON login_history FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view org login history" ON login_history;
CREATE POLICY "Admins can view org login history"
  ON login_history FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- data_access_requests: Admins can manage
DROP POLICY IF EXISTS "Admins can manage data requests" ON data_access_requests;
CREATE POLICY "Admins can manage data requests"
  ON data_access_requests FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- ============================================
-- 10. Update Triggers
-- ============================================

DROP TRIGGER IF EXISTS update_user_2fa_updated_at ON user_2fa;
CREATE TRIGGER update_user_2fa_updated_at
  BEFORE UPDATE ON user_2fa
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON role_permissions;
CREATE TRIGGER update_role_permissions_updated_at
  BEFORE UPDATE ON role_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_security_settings_updated_at ON security_settings;
CREATE TRIGGER update_security_settings_updated_at
  BEFORE UPDATE ON security_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_data_access_requests_updated_at ON data_access_requests;
CREATE TRIGGER update_data_access_requests_updated_at
  BEFORE UPDATE ON data_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. Helper Functions
-- ============================================

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_org_id UUID,
  p_action_type VARCHAR(100),
  p_action_category VARCHAR(50),
  p_resource_type VARCHAR(100) DEFAULT NULL,
  p_resource_id VARCHAR(255) DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_phi_accessed BOOLEAN DEFAULT FALSE,
  p_severity VARCHAR(20) DEFAULT 'info'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
  user_email VARCHAR(255);
  user_name VARCHAR(255);
BEGIN
  -- Get user info
  SELECT email INTO user_email FROM auth.users WHERE id = p_user_id;
  SELECT full_name INTO user_name FROM user_profiles WHERE id = p_user_id;
  
  INSERT INTO security_audit_logs (
    user_id, user_email, user_name, organization_id,
    action_type, action_category, resource_type, resource_id,
    description, phi_accessed, severity, hipaa_relevant
  ) VALUES (
    p_user_id, user_email, user_name, p_org_id,
    p_action_type, p_action_category, p_resource_type, p_resource_id,
    p_description, p_phi_accessed, p_severity, p_phi_accessed
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create default security settings for new organizations
CREATE OR REPLACE FUNCTION create_default_security_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO security_settings (organization_id)
  VALUES (NEW.id)
  ON CONFLICT (organization_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_security_settings_trigger ON organizations;
CREATE TRIGGER create_security_settings_trigger
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION create_default_security_settings();

-- ============================================
-- Done! Security tables are ready.
-- ============================================

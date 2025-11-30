-- ============================================
-- ClarityClaim AI - Settings & Configuration Migration
-- Run this script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Update User Profiles (add settings fields)
-- ============================================

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS job_title VARCHAR(100),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- ============================================
-- 2. Organization Settings Table
-- ============================================

CREATE TABLE IF NOT EXISTS organization_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  
  -- General Settings
  logo_url TEXT,
  primary_color VARCHAR(20) DEFAULT '#3B82F6',
  secondary_color VARCHAR(20) DEFAULT '#6366F1',
  
  -- Business Settings
  default_appeal_deadline_days INTEGER DEFAULT 60,
  auto_assign_appeals BOOLEAN DEFAULT FALSE,
  require_approval_for_submission BOOLEAN DEFAULT TRUE,
  
  -- Claim Settings
  default_claim_priority VARCHAR(20) DEFAULT 'normal',
  auto_run_denial_prediction BOOLEAN DEFAULT TRUE,
  risk_threshold_high INTEGER DEFAULT 60,
  risk_threshold_medium INTEGER DEFAULT 30,
  
  -- Financial Settings
  fiscal_year_start INTEGER DEFAULT 1, -- Month (1-12)
  currency VARCHAR(10) DEFAULT 'USD',
  
  -- Compliance Settings
  hipaa_audit_logging BOOLEAN DEFAULT TRUE,
  data_retention_days INTEGER DEFAULT 2555, -- ~7 years for healthcare
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Team Invitations Table
-- ============================================

CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'manager', 'member', 'viewer'
  
  token VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'revoked'
  
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES user_profiles(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_invitations_org ON team_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);

-- ============================================
-- 4. Integrations Table
-- ============================================

CREATE TABLE IF NOT EXISTS integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Integration Info
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'ehr', 'payer', 'clearinghouse', 'analytics', 'webhook'
  provider VARCHAR(100) NOT NULL, -- 'epic', 'cerner', 'athena', 'availity', 'change_healthcare', 'custom'
  
  -- Status
  status VARCHAR(20) DEFAULT 'inactive', -- 'active', 'inactive', 'error', 'pending'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Configuration (encrypted in production)
  config JSONB DEFAULT '{}', -- API keys, endpoints, etc.
  
  -- Sync Settings
  sync_enabled BOOLEAN DEFAULT TRUE,
  sync_frequency VARCHAR(20) DEFAULT 'daily', -- 'realtime', 'hourly', 'daily', 'weekly', 'manual'
  sync_direction VARCHAR(20) DEFAULT 'both', -- 'inbound', 'outbound', 'both'
  
  -- Metadata
  description TEXT,
  documentation_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_integrations_org ON integrations(organization_id);
CREATE INDEX IF NOT EXISTS idx_integrations_type ON integrations(type);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);

-- ============================================
-- 5. API Keys Table
-- ============================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Key Info (store hashed key, only show prefix)
  key_prefix VARCHAR(20) NOT NULL, -- First 8 chars of key for identification
  key_hash VARCHAR(255) NOT NULL, -- Hashed full key
  
  -- Permissions
  permissions JSONB DEFAULT '["read"]', -- ['read', 'write', 'delete', 'admin']
  allowed_endpoints TEXT[], -- Specific endpoints, null = all
  allowed_ips TEXT[], -- IP whitelist, null = all
  
  -- Rate Limiting
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'revoked'
  
  -- Usage Tracking
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  
  -- Expiration
  expires_at TIMESTAMP WITH TIME ZONE, -- null = never expires
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID REFERENCES user_profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);

-- ============================================
-- 6. Notification Preferences Table
-- ============================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Email Notifications
  email_enabled BOOLEAN DEFAULT TRUE,
  email_claim_status_change BOOLEAN DEFAULT TRUE,
  email_appeal_status_change BOOLEAN DEFAULT TRUE,
  email_appeal_deadline_reminder BOOLEAN DEFAULT TRUE,
  email_denial_prediction_alert BOOLEAN DEFAULT TRUE,
  email_team_activity BOOLEAN DEFAULT FALSE,
  email_weekly_digest BOOLEAN DEFAULT TRUE,
  email_monthly_report BOOLEAN DEFAULT TRUE,
  
  -- In-App Notifications
  inapp_enabled BOOLEAN DEFAULT TRUE,
  inapp_claim_status_change BOOLEAN DEFAULT TRUE,
  inapp_appeal_status_change BOOLEAN DEFAULT TRUE,
  inapp_appeal_deadline_reminder BOOLEAN DEFAULT TRUE,
  inapp_denial_prediction_alert BOOLEAN DEFAULT TRUE,
  inapp_team_activity BOOLEAN DEFAULT TRUE,
  
  -- Push Notifications (for mobile)
  push_enabled BOOLEAN DEFAULT FALSE,
  push_urgent_only BOOLEAN DEFAULT TRUE,
  
  -- Timing Preferences
  quiet_hours_enabled BOOLEAN DEFAULT FALSE,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  
  -- Digest Settings
  digest_frequency VARCHAR(20) DEFAULT 'daily', -- 'realtime', 'hourly', 'daily', 'weekly'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. Audit Log Table (for compliance)
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Action Details
  action VARCHAR(100) NOT NULL, -- 'user.login', 'claim.view', 'appeal.submit', 'settings.update', etc.
  resource_type VARCHAR(50), -- 'user', 'claim', 'appeal', 'organization', 'api_key', etc.
  resource_id UUID,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  request_id VARCHAR(100),
  
  -- Change Details
  old_values JSONB,
  new_values JSONB,
  
  -- Result
  status VARCHAR(20) DEFAULT 'success', -- 'success', 'failure', 'error'
  error_message TEXT,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- ============================================
-- 8. Enable RLS
-- ============================================

ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. RLS Policies
-- ============================================

-- Organization Settings
DROP POLICY IF EXISTS "Users can view their org settings" ON organization_settings;
CREATE POLICY "Users can view their org settings"
  ON organization_settings FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can update org settings" ON organization_settings;
CREATE POLICY "Admins can update org settings"
  ON organization_settings FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Team Invitations
DROP POLICY IF EXISTS "Users can view their org invitations" ON team_invitations;
CREATE POLICY "Users can view their org invitations"
  ON team_invitations FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
    OR email = (SELECT email FROM user_profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can create invitations" ON team_invitations;
CREATE POLICY "Admins can create invitations"
  ON team_invitations FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin', 'manager')
  ));

-- Integrations
DROP POLICY IF EXISTS "Users can view their org integrations" ON integrations;
CREATE POLICY "Users can view their org integrations"
  ON integrations FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage integrations" ON integrations;
CREATE POLICY "Admins can manage integrations"
  ON integrations FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- API Keys
DROP POLICY IF EXISTS "Users can view their org API keys" ON api_keys;
CREATE POLICY "Users can view their org API keys"
  ON api_keys FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage API keys" ON api_keys;
CREATE POLICY "Admins can manage API keys"
  ON api_keys FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Notification Preferences
DROP POLICY IF EXISTS "Users can view own notification prefs" ON notification_preferences;
CREATE POLICY "Users can view own notification prefs"
  ON notification_preferences FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notification prefs" ON notification_preferences;
CREATE POLICY "Users can update own notification prefs"
  ON notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- Audit Logs (read-only for users in org)
DROP POLICY IF EXISTS "Users can view their org audit logs" ON audit_logs;
CREATE POLICY "Users can view their org audit logs"
  ON audit_logs FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

-- ============================================
-- 10. Update Triggers
-- ============================================

DROP TRIGGER IF EXISTS update_organization_settings_updated_at ON organization_settings;
CREATE TRIGGER update_organization_settings_updated_at
  BEFORE UPDATE ON organization_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integrations_updated_at ON integrations;
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. Helper Functions
-- ============================================

-- Function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key_prefix()
RETURNS VARCHAR AS $$
BEGIN
  RETURN 'cc_' || substring(md5(random()::text) from 1 for 8);
END;
$$ LANGUAGE plpgsql;

-- Function to create default organization settings
CREATE OR REPLACE FUNCTION create_default_org_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO organization_settings (organization_id)
  VALUES (NEW.id)
  ON CONFLICT (organization_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create org settings when organization is created
DROP TRIGGER IF EXISTS create_org_settings_trigger ON organizations;
CREATE TRIGGER create_org_settings_trigger
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION create_default_org_settings();

-- Function to create default notification preferences
CREATE OR REPLACE FUNCTION create_default_notification_prefs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification prefs when user profile is created
DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON user_profiles;
CREATE TRIGGER create_notification_prefs_trigger
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_prefs();

-- ============================================
-- Done! Settings tables are ready.
-- ============================================

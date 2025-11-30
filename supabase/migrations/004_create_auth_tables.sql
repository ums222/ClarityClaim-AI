-- ============================================
-- ClarityClaim AI - Authentication Tables
-- Run this script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Organizations Table (must be created first)
-- ============================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100), -- 'Hospital', 'Health System', 'Clinic', 'FQHC', 'Other'
  size VARCHAR(50), -- 'Small', 'Medium', 'Large', 'Enterprise'
  subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'starter', 'professional', 'enterprise'
  subscription_status VARCHAR(50) DEFAULT 'active', -- 'active', 'past_due', 'canceled'
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription ON organizations(subscription_tier, subscription_status);

-- ============================================
-- 2. User Profiles Table (extends Supabase Auth)
-- ============================================
-- This table links to auth.users via the id field
-- Supabase Auth handles email/password, we store additional profile data

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user', -- 'owner', 'admin', 'manager', 'user'
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  job_title VARCHAR(255),
  phone VARCHAR(50),
  timezone VARCHAR(100) DEFAULT 'America/New_York',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true}',
  onboarding_completed BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- ============================================
-- 3. Organization Invites Table
-- ============================================

CREATE TABLE IF NOT EXISTS organization_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  invited_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organization_invites_email ON organization_invites(email);
CREATE INDEX IF NOT EXISTS idx_organization_invites_token ON organization_invites(token);
CREATE INDEX IF NOT EXISTS idx_organization_invites_org ON organization_invites(organization_id);

-- ============================================
-- 4. Audit Log Table (for security compliance)
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'password_change', 'profile_update', etc.
  resource_type VARCHAR(100), -- 'user', 'claim', 'appeal', etc.
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- 5. Apply Update Triggers
-- ============================================

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Enable Row Level Security
-- ============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. Row Level Security Policies
-- ============================================

-- Organizations: Users can only see their own organization
DROP POLICY IF EXISTS "Users can view their own organization" ON organizations;
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Organization owners can update their organization" ON organizations;
CREATE POLICY "Organization owners can update their organization"
  ON organizations FOR UPDATE
  USING (id IN (
    SELECT organization_id FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- User Profiles: Users can view profiles in their organization
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON user_profiles;
CREATE POLICY "Users can view profiles in their organization"
  ON user_profiles FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
    OR id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Organization Invites: Admins can manage invites
DROP POLICY IF EXISTS "Admins can view organization invites" ON organization_invites;
CREATE POLICY "Admins can view organization invites"
  ON organization_invites FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin', 'manager')
    )
    OR email = (SELECT email FROM user_profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can create organization invites" ON organization_invites;
CREATE POLICY "Admins can create organization invites"
  ON organization_invites FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Audit Logs: Users can only view their organization's logs
DROP POLICY IF EXISTS "Users can view their organization audit logs" ON audit_logs;
CREATE POLICY "Users can view their organization audit logs"
  ON audit_logs FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Service role bypass for all tables (for backend operations)
DROP POLICY IF EXISTS "Service role has full access to organizations" ON organizations;
CREATE POLICY "Service role has full access to organizations"
  ON organizations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to user_profiles" ON user_profiles;
CREATE POLICY "Service role has full access to user_profiles"
  ON user_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to organization_invites" ON organization_invites;
CREATE POLICY "Service role has full access to organization_invites"
  ON organization_invites FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to audit_logs" ON audit_logs;
CREATE POLICY "Service role has full access to audit_logs"
  ON audit_logs FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 8. Helper Function: Create profile on signup
-- ============================================
-- This function is triggered when a new user signs up via Supabase Auth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Done! Auth tables are ready.
-- ============================================

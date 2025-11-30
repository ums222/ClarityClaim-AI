-- ============================================
-- ClarityClaim AI - App Tables Migration
-- Run this in Supabase SQL Editor after enabling auth
-- ============================================

-- ============================================
-- 1. Organizations Table (Multi-tenant support)
-- ============================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100), -- hospital, health_system, clinic, fqhc, other
  npi VARCHAR(20),
  tax_id VARCHAR(20),
  address TEXT,
  phone VARCHAR(20),
  website VARCHAR(255),
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  subscription_plan VARCHAR(50) DEFAULT 'trial', -- trial, starter, professional, enterprise
  subscription_status VARCHAR(50) DEFAULT 'active',
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_organizations_npi ON organizations(npi);

-- ============================================
-- 2. Profiles Table (extends Supabase auth.users)
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  role VARCHAR(50) DEFAULT 'user', -- admin, manager, user, viewer
  job_title VARCHAR(100),
  department VARCHAR(100),
  preferences JSONB DEFAULT '{}',
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);

-- ============================================
-- 3. Patients Table
-- ============================================

CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  mrn VARCHAR(50) NOT NULL, -- Medical Record Number
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  ssn_last_four VARCHAR(4), -- Last 4 of SSN for verification
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  primary_insurance_id UUID,
  secondary_insurance_id UUID,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, deceased
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, mrn)
);

CREATE INDEX IF NOT EXISTS idx_patients_organization_id ON patients(organization_id);
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(last_name, first_name);

-- ============================================
-- 4. Insurance Payers Table
-- ============================================

CREATE TABLE IF NOT EXISTS payers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  payer_id VARCHAR(50), -- Standard payer ID
  type VARCHAR(50), -- commercial, medicare, medicaid, tricare, other
  phone VARCHAR(20),
  website VARCHAR(255),
  appeals_address TEXT,
  appeals_fax VARCHAR(20),
  appeals_email VARCHAR(255),
  timely_filing_days INTEGER DEFAULT 90,
  appeal_deadline_days INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payers_name ON payers(name);
CREATE INDEX IF NOT EXISTS idx_payers_payer_id ON payers(payer_id);

-- ============================================
-- 5. Claims Table
-- ============================================

CREATE TABLE IF NOT EXISTS claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  payer_id UUID REFERENCES payers(id) ON DELETE SET NULL,
  claim_number VARCHAR(100) NOT NULL,
  service_date DATE NOT NULL,
  filing_date DATE,
  billed_amount DECIMAL(12, 2) NOT NULL,
  allowed_amount DECIMAL(12, 2),
  paid_amount DECIMAL(12, 2),
  patient_responsibility DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'submitted', -- submitted, processing, paid, partial, denied, appealed
  denial_code VARCHAR(50),
  denial_reason TEXT,
  denial_date DATE,
  procedure_codes TEXT[], -- Array of CPT/HCPCS codes
  diagnosis_codes TEXT[], -- Array of ICD-10 codes
  provider_npi VARCHAR(20),
  rendering_provider VARCHAR(255),
  place_of_service VARCHAR(50),
  notes TEXT,
  ai_risk_score DECIMAL(5, 2), -- 0-100 denial risk score
  ai_risk_factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, claim_number)
);

CREATE INDEX IF NOT EXISTS idx_claims_organization_id ON claims(organization_id);
CREATE INDEX IF NOT EXISTS idx_claims_patient_id ON claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_claims_payer_id ON claims(payer_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_claim_number ON claims(claim_number);
CREATE INDEX IF NOT EXISTS idx_claims_service_date ON claims(service_date);

-- ============================================
-- 6. Appeals Table
-- ============================================

CREATE TABLE IF NOT EXISTS appeals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  appeal_number VARCHAR(100),
  appeal_level INTEGER DEFAULT 1, -- 1 = first level, 2 = second level, etc.
  status VARCHAR(50) DEFAULT 'draft', -- draft, pending_review, submitted, in_review, won, lost, withdrawn
  denial_reason VARCHAR(255),
  appeal_reason TEXT,
  letter_content TEXT, -- The generated appeal letter
  letter_template VARCHAR(100),
  supporting_documents JSONB, -- Array of document references
  submission_date DATE,
  deadline_date DATE,
  response_date DATE,
  outcome VARCHAR(50), -- approved, partially_approved, denied, pending
  outcome_amount DECIMAL(12, 2),
  outcome_notes TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ai_generated BOOLEAN DEFAULT false,
  ai_confidence_score DECIMAL(5, 2),
  ai_citations JSONB, -- Medical necessity citations used
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appeals_organization_id ON appeals(organization_id);
CREATE INDEX IF NOT EXISTS idx_appeals_claim_id ON appeals(claim_id);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON appeals(status);
CREATE INDEX IF NOT EXISTS idx_appeals_deadline_date ON appeals(deadline_date);
CREATE INDEX IF NOT EXISTS idx_appeals_assigned_to ON appeals(assigned_to);

-- ============================================
-- 7. Appeal Activity Log
-- ============================================

CREATE TABLE IF NOT EXISTS appeal_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appeal_id UUID NOT NULL REFERENCES appeals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  activity_type VARCHAR(50) NOT NULL, -- created, updated, submitted, status_changed, comment, document_added
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appeal_activities_appeal_id ON appeal_activities(appeal_id);
CREATE INDEX IF NOT EXISTS idx_appeal_activities_created_at ON appeal_activities(created_at);

-- ============================================
-- 8. API Keys Table (for external integrations)
-- ============================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL, -- Hashed API key
  key_prefix VARCHAR(20) NOT NULL, -- First 8 chars for identification
  scopes TEXT[] DEFAULT ARRAY['read'], -- read, write, admin
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);

-- ============================================
-- 9. Audit Logs
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- 10. Apply Triggers for updated_at
-- ============================================

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payers_updated_at ON payers;
CREATE TRIGGER update_payers_updated_at
  BEFORE UPDATE ON payers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_claims_updated_at ON claims;
CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appeals_updated_at ON appeals;
CREATE TRIGGER update_appeals_updated_at
  BEFORE UPDATE ON appeals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_api_keys_updated_at ON api_keys;
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. Enable Row Level Security
-- ============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE payers ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeal_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 12. RLS Policies - Users can only access their org's data
-- ============================================

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Organizations: Members can view their organization
CREATE POLICY "Members can view their organization"
  ON organizations FOR SELECT
  USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Patients: Org members can access their org's patients
CREATE POLICY "Org members can view patients"
  ON patients FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org members can insert patients"
  ON patients FOR INSERT
  WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org members can update patients"
  ON patients FOR UPDATE
  USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Claims: Org members can access their org's claims
CREATE POLICY "Org members can view claims"
  ON claims FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org members can insert claims"
  ON claims FOR INSERT
  WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org members can update claims"
  ON claims FOR UPDATE
  USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Appeals: Org members can access their org's appeals
CREATE POLICY "Org members can view appeals"
  ON appeals FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org members can insert appeals"
  ON appeals FOR INSERT
  WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org members can update appeals"
  ON appeals FOR UPDATE
  USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Payers: Everyone can read payers (shared data)
CREATE POLICY "Anyone can view payers"
  ON payers FOR SELECT
  USING (true);

-- ============================================
-- 13. Function: Create profile on user signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 14. Seed common payers
-- ============================================

INSERT INTO payers (name, payer_id, type, timely_filing_days, appeal_deadline_days) VALUES
  ('Medicare', 'CMS', 'medicare', 365, 120),
  ('Medicaid', 'MEDICAID', 'medicaid', 365, 90),
  ('Anthem Blue Cross', 'ANTHEM', 'commercial', 90, 60),
  ('United Healthcare', 'UHC', 'commercial', 90, 60),
  ('Aetna', 'AETNA', 'commercial', 90, 60),
  ('Cigna', 'CIGNA', 'commercial', 90, 60),
  ('Humana', 'HUMANA', 'commercial', 90, 60),
  ('Blue Shield', 'BCBS', 'commercial', 90, 60),
  ('Kaiser Permanente', 'KAISER', 'commercial', 90, 60),
  ('Tricare', 'TRICARE', 'tricare', 365, 90)
ON CONFLICT DO NOTHING;

-- ============================================
-- Done! App database tables are ready.
-- ============================================

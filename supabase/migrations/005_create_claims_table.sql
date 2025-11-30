-- ============================================
-- ClarityClaim AI - Claims Table Migration
-- Run this script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Claims Table
-- ============================================

CREATE TABLE IF NOT EXISTS claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Claim identifiers
  claim_number VARCHAR(100) NOT NULL,
  external_claim_id VARCHAR(100), -- ID from external system
  
  -- Patient information
  patient_name VARCHAR(255) NOT NULL,
  patient_id VARCHAR(100),
  patient_dob DATE,
  patient_member_id VARCHAR(100),
  
  -- Provider information
  provider_name VARCHAR(255),
  provider_npi VARCHAR(20),
  facility_name VARCHAR(255),
  
  -- Payer information
  payer_name VARCHAR(255) NOT NULL,
  payer_id VARCHAR(100),
  plan_name VARCHAR(255),
  plan_type VARCHAR(50), -- 'Commercial', 'Medicare', 'Medicaid', 'Other'
  
  -- Service information
  service_date DATE,
  service_date_end DATE,
  place_of_service VARCHAR(100),
  procedure_codes TEXT[], -- Array of CPT codes
  diagnosis_codes TEXT[], -- Array of ICD-10 codes
  modifiers TEXT[],
  
  -- Financial information
  billed_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  allowed_amount DECIMAL(12,2),
  paid_amount DECIMAL(12,2),
  patient_responsibility DECIMAL(12,2),
  adjustment_amount DECIMAL(12,2),
  
  -- Status and workflow
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_review', 'submitted', 'in_process', 'denied', 'partially_denied', 'paid', 'appealed', 'appeal_won', 'appeal_lost', 'closed'
  status_reason TEXT,
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- AI/Risk scoring
  denial_risk_score DECIMAL(5,2), -- 0-100
  denial_risk_level VARCHAR(20), -- 'low', 'medium', 'high'
  denial_risk_factors JSONB DEFAULT '[]', -- Array of risk factors
  ai_recommendations JSONB DEFAULT '[]', -- AI suggestions
  
  -- Denial information (if denied)
  denial_date DATE,
  denial_codes TEXT[],
  denial_reasons TEXT[],
  denial_category VARCHAR(100), -- 'Authorization', 'Medical Necessity', 'Coding', 'Timely Filing', etc.
  
  -- Timeline
  received_date DATE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  due_date DATE,
  follow_up_date DATE,
  
  -- Additional data
  notes TEXT,
  attachments JSONB DEFAULT '[]', -- Array of attachment references
  custom_fields JSONB DEFAULT '{}',
  source VARCHAR(50) DEFAULT 'manual', -- 'manual', 'import', 'ehr', 'api'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_claims_organization ON claims(organization_id);
CREATE INDEX IF NOT EXISTS idx_claims_claim_number ON claims(claim_number);
CREATE INDEX IF NOT EXISTS idx_claims_patient_name ON claims(patient_name);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_payer ON claims(payer_name);
CREATE INDEX IF NOT EXISTS idx_claims_denial_risk ON claims(denial_risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_claims_service_date ON claims(service_date DESC);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_claims_created_by ON claims(created_by);

-- ============================================
-- 2. Claim History/Activity Log
-- ============================================

CREATE TABLE IF NOT EXISTS claim_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  action VARCHAR(100) NOT NULL, -- 'created', 'updated', 'status_changed', 'note_added', 'attachment_added', 'submitted', 'appealed', etc.
  action_details JSONB DEFAULT '{}',
  previous_value TEXT,
  new_value TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_claim_activities_claim ON claim_activities(claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_activities_created ON claim_activities(created_at DESC);

-- ============================================
-- 3. Claim Attachments
-- ============================================

CREATE TABLE IF NOT EXISTS claim_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  file_url TEXT,
  storage_path TEXT,
  
  category VARCHAR(50), -- 'medical_record', 'authorization', 'eob', 'correspondence', 'other'
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_claim_attachments_claim ON claim_attachments(claim_id);

-- ============================================
-- 4. Enable RLS
-- ============================================

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_attachments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. RLS Policies
-- ============================================

-- Claims: Users can only see claims from their organization
DROP POLICY IF EXISTS "Users can view their organization claims" ON claims;
CREATE POLICY "Users can view their organization claims"
  ON claims FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert claims for their organization" ON claims;
CREATE POLICY "Users can insert claims for their organization"
  ON claims FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update their organization claims" ON claims;
CREATE POLICY "Users can update their organization claims"
  ON claims FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete their organization claims" ON claims;
CREATE POLICY "Users can delete their organization claims"
  ON claims FOR DELETE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ) AND (
    SELECT role FROM user_profiles WHERE id = auth.uid()
  ) IN ('owner', 'admin', 'manager'));

-- Claim activities: Follow claim access
DROP POLICY IF EXISTS "Users can view claim activities" ON claim_activities;
CREATE POLICY "Users can view claim activities"
  ON claim_activities FOR SELECT
  USING (claim_id IN (
    SELECT id FROM claims WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can insert claim activities" ON claim_activities;
CREATE POLICY "Users can insert claim activities"
  ON claim_activities FOR INSERT
  WITH CHECK (claim_id IN (
    SELECT id FROM claims WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  ));

-- Claim attachments: Follow claim access
DROP POLICY IF EXISTS "Users can view claim attachments" ON claim_attachments;
CREATE POLICY "Users can view claim attachments"
  ON claim_attachments FOR SELECT
  USING (claim_id IN (
    SELECT id FROM claims WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can insert claim attachments" ON claim_attachments;
CREATE POLICY "Users can insert claim attachments"
  ON claim_attachments FOR INSERT
  WITH CHECK (claim_id IN (
    SELECT id FROM claims WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  ));

-- ============================================
-- 6. Update Trigger
-- ============================================

DROP TRIGGER IF EXISTS update_claims_updated_at ON claims;
CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Function to calculate denial risk (placeholder for AI)
-- ============================================

CREATE OR REPLACE FUNCTION calculate_denial_risk(claim_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  risk_score DECIMAL(5,2) := 0;
  claim_record RECORD;
BEGIN
  SELECT * INTO claim_record FROM claims WHERE id = claim_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Simple heuristic-based scoring (placeholder for real AI)
  -- Missing authorization codes
  IF claim_record.procedure_codes IS NULL OR array_length(claim_record.procedure_codes, 1) IS NULL THEN
    risk_score := risk_score + 20;
  END IF;
  
  -- High billed amount
  IF claim_record.billed_amount > 10000 THEN
    risk_score := risk_score + 15;
  END IF;
  
  -- Medicare/Medicaid plans have stricter requirements
  IF claim_record.plan_type IN ('Medicare', 'Medicaid') THEN
    risk_score := risk_score + 10;
  END IF;
  
  -- Missing diagnosis codes
  IF claim_record.diagnosis_codes IS NULL OR array_length(claim_record.diagnosis_codes, 1) IS NULL THEN
    risk_score := risk_score + 25;
  END IF;
  
  -- Cap at 100
  IF risk_score > 100 THEN
    risk_score := 100;
  END IF;
  
  RETURN risk_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Done! Claims tables are ready.
-- ============================================

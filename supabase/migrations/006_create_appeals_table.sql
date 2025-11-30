-- ============================================
-- ClarityClaim AI - Appeals Management Migration
-- Run this script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Appeals Table
-- ============================================

CREATE TABLE IF NOT EXISTS appeals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Appeal identification
  appeal_number VARCHAR(100) NOT NULL,
  appeal_level INTEGER DEFAULT 1, -- 1 = First level, 2 = Second level, 3 = External review
  appeal_type VARCHAR(50) DEFAULT 'standard', -- 'standard', 'expedited', 'external', 'peer_to_peer'
  
  -- Appeal content
  appeal_letter TEXT,
  appeal_summary TEXT,
  appeal_grounds TEXT[], -- Array of grounds for appeal
  supporting_documents JSONB DEFAULT '[]',
  
  -- AI-related fields
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_model VARCHAR(100),
  ai_confidence DECIMAL(5,2),
  ai_suggestions JSONB DEFAULT '[]',
  
  -- Denial information (copied from claim for reference)
  original_denial_reason TEXT,
  original_denial_code VARCHAR(50),
  original_denial_date DATE,
  original_denial_amount DECIMAL(12,2),
  
  -- Status and workflow
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_review', 'ready_to_submit', 'submitted', 'under_review', 'approved', 'partially_approved', 'denied', 'withdrawn', 'escalated'
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Submission details
  submitted_at TIMESTAMP WITH TIME ZONE,
  submitted_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  submission_method VARCHAR(50), -- 'portal', 'fax', 'mail', 'phone', 'electronic'
  submission_reference VARCHAR(255), -- Payer's reference number
  
  -- Response and outcome
  payer_response_date DATE,
  payer_response TEXT,
  outcome VARCHAR(50), -- 'approved', 'partially_approved', 'denied', 'pending'
  outcome_date DATE,
  outcome_reason TEXT,
  
  -- Financial impact
  amount_appealed DECIMAL(12,2),
  amount_approved DECIMAL(12,2),
  amount_recovered DECIMAL(12,2),
  adjustment_codes TEXT[],
  
  -- Deadlines and timelines
  deadline DATE, -- Appeal filing deadline
  expected_response_date DATE,
  follow_up_date DATE,
  days_to_deadline INTEGER GENERATED ALWAYS AS (
    CASE WHEN deadline IS NOT NULL THEN deadline - CURRENT_DATE ELSE NULL END
  ) STORED,
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appeals_claim ON appeals(claim_id);
CREATE INDEX IF NOT EXISTS idx_appeals_organization ON appeals(organization_id);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON appeals(status);
CREATE INDEX IF NOT EXISTS idx_appeals_outcome ON appeals(outcome);
CREATE INDEX IF NOT EXISTS idx_appeals_deadline ON appeals(deadline);
CREATE INDEX IF NOT EXISTS idx_appeals_created_at ON appeals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appeals_assigned ON appeals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_appeals_appeal_number ON appeals(appeal_number);

-- ============================================
-- 2. Appeal Activities/Timeline
-- ============================================

CREATE TABLE IF NOT EXISTS appeal_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appeal_id UUID NOT NULL REFERENCES appeals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  action VARCHAR(100) NOT NULL, -- 'created', 'updated', 'submitted', 'status_changed', 'note_added', 'document_added', 'outcome_received', etc.
  action_details JSONB DEFAULT '{}',
  previous_value TEXT,
  new_value TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appeal_activities_appeal ON appeal_activities(appeal_id);
CREATE INDEX IF NOT EXISTS idx_appeal_activities_created ON appeal_activities(created_at DESC);

-- ============================================
-- 3. Appeal Templates
-- ============================================

CREATE TABLE IF NOT EXISTS appeal_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL for system templates
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'medical_necessity', 'authorization', 'coding', 'timely_filing', 'eligibility', 'custom'
  denial_codes TEXT[], -- Applicable denial codes
  
  -- Template content
  subject_line TEXT,
  letter_template TEXT NOT NULL,
  placeholders JSONB DEFAULT '[]', -- List of placeholders like {{patient_name}}, {{claim_number}}
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_system BOOLEAN DEFAULT FALSE, -- System-provided templates
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2), -- Historical success rate
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appeal_templates_organization ON appeal_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_appeal_templates_category ON appeal_templates(category);
CREATE INDEX IF NOT EXISTS idx_appeal_templates_active ON appeal_templates(is_active);

-- ============================================
-- 4. Appeal Documents/Attachments
-- ============================================

CREATE TABLE IF NOT EXISTS appeal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appeal_id UUID NOT NULL REFERENCES appeals(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  file_url TEXT,
  storage_path TEXT,
  
  document_type VARCHAR(50), -- 'appeal_letter', 'medical_record', 'authorization', 'clinical_notes', 'peer_review', 'other'
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appeal_documents_appeal ON appeal_documents(appeal_id);

-- ============================================
-- 5. Enable RLS
-- ============================================

ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeal_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeal_documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. RLS Policies
-- ============================================

-- Appeals: Organization-based access
DROP POLICY IF EXISTS "Users can view their organization appeals" ON appeals;
CREATE POLICY "Users can view their organization appeals"
  ON appeals FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert appeals for their organization" ON appeals;
CREATE POLICY "Users can insert appeals for their organization"
  ON appeals FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update their organization appeals" ON appeals;
CREATE POLICY "Users can update their organization appeals"
  ON appeals FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete their organization appeals" ON appeals;
CREATE POLICY "Users can delete their organization appeals"
  ON appeals FOR DELETE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ) AND (
    SELECT role FROM user_profiles WHERE id = auth.uid()
  ) IN ('owner', 'admin', 'manager'));

-- Appeal activities
DROP POLICY IF EXISTS "Users can view appeal activities" ON appeal_activities;
CREATE POLICY "Users can view appeal activities"
  ON appeal_activities FOR SELECT
  USING (appeal_id IN (
    SELECT id FROM appeals WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can insert appeal activities" ON appeal_activities;
CREATE POLICY "Users can insert appeal activities"
  ON appeal_activities FOR INSERT
  WITH CHECK (appeal_id IN (
    SELECT id FROM appeals WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  ));

-- Appeal templates: Organization + system templates
DROP POLICY IF EXISTS "Users can view appeal templates" ON appeal_templates;
CREATE POLICY "Users can view appeal templates"
  ON appeal_templates FOR SELECT
  USING (
    is_system = TRUE 
    OR organization_id IS NULL
    OR organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert appeal templates" ON appeal_templates;
CREATE POLICY "Users can insert appeal templates"
  ON appeal_templates FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update appeal templates" ON appeal_templates;
CREATE POLICY "Users can update appeal templates"
  ON appeal_templates FOR UPDATE
  USING (
    is_system = FALSE AND organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Appeal documents
DROP POLICY IF EXISTS "Users can view appeal documents" ON appeal_documents;
CREATE POLICY "Users can view appeal documents"
  ON appeal_documents FOR SELECT
  USING (appeal_id IN (
    SELECT id FROM appeals WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can insert appeal documents" ON appeal_documents;
CREATE POLICY "Users can insert appeal documents"
  ON appeal_documents FOR INSERT
  WITH CHECK (appeal_id IN (
    SELECT id FROM appeals WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  ));

-- ============================================
-- 7. Update Trigger
-- ============================================

DROP TRIGGER IF EXISTS update_appeals_updated_at ON appeals;
CREATE TRIGGER update_appeals_updated_at
  BEFORE UPDATE ON appeals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appeal_templates_updated_at ON appeal_templates;
CREATE TRIGGER update_appeal_templates_updated_at
  BEFORE UPDATE ON appeal_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. Insert System Templates
-- ============================================

INSERT INTO appeal_templates (id, name, description, category, denial_codes, subject_line, letter_template, placeholders, is_system, is_active)
VALUES 
(
  gen_random_uuid(),
  'Medical Necessity Appeal',
  'Standard template for appealing medical necessity denials',
  'medical_necessity',
  ARRAY['CO-50', 'PR-96', 'CO-11'],
  'Appeal for Medical Necessity - Claim {{claim_number}}',
  E'{{current_date}}\n\n{{payer_name}}\nAppeals Department\n{{payer_address}}\n\nRE: Appeal for Medical Necessity\nClaim Number: {{claim_number}}\nPatient Name: {{patient_name}}\nPatient ID: {{patient_id}}\nDate of Service: {{service_date}}\nDenial Date: {{denial_date}}\n\nDear Appeals Committee,\n\nI am writing to formally appeal the denial of the above-referenced claim, which was denied for lack of medical necessity. After careful review of the patient''s medical records and clinical circumstances, I respectfully disagree with this determination.\n\nCLINICAL BACKGROUND:\n{{clinical_background}}\n\nMEDICAL NECESSITY JUSTIFICATION:\nThe services provided were medically necessary based on the following:\n\n1. The patient''s diagnosis ({{diagnosis_codes}}) required immediate medical intervention\n2. The treatment plan was consistent with established clinical guidelines\n3. Less invasive alternatives had been exhausted or were not appropriate\n4. The services were provided at the appropriate level of care\n\nSUPPORTING DOCUMENTATION:\n- Complete medical records from date of service\n- Physician''s clinical notes and treatment rationale\n- Relevant diagnostic test results\n- Letter of medical necessity from treating physician\n\nBased on the above, I respectfully request that you overturn this denial and process this claim for payment.\n\nSincerely,\n\n{{provider_name}}\n{{provider_credentials}}\nNPI: {{provider_npi}}\n{{facility_name}}',
  '["current_date", "payer_name", "payer_address", "claim_number", "patient_name", "patient_id", "service_date", "denial_date", "clinical_background", "diagnosis_codes", "provider_name", "provider_credentials", "provider_npi", "facility_name"]'::JSONB,
  TRUE,
  TRUE
),
(
  gen_random_uuid(),
  'Prior Authorization Appeal',
  'Template for appealing authorization-related denials',
  'authorization',
  ARRAY['CO-4', 'PR-15', 'CO-15'],
  'Appeal for Prior Authorization Denial - Claim {{claim_number}}',
  E'{{current_date}}\n\n{{payer_name}}\nAppeals Department\n{{payer_address}}\n\nRE: Appeal for Prior Authorization Denial\nClaim Number: {{claim_number}}\nPatient Name: {{patient_name}}\nPatient ID: {{patient_id}}\nDate of Service: {{service_date}}\n\nDear Appeals Committee,\n\nI am writing to appeal the denial of the above-referenced claim due to lack of prior authorization.\n\nEXPLANATION:\n{{authorization_explanation}}\n\nThe services provided were emergent/urgent and required immediate attention, making it impractical to obtain prior authorization. Alternatively, we have documentation showing that authorization was obtained (Reference #: {{auth_reference}}).\n\nSUPPORTING DOCUMENTATION:\n- Emergency room records (if applicable)\n- Authorization request documentation\n- Clinical notes supporting urgency\n\nI respectfully request that you overturn this denial based on the circumstances outlined above.\n\nSincerely,\n\n{{provider_name}}\nNPI: {{provider_npi}}',
  '["current_date", "payer_name", "payer_address", "claim_number", "patient_name", "patient_id", "service_date", "authorization_explanation", "auth_reference", "provider_name", "provider_npi"]'::JSONB,
  TRUE,
  TRUE
),
(
  gen_random_uuid(),
  'Coding Error Appeal',
  'Template for appealing coding-related denials',
  'coding',
  ARRAY['CO-4', 'CO-16', 'CO-18', 'CO-97'],
  'Appeal for Coding-Related Denial - Claim {{claim_number}}',
  E'{{current_date}}\n\n{{payer_name}}\nAppeals Department\n{{payer_address}}\n\nRE: Appeal for Coding-Related Denial\nClaim Number: {{claim_number}}\nPatient Name: {{patient_name}}\nDate of Service: {{service_date}}\n\nDear Appeals Committee,\n\nI am writing to appeal the denial of the above-referenced claim. Upon review, we believe the coding was accurate and appropriate for the services rendered.\n\nORIGINAL CODES:\nProcedure Codes: {{procedure_codes}}\nDiagnosis Codes: {{diagnosis_codes}}\n\nJUSTIFICATION:\n{{coding_justification}}\n\nThe procedure and diagnosis codes accurately reflect the services provided and are supported by the medical documentation. The codes meet all payer requirements including:\n- Proper code sequencing\n- Appropriate modifier usage\n- Valid diagnosis-to-procedure linkage\n\nPlease find attached the supporting documentation including operative notes and clinical records.\n\nSincerely,\n\n{{provider_name}}\nNPI: {{provider_npi}}',
  '["current_date", "payer_name", "payer_address", "claim_number", "patient_name", "service_date", "procedure_codes", "diagnosis_codes", "coding_justification", "provider_name", "provider_npi"]'::JSONB,
  TRUE,
  TRUE
),
(
  gen_random_uuid(),
  'Timely Filing Appeal',
  'Template for appealing timely filing denials',
  'timely_filing',
  ARRAY['CO-29', 'PR-29'],
  'Appeal for Timely Filing Denial - Claim {{claim_number}}',
  E'{{current_date}}\n\n{{payer_name}}\nAppeals Department\n{{payer_address}}\n\nRE: Appeal for Timely Filing Denial\nClaim Number: {{claim_number}}\nPatient Name: {{patient_name}}\nDate of Service: {{service_date}}\n\nDear Appeals Committee,\n\nI am writing to appeal the denial of the above-referenced claim for untimely filing.\n\nTIMELINE:\n- Date of Service: {{service_date}}\n- Original Claim Submission: {{original_submission_date}}\n- Denial Received: {{denial_date}}\n\nEXPLANATION:\n{{timely_filing_explanation}}\n\nSUPPORTING EVIDENCE:\n- Proof of timely original submission\n- Electronic submission confirmation/receipt\n- Correspondence documentation\n\nThe claim was filed within the required timeframe as evidenced by the attached documentation. We respectfully request that you overturn this denial.\n\nSincerely,\n\n{{provider_name}}\nNPI: {{provider_npi}}',
  '["current_date", "payer_name", "payer_address", "claim_number", "patient_name", "service_date", "original_submission_date", "denial_date", "timely_filing_explanation", "provider_name", "provider_npi"]'::JSONB,
  TRUE,
  TRUE
),
(
  gen_random_uuid(),
  'Duplicate Claim Appeal',
  'Template for appealing duplicate claim denials',
  'duplicate',
  ARRAY['CO-18', 'CO-97'],
  'Appeal for Duplicate Claim Denial - Claim {{claim_number}}',
  E'{{current_date}}\n\n{{payer_name}}\nAppeals Department\n{{payer_address}}\n\nRE: Appeal for Duplicate Claim Denial\nClaim Number: {{claim_number}}\nPatient Name: {{patient_name}}\nDate of Service: {{service_date}}\n\nDear Appeals Committee,\n\nI am writing to appeal the denial of the above-referenced claim as a duplicate. This claim is not a duplicate for the following reasons:\n\nDISTINCT SERVICES:\n{{duplicate_explanation}}\n\nThe services billed represent:\n- Different dates of service\n- Different procedures/services\n- Different anatomical sites\n- Separate medically necessary encounters\n\nPlease review the attached documentation which clearly demonstrates these are separate, distinct services.\n\nSincerely,\n\n{{provider_name}}\nNPI: {{provider_npi}}',
  '["current_date", "payer_name", "payer_address", "claim_number", "patient_name", "service_date", "duplicate_explanation", "provider_name", "provider_npi"]'::JSONB,
  TRUE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- ============================================
-- Done! Appeals tables are ready.
-- ============================================

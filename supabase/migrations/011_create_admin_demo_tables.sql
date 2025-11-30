-- ============================================
-- ClarityClaim AI - Admin Demo System Tables
-- Comprehensive admin, facilities, payers, AI insights, 
-- equity analytics, and demo scenarios
-- ============================================

-- ============================================
-- 1. Update User Roles - Extend with ADMIN, EXECUTIVE, etc.
-- ============================================

-- Add a role enum column to user_profiles if not using enum
-- We'll use VARCHAR but document expected values:
-- 'super_admin' - System-wide admin (ClarityClaim staff)
-- 'admin' - Organization admin  
-- 'executive' - Executive-level access within org
-- 'manager' - Manager-level access
-- 'billing_specialist' - Billing/claims specialist
-- 'user' - Standard user
-- 'viewer' - Read-only access

COMMENT ON COLUMN user_profiles.role IS 
'User role: super_admin, admin, executive, manager, billing_specialist, user, viewer. 
super_admin has cross-tenant access for demo/support purposes.';

-- ============================================
-- 2. Facilities Table
-- ============================================

CREATE TABLE IF NOT EXISTS facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Facility Info
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50), -- Internal facility code
  type VARCHAR(100), -- 'hospital', 'clinic', 'surgery_center', 'lab', 'imaging', 'pharmacy', 'other'
  
  -- Location
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  
  -- Contact
  phone VARCHAR(50),
  fax VARCHAR(50),
  email VARCHAR(255),
  
  -- Identifiers
  npi VARCHAR(20), -- National Provider Identifier
  tax_id VARCHAR(20),
  medicare_provider_number VARCHAR(50),
  medicaid_provider_number VARCHAR(50),
  
  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  is_primary BOOLEAN DEFAULT FALSE, -- Primary facility for the org
  
  -- Stats (for demos)
  total_claims INTEGER DEFAULT 0,
  denied_claims INTEGER DEFAULT 0,
  appealed_claims INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_facilities_org ON facilities(organization_id);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(type);
CREATE INDEX IF NOT EXISTS idx_facilities_state ON facilities(state);
CREATE INDEX IF NOT EXISTS idx_facilities_active ON facilities(is_active) WHERE is_active = TRUE;

-- ============================================
-- 3. Payers Table
-- ============================================

CREATE TABLE IF NOT EXISTS payers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Payer Info
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(100),
  payer_id VARCHAR(50), -- EDI Payer ID
  
  -- Type
  type VARCHAR(50) NOT NULL, -- 'medicare', 'medicare_advantage', 'medicaid', 'commercial', 'exchange', 'workers_comp', 'auto', 'other'
  category VARCHAR(50), -- 'government', 'private', 'managed_care'
  
  -- Contact
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  phone VARCHAR(50),
  claims_phone VARCHAR(50),
  appeals_phone VARCHAR(50),
  website VARCHAR(255),
  claims_portal_url VARCHAR(255),
  
  -- Filing Info
  timely_filing_days INTEGER DEFAULT 365,
  appeal_filing_days INTEGER DEFAULT 180,
  
  -- Stats (for demos)
  avg_denial_rate DECIMAL(5,2),
  avg_days_to_pay INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payers_type ON payers(type);
CREATE INDEX IF NOT EXISTS idx_payers_name ON payers(name);
CREATE INDEX IF NOT EXISTS idx_payers_payer_id ON payers(payer_id);

-- ============================================
-- 4. Organization-Payer Junction Table
-- ============================================

CREATE TABLE IF NOT EXISTS organization_payers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES payers(id) ON DELETE CASCADE,
  
  -- Contract Info
  contract_id VARCHAR(100),
  contract_start_date DATE,
  contract_end_date DATE,
  
  -- Stats
  total_claims INTEGER DEFAULT 0,
  denied_claims INTEGER DEFAULT 0,
  paid_claims INTEGER DEFAULT 0,
  total_billed DECIMAL(14,2) DEFAULT 0,
  total_paid DECIMAL(14,2) DEFAULT 0,
  
  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  is_preferred BOOLEAN DEFAULT FALSE,
  
  -- Credentials (encrypted in production)
  portal_username VARCHAR(255),
  portal_password TEXT,
  api_key TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(organization_id, payer_id)
);

CREATE INDEX IF NOT EXISTS idx_org_payers_org ON organization_payers(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_payers_payer ON organization_payers(payer_id);

-- ============================================
-- 5. AI Insights Table
-- ============================================

CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Risk Assessment
  risk_score DECIMAL(5,4), -- 0.0000 to 1.0000 (probability of denial)
  risk_level VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
  confidence DECIMAL(5,4), -- Model confidence in prediction
  
  -- Factors Contributing to Risk
  top_factors JSONB DEFAULT '[]', -- [{label: string, weight: number, direction: 'increases'|'decreases'}]
  
  -- Explanation
  explanation TEXT, -- Human-readable explanation
  technical_explanation TEXT, -- More detailed technical explanation
  
  -- Recommendations
  suggested_actions JSONB DEFAULT '[]', -- [{action: string, priority: string, impact: string}]
  
  -- Model Info
  model_name VARCHAR(100) DEFAULT 'ccai-denial-risk-v1',
  model_version VARCHAR(50),
  inference_time_ms INTEGER,
  
  -- Appeal-specific (if applicable)
  appeal_success_probability DECIMAL(5,4),
  recommended_appeal_grounds TEXT[],
  
  -- Timestamps
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- When the insight should be refreshed
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_claim ON ai_insights(claim_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_org ON ai_insights(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_risk ON ai_insights(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_generated ON ai_insights(generated_at DESC);

-- ============================================
-- 6. Equity Signals Table
-- ============================================

CREATE TABLE IF NOT EXISTS equity_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Dimension
  dimension VARCHAR(50) NOT NULL, -- 'race', 'ethnicity', 'zip_code', 'income_bracket', 'age_group', 'gender', 'language', 'payer_type', 'facility'
  dimension_value VARCHAR(100) NOT NULL, -- e.g., 'African American', '90210', 'low_income'
  
  -- Signal Strength
  disparity_score DECIMAL(5,4), -- 0-1, higher = stronger disparity signal
  statistical_significance DECIMAL(5,4), -- p-value or similar
  sample_size INTEGER, -- Number of claims in analysis
  
  -- Comparison
  baseline_denial_rate DECIMAL(5,4),
  observed_denial_rate DECIMAL(5,4),
  rate_ratio DECIMAL(5,4), -- observed / baseline
  
  -- Context
  comparison_group VARCHAR(100), -- What this is compared against
  time_period_start DATE,
  time_period_end DATE,
  
  -- Flags
  is_flagged BOOLEAN DEFAULT FALSE, -- Manually flagged for review
  flag_reason TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Model Info
  analysis_type VARCHAR(50), -- 'individual', 'aggregate', 'trend'
  model_version VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equity_signals_claim ON equity_signals(claim_id);
CREATE INDEX IF NOT EXISTS idx_equity_signals_org ON equity_signals(organization_id);
CREATE INDEX IF NOT EXISTS idx_equity_signals_dimension ON equity_signals(dimension, dimension_value);
CREATE INDEX IF NOT EXISTS idx_equity_signals_disparity ON equity_signals(disparity_score DESC);
CREATE INDEX IF NOT EXISTS idx_equity_signals_flagged ON equity_signals(is_flagged) WHERE is_flagged = TRUE;

-- ============================================
-- 7. Demo Scenarios Table
-- ============================================

CREATE TABLE IF NOT EXISTS demo_scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Scenario Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'ai_appeal', 'equity', 'prevention', 'roi', 'workflow', 'integration'
  
  -- Linked Entities
  claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
  appeal_id UUID REFERENCES appeals(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  icon VARCHAR(50), -- Icon name from lucide-react
  color VARCHAR(50), -- Accent color
  
  -- Narrative
  narrative_intro TEXT, -- What to say at the start
  narrative_walkthrough TEXT, -- Step-by-step talking points
  narrative_conclusion TEXT, -- Key takeaways
  
  -- Metrics to Highlight
  key_metrics JSONB DEFAULT '[]', -- [{label: string, value: string, highlight: boolean}]
  
  -- Navigation
  target_url VARCHAR(255), -- Where to navigate for this demo
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demo_scenarios_category ON demo_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_demo_scenarios_order ON demo_scenarios(display_order);
CREATE INDEX IF NOT EXISTS idx_demo_scenarios_featured ON demo_scenarios(is_featured) WHERE is_featured = TRUE;

-- ============================================
-- 8. AI Model Registry Table
-- ============================================

CREATE TABLE IF NOT EXISTS ai_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Model Info
  name VARCHAR(100) NOT NULL,
  version VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'denial_risk', 'appeal_generation', 'coding_validation', 'equity_analysis'
  description TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'development', 'staging', 'active', 'deprecated', 'retired'
  is_default BOOLEAN DEFAULT FALSE, -- Default model for this type
  
  -- Performance Metrics
  accuracy DECIMAL(5,4),
  precision_score DECIMAL(5,4),
  recall DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  auc_roc DECIMAL(5,4),
  
  -- Usage Stats
  total_inferences INTEGER DEFAULT 0,
  avg_inference_time_ms INTEGER,
  
  -- Training Info
  training_data_start DATE,
  training_data_end DATE,
  training_samples INTEGER,
  
  -- Metadata
  hyperparameters JSONB DEFAULT '{}',
  feature_importance JSONB DEFAULT '[]',
  
  -- Timestamps
  deployed_at TIMESTAMP WITH TIME ZONE,
  retired_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(name, version)
);

CREATE INDEX IF NOT EXISTS idx_ai_models_type ON ai_models(type);
CREATE INDEX IF NOT EXISTS idx_ai_models_status ON ai_models(status);

-- ============================================
-- 9. AI Usage Metrics Table
-- ============================================

CREATE TABLE IF NOT EXISTS ai_usage_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  model_id UUID REFERENCES ai_models(id) ON DELETE SET NULL,
  
  -- Time Period
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  granularity VARCHAR(20) DEFAULT 'daily', -- 'hourly', 'daily', 'weekly', 'monthly'
  
  -- Usage Counts
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  
  -- Specific Actions
  denial_predictions INTEGER DEFAULT 0,
  appeal_generations INTEGER DEFAULT 0,
  equity_analyses INTEGER DEFAULT 0,
  
  -- Performance
  avg_latency_ms INTEGER,
  p95_latency_ms INTEGER,
  p99_latency_ms INTEGER,
  
  -- Costs (for billing tracking)
  estimated_cost DECIMAL(10,4),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_org ON ai_usage_metrics(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_period ON ai_usage_metrics(period_start, period_end);

-- ============================================
-- 10. Add facility_id and payer_id to claims
-- ============================================

-- Add columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'facility_id') THEN
    ALTER TABLE claims ADD COLUMN facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'payer_id_ref') THEN
    ALTER TABLE claims ADD COLUMN payer_id_ref UUID REFERENCES payers(id) ON DELETE SET NULL;
  END IF;
  
  -- Add synthetic demographic fields for equity analysis
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'patient_zip') THEN
    ALTER TABLE claims ADD COLUMN patient_zip VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'patient_age_group') THEN
    ALTER TABLE claims ADD COLUMN patient_age_group VARCHAR(20); -- 'pediatric', 'adult', 'senior'
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'patient_gender') THEN
    ALTER TABLE claims ADD COLUMN patient_gender VARCHAR(20);
  END IF;
  
  -- Additional claim type info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'claim_type') THEN
    ALTER TABLE claims ADD COLUMN claim_type VARCHAR(20) DEFAULT 'professional'; -- 'professional', 'institutional', 'pharmacy'
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'drg_code') THEN
    ALTER TABLE claims ADD COLUMN drg_code VARCHAR(20);
  END IF;
  
  -- Hero claim flag for demo
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'is_demo_hero') THEN
    ALTER TABLE claims ADD COLUMN is_demo_hero BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_claims_facility ON claims(facility_id);
CREATE INDEX IF NOT EXISTS idx_claims_payer_ref ON claims(payer_id_ref);
CREATE INDEX IF NOT EXISTS idx_claims_demo_hero ON claims(is_demo_hero) WHERE is_demo_hero = TRUE;

-- ============================================
-- 11. Add is_system_admin flag to user_profiles
-- ============================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'is_system_admin') THEN
    ALTER TABLE user_profiles ADD COLUMN is_system_admin BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'can_access_all_tenants') THEN
    ALTER TABLE user_profiles ADD COLUMN can_access_all_tenants BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_profiles_system_admin ON user_profiles(is_system_admin) WHERE is_system_admin = TRUE;

-- ============================================
-- 12. Enable RLS on new tables
-- ============================================

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE payers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_payers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE equity_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_metrics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 13. RLS Policies
-- ============================================

-- Facilities
DROP POLICY IF EXISTS "Users can view their org facilities" ON facilities;
CREATE POLICY "Users can view their org facilities"
  ON facilities FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_system_admin = TRUE)
  );

DROP POLICY IF EXISTS "Admins can manage facilities" ON facilities;
CREATE POLICY "Admins can manage facilities"
  ON facilities FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_system_admin = TRUE)
  );

-- Payers (viewable by all, managed by system admins)
DROP POLICY IF EXISTS "Anyone can view payers" ON payers;
CREATE POLICY "Anyone can view payers"
  ON payers FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "System admins can manage payers" ON payers;
CREATE POLICY "System admins can manage payers"
  ON payers FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_system_admin = TRUE));

-- Organization Payers
DROP POLICY IF EXISTS "Users can view their org payers" ON organization_payers;
CREATE POLICY "Users can view their org payers"
  ON organization_payers FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_system_admin = TRUE)
  );

-- AI Insights
DROP POLICY IF EXISTS "Users can view their org AI insights" ON ai_insights;
CREATE POLICY "Users can view their org AI insights"
  ON ai_insights FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_system_admin = TRUE)
  );

-- Equity Signals
DROP POLICY IF EXISTS "Users can view their org equity signals" ON equity_signals;
CREATE POLICY "Users can view their org equity signals"
  ON equity_signals FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_system_admin = TRUE)
  );

-- Demo Scenarios (viewable by all)
DROP POLICY IF EXISTS "Anyone can view demo scenarios" ON demo_scenarios;
CREATE POLICY "Anyone can view demo scenarios"
  ON demo_scenarios FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "System admins can manage demo scenarios" ON demo_scenarios;
CREATE POLICY "System admins can manage demo scenarios"
  ON demo_scenarios FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_system_admin = TRUE));

-- AI Models (viewable by all)
DROP POLICY IF EXISTS "Anyone can view AI models" ON ai_models;
CREATE POLICY "Anyone can view AI models"
  ON ai_models FOR SELECT
  USING (TRUE);

-- AI Usage Metrics
DROP POLICY IF EXISTS "Users can view their org AI usage" ON ai_usage_metrics;
CREATE POLICY "Users can view their org AI usage"
  ON ai_usage_metrics FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_system_admin = TRUE)
  );

-- ============================================
-- 14. Update Triggers
-- ============================================

DROP TRIGGER IF EXISTS update_facilities_updated_at ON facilities;
CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON facilities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payers_updated_at ON payers;
CREATE TRIGGER update_payers_updated_at
  BEFORE UPDATE ON payers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_organization_payers_updated_at ON organization_payers;
CREATE TRIGGER update_organization_payers_updated_at
  BEFORE UPDATE ON organization_payers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_equity_signals_updated_at ON equity_signals;
CREATE TRIGGER update_equity_signals_updated_at
  BEFORE UPDATE ON equity_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_demo_scenarios_updated_at ON demo_scenarios;
CREATE TRIGGER update_demo_scenarios_updated_at
  BEFORE UPDATE ON demo_scenarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_models_updated_at ON ai_models;
CREATE TRIGGER update_ai_models_updated_at
  BEFORE UPDATE ON ai_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 15. Service Role Policies (for seeding and backend)
-- ============================================

DROP POLICY IF EXISTS "Service role full access facilities" ON facilities;
CREATE POLICY "Service role full access facilities"
  ON facilities FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access organization_payers" ON organization_payers;
CREATE POLICY "Service role full access organization_payers"
  ON organization_payers FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access ai_insights" ON ai_insights;
CREATE POLICY "Service role full access ai_insights"
  ON ai_insights FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access equity_signals" ON equity_signals;
CREATE POLICY "Service role full access equity_signals"
  ON equity_signals FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access ai_models" ON ai_models;
CREATE POLICY "Service role full access ai_models"
  ON ai_models FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access ai_usage_metrics" ON ai_usage_metrics;
CREATE POLICY "Service role full access ai_usage_metrics"
  ON ai_usage_metrics FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

-- ============================================
-- Done! Admin demo tables are ready.
-- ============================================

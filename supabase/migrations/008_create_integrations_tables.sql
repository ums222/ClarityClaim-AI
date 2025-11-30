-- ============================================
-- ClarityClaim AI - Integrations Migration
-- Run this script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. EHR Connections Table (Enhanced from integrations)
-- ============================================

CREATE TABLE IF NOT EXISTS ehr_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Connection Info
  name VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'epic', 'cerner', 'athena', 'allscripts', 'meditech', 'custom'
  environment VARCHAR(20) DEFAULT 'sandbox', -- 'sandbox', 'production'
  
  -- OAuth/API Credentials (encrypted in production)
  client_id VARCHAR(255),
  client_secret TEXT,
  base_url TEXT,
  auth_url TEXT,
  token_url TEXT,
  scope TEXT,
  
  -- Token Storage
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- FHIR Settings
  fhir_version VARCHAR(10) DEFAULT 'R4', -- 'DSTU2', 'STU3', 'R4'
  supported_resources TEXT[], -- ['Patient', 'Claim', 'Coverage', 'ExplanationOfBenefit']
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'connected', 'error', 'expired', 'revoked'
  last_connected_at TIMESTAMP WITH TIME ZONE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Sync Settings
  auto_sync_enabled BOOLEAN DEFAULT TRUE,
  sync_frequency VARCHAR(20) DEFAULT 'daily', -- 'realtime', 'hourly', 'daily', 'weekly', 'manual'
  sync_claims BOOLEAN DEFAULT TRUE,
  sync_patients BOOLEAN DEFAULT TRUE,
  sync_coverage BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ehr_connections_org ON ehr_connections(organization_id);
CREATE INDEX IF NOT EXISTS idx_ehr_connections_provider ON ehr_connections(provider);
CREATE INDEX IF NOT EXISTS idx_ehr_connections_status ON ehr_connections(status);

-- ============================================
-- 2. Payer Connections Table
-- ============================================

CREATE TABLE IF NOT EXISTS payer_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Connection Info
  name VARCHAR(100) NOT NULL,
  payer_name VARCHAR(100) NOT NULL,
  payer_id VARCHAR(50), -- Payer ID for EDI
  trading_partner_id VARCHAR(50),
  
  -- Connection Type
  connection_type VARCHAR(50) NOT NULL, -- 'api', 'sftp', 'portal', 'clearinghouse'
  clearinghouse VARCHAR(50), -- 'availity', 'change_healthcare', 'trizetto', 'waystar', null
  
  -- API Credentials
  api_url TEXT,
  api_key TEXT,
  api_secret TEXT,
  username VARCHAR(255),
  password TEXT,
  
  -- SFTP Settings
  sftp_host VARCHAR(255),
  sftp_port INTEGER DEFAULT 22,
  sftp_username VARCHAR(255),
  sftp_password TEXT,
  sftp_private_key TEXT,
  sftp_inbound_path VARCHAR(255),
  sftp_outbound_path VARCHAR(255),
  
  -- Submission Settings
  submission_format VARCHAR(20) DEFAULT 'X12_837P', -- 'X12_837P', 'X12_837I', 'API_JSON', 'FHIR'
  supports_real_time BOOLEAN DEFAULT FALSE,
  supports_batch BOOLEAN DEFAULT TRUE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'error', 'suspended'
  last_submission_at TIMESTAMP WITH TIME ZONE,
  last_response_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Stats
  claims_submitted INTEGER DEFAULT 0,
  claims_accepted INTEGER DEFAULT 0,
  claims_rejected INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payer_connections_org ON payer_connections(organization_id);
CREATE INDEX IF NOT EXISTS idx_payer_connections_payer ON payer_connections(payer_name);
CREATE INDEX IF NOT EXISTS idx_payer_connections_status ON payer_connections(status);

-- ============================================
-- 3. Webhooks Table
-- ============================================

CREATE TABLE IF NOT EXISTS webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Webhook Info
  name VARCHAR(100) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  
  -- Authentication
  auth_type VARCHAR(20) DEFAULT 'none', -- 'none', 'bearer', 'basic', 'api_key', 'hmac'
  auth_token TEXT,
  auth_username VARCHAR(255),
  auth_password TEXT,
  auth_header_name VARCHAR(100) DEFAULT 'Authorization',
  hmac_secret TEXT,
  hmac_algorithm VARCHAR(20) DEFAULT 'sha256', -- 'sha256', 'sha512'
  
  -- Events
  events TEXT[] NOT NULL, -- ['claim.created', 'claim.updated', 'claim.denied', 'appeal.created', 'appeal.submitted', 'appeal.won', 'appeal.lost']
  
  -- Settings
  active BOOLEAN DEFAULT TRUE,
  retry_enabled BOOLEAN DEFAULT TRUE,
  max_retries INTEGER DEFAULT 3,
  retry_delay_seconds INTEGER DEFAULT 60,
  timeout_seconds INTEGER DEFAULT 30,
  
  -- Headers
  custom_headers JSONB DEFAULT '{}',
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'failed'
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  last_success_at TIMESTAMP WITH TIME ZONE,
  last_failure_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  
  -- Stats
  total_deliveries INTEGER DEFAULT 0,
  successful_deliveries INTEGER DEFAULT 0,
  failed_deliveries INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_org ON webhooks(organization_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_status ON webhooks(status);
CREATE INDEX IF NOT EXISTS idx_webhooks_events ON webhooks USING GIN(events);

-- ============================================
-- 4. Webhook Deliveries Table (Logs)
-- ============================================

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Event Info
  event_type VARCHAR(50) NOT NULL,
  event_id UUID,
  
  -- Request
  request_url TEXT NOT NULL,
  request_headers JSONB,
  request_body JSONB,
  
  -- Response
  response_status INTEGER,
  response_headers JSONB,
  response_body TEXT,
  response_time_ms INTEGER,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed', 'retrying'
  attempt_number INTEGER DEFAULT 1,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_org ON webhook_deliveries(organization_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_created ON webhook_deliveries(created_at DESC);

-- ============================================
-- 5. Batch Imports Table
-- ============================================

CREATE TABLE IF NOT EXISTS batch_imports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Import Info
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- File Info
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(20) NOT NULL, -- 'csv', 'edi_837p', 'edi_837i', 'json', 'xlsx'
  file_size INTEGER, -- bytes
  file_url TEXT, -- Storage URL
  
  -- Processing
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'validating', 'processing', 'completed', 'failed', 'cancelled'
  progress INTEGER DEFAULT 0, -- 0-100
  
  -- Counts
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  successful_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  skipped_records INTEGER DEFAULT 0,
  
  -- Results
  import_type VARCHAR(20) NOT NULL, -- 'claims', 'appeals', 'patients', 'payers'
  imported_ids UUID[], -- IDs of successfully imported records
  
  -- Errors
  errors JSONB DEFAULT '[]', -- Array of {row, field, error}
  validation_errors JSONB DEFAULT '[]',
  
  -- Mapping (for CSV)
  column_mapping JSONB DEFAULT '{}', -- {file_column: db_column}
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batch_imports_org ON batch_imports(organization_id);
CREATE INDEX IF NOT EXISTS idx_batch_imports_status ON batch_imports(status);
CREATE INDEX IF NOT EXISTS idx_batch_imports_type ON batch_imports(import_type);
CREATE INDEX IF NOT EXISTS idx_batch_imports_created ON batch_imports(created_at DESC);

-- ============================================
-- 6. Batch Import Records Table (Individual rows)
-- ============================================

CREATE TABLE IF NOT EXISTS batch_import_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  import_id UUID NOT NULL REFERENCES batch_imports(id) ON DELETE CASCADE,
  
  -- Record Info
  row_number INTEGER NOT NULL,
  raw_data JSONB NOT NULL, -- Original data from file
  
  -- Processing
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed', 'skipped'
  created_record_id UUID, -- ID of created claim/appeal/etc
  
  -- Errors
  error_message TEXT,
  validation_errors JSONB DEFAULT '[]',
  
  -- Timestamps
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batch_import_records_import ON batch_import_records(import_id);
CREATE INDEX IF NOT EXISTS idx_batch_import_records_status ON batch_import_records(status);

-- ============================================
-- 7. EHR Sync Logs Table
-- ============================================

CREATE TABLE IF NOT EXISTS ehr_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES ehr_connections(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Sync Info
  sync_type VARCHAR(20) NOT NULL, -- 'full', 'incremental', 'manual'
  direction VARCHAR(20) NOT NULL, -- 'inbound', 'outbound', 'bidirectional'
  resource_type VARCHAR(50), -- 'Patient', 'Claim', 'Coverage', etc.
  
  -- Status
  status VARCHAR(20) DEFAULT 'running', -- 'running', 'completed', 'failed', 'cancelled'
  
  -- Counts
  total_records INTEGER DEFAULT 0,
  created_records INTEGER DEFAULT 0,
  updated_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  
  -- Errors
  errors JSONB DEFAULT '[]',
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ehr_sync_logs_connection ON ehr_sync_logs(connection_id);
CREATE INDEX IF NOT EXISTS idx_ehr_sync_logs_org ON ehr_sync_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_ehr_sync_logs_status ON ehr_sync_logs(status);

-- ============================================
-- 8. Enable RLS
-- ============================================

ALTER TABLE ehr_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE payer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_import_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ehr_sync_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. RLS Policies
-- ============================================

-- EHR Connections
DROP POLICY IF EXISTS "Users can view their org EHR connections" ON ehr_connections;
CREATE POLICY "Users can view their org EHR connections"
  ON ehr_connections FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage EHR connections" ON ehr_connections;
CREATE POLICY "Admins can manage EHR connections"
  ON ehr_connections FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Payer Connections
DROP POLICY IF EXISTS "Users can view their org payer connections" ON payer_connections;
CREATE POLICY "Users can view their org payer connections"
  ON payer_connections FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage payer connections" ON payer_connections;
CREATE POLICY "Admins can manage payer connections"
  ON payer_connections FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Webhooks
DROP POLICY IF EXISTS "Users can view their org webhooks" ON webhooks;
CREATE POLICY "Users can view their org webhooks"
  ON webhooks FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage webhooks" ON webhooks;
CREATE POLICY "Admins can manage webhooks"
  ON webhooks FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Webhook Deliveries
DROP POLICY IF EXISTS "Users can view their org webhook deliveries" ON webhook_deliveries;
CREATE POLICY "Users can view their org webhook deliveries"
  ON webhook_deliveries FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

-- Batch Imports
DROP POLICY IF EXISTS "Users can view their org imports" ON batch_imports;
CREATE POLICY "Users can view their org imports"
  ON batch_imports FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create imports" ON batch_imports;
CREATE POLICY "Users can create imports"
  ON batch_imports FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin', 'manager', 'member')
  ));

-- Batch Import Records
DROP POLICY IF EXISTS "Users can view import records" ON batch_import_records;
CREATE POLICY "Users can view import records"
  ON batch_import_records FOR SELECT
  USING (import_id IN (
    SELECT id FROM batch_imports WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  ));

-- EHR Sync Logs
DROP POLICY IF EXISTS "Users can view sync logs" ON ehr_sync_logs;
CREATE POLICY "Users can view sync logs"
  ON ehr_sync_logs FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

-- ============================================
-- 10. Update Triggers
-- ============================================

DROP TRIGGER IF EXISTS update_ehr_connections_updated_at ON ehr_connections;
CREATE TRIGGER update_ehr_connections_updated_at
  BEFORE UPDATE ON ehr_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payer_connections_updated_at ON payer_connections;
CREATE TRIGGER update_payer_connections_updated_at
  BEFORE UPDATE ON payer_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_webhooks_updated_at ON webhooks;
CREATE TRIGGER update_webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_batch_imports_updated_at ON batch_imports;
CREATE TRIGGER update_batch_imports_updated_at
  BEFORE UPDATE ON batch_imports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Done! Integration tables are ready.
-- ============================================

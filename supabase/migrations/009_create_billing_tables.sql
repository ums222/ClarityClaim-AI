-- ============================================
-- ClarityClaim AI - Billing & Subscriptions Migration
-- Run this script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Subscription Plans Table (static reference)
-- ============================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(50) PRIMARY KEY, -- 'starter', 'professional', 'enterprise'
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Pricing
  price_monthly INTEGER NOT NULL DEFAULT 0, -- in cents
  price_yearly INTEGER NOT NULL DEFAULT 0, -- in cents (with discount)
  
  -- Stripe Product/Price IDs
  stripe_product_id VARCHAR(100),
  stripe_price_monthly_id VARCHAR(100),
  stripe_price_yearly_id VARCHAR(100),
  
  -- Limits
  claims_per_month INTEGER DEFAULT -1, -- -1 = unlimited
  appeals_per_month INTEGER DEFAULT -1,
  users_limit INTEGER DEFAULT 1,
  integrations_limit INTEGER DEFAULT 0,
  api_requests_per_day INTEGER DEFAULT 0,
  
  -- Features (JSON array of feature strings)
  features JSONB DEFAULT '[]',
  
  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (id, name, description, price_monthly, price_yearly, claims_per_month, appeals_per_month, users_limit, integrations_limit, api_requests_per_day, features, is_popular, sort_order)
VALUES 
  ('free', 'Free', 'Get started with basic features', 0, 0, 50, 10, 1, 0, 100, 
   '["50 claims per month", "10 appeals per month", "Basic AI analysis", "Email support", "7-day data retention"]', 
   false, 0),
  ('starter', 'Starter', 'Perfect for small practices', 9900, 95000, 500, 100, 3, 1, 1000, 
   '["500 claims per month", "100 appeals per month", "AI denial prediction", "1 EHR integration", "Priority email support", "30-day data retention", "Basic analytics"]', 
   false, 1),
  ('professional', 'Professional', 'Best for growing organizations', 29900, 287000, 2500, 500, 10, 5, 10000, 
   '["2,500 claims per month", "500 appeals per month", "Advanced AI features", "5 integrations", "Phone & email support", "1-year data retention", "Advanced analytics", "Custom appeal templates", "API access"]', 
   true, 2),
  ('enterprise', 'Enterprise', 'For large healthcare systems', 0, 0, -1, -1, -1, -1, -1, 
   '["Unlimited claims", "Unlimited appeals", "Dedicated AI models", "Unlimited integrations", "24/7 dedicated support", "7-year data retention", "Custom analytics", "HIPAA BAA", "SLA guarantee", "Custom development"]', 
   false, 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. Organization Subscriptions Table
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  
  -- Plan Info
  plan_id VARCHAR(50) NOT NULL REFERENCES subscription_plans(id) DEFAULT 'free',
  billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
  
  -- Stripe Info
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  stripe_payment_method_id VARCHAR(100),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'past_due', 'canceled', 'trialing', 'paused'
  
  -- Billing Period
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  
  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- 3. Payment Methods Table
-- ============================================

CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Stripe Info
  stripe_payment_method_id VARCHAR(100) NOT NULL UNIQUE,
  
  -- Card Details (from Stripe, for display)
  type VARCHAR(20) DEFAULT 'card', -- 'card', 'us_bank_account', etc.
  card_brand VARCHAR(20), -- 'visa', 'mastercard', 'amex', etc.
  card_last4 VARCHAR(4),
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  
  -- Bank Account Details (if applicable)
  bank_name VARCHAR(100),
  bank_last4 VARCHAR(4),
  
  -- Status
  is_default BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'failed'
  
  -- Metadata
  billing_name VARCHAR(255),
  billing_email VARCHAR(255),
  billing_address JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_org ON payment_methods(organization_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe ON payment_methods(stripe_payment_method_id);

-- ============================================
-- 4. Invoices Table
-- ============================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Stripe Info
  stripe_invoice_id VARCHAR(100) UNIQUE,
  stripe_payment_intent_id VARCHAR(100),
  
  -- Invoice Details
  invoice_number VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'open', 'paid', 'void', 'uncollectible'
  
  -- Amounts (in cents)
  subtotal INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  amount_due INTEGER DEFAULT 0,
  amount_paid INTEGER DEFAULT 0,
  
  -- Currency
  currency VARCHAR(3) DEFAULT 'usd',
  
  -- Dates
  invoice_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Period
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  
  -- Line Items (JSON array)
  line_items JSONB DEFAULT '[]',
  
  -- URLs
  hosted_invoice_url TEXT,
  invoice_pdf_url TEXT,
  
  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_org ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe ON invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date DESC);

-- ============================================
-- 5. Usage Records Table
-- ============================================

CREATE TABLE IF NOT EXISTS usage_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Usage Counts
  claims_processed INTEGER DEFAULT 0,
  claims_submitted INTEGER DEFAULT 0,
  appeals_created INTEGER DEFAULT 0,
  appeals_submitted INTEGER DEFAULT 0,
  ai_predictions INTEGER DEFAULT 0,
  ai_letters_generated INTEGER DEFAULT 0,
  api_requests INTEGER DEFAULT 0,
  storage_bytes BIGINT DEFAULT 0,
  
  -- Limits (snapshot from plan at time of recording)
  claims_limit INTEGER,
  appeals_limit INTEGER,
  api_limit INTEGER,
  
  -- Status
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per org per period
  UNIQUE(organization_id, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS idx_usage_records_org ON usage_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_period ON usage_records(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_usage_records_current ON usage_records(organization_id, is_current) WHERE is_current = TRUE;

-- ============================================
-- 6. Billing Events Log Table (for auditing)
-- ============================================

CREATE TABLE IF NOT EXISTS billing_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Event Info
  event_type VARCHAR(100) NOT NULL, -- 'subscription.created', 'invoice.paid', 'payment.failed', etc.
  stripe_event_id VARCHAR(100),
  
  -- Related Objects
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  
  -- Event Data
  data JSONB DEFAULT '{}',
  
  -- Processing
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_events_org ON billing_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_type ON billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_billing_events_stripe ON billing_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_created ON billing_events(created_at DESC);

-- ============================================
-- 7. Enable RLS
-- ============================================

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. RLS Policies
-- ============================================

-- Subscription Plans (public read)
DROP POLICY IF EXISTS "Anyone can view plans" ON subscription_plans;
CREATE POLICY "Anyone can view plans"
  ON subscription_plans FOR SELECT
  USING (is_active = TRUE);

-- Subscriptions
DROP POLICY IF EXISTS "Users can view their org subscription" ON subscriptions;
CREATE POLICY "Users can view their org subscription"
  ON subscriptions FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can update subscription" ON subscriptions;
CREATE POLICY "Admins can update subscription"
  ON subscriptions FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Payment Methods
DROP POLICY IF EXISTS "Users can view their org payment methods" ON payment_methods;
CREATE POLICY "Users can view their org payment methods"
  ON payment_methods FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage payment methods" ON payment_methods;
CREATE POLICY "Admins can manage payment methods"
  ON payment_methods FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Invoices
DROP POLICY IF EXISTS "Users can view their org invoices" ON invoices;
CREATE POLICY "Users can view their org invoices"
  ON invoices FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

-- Usage Records
DROP POLICY IF EXISTS "Users can view their org usage" ON usage_records;
CREATE POLICY "Users can view their org usage"
  ON usage_records FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

-- Billing Events
DROP POLICY IF EXISTS "Admins can view billing events" ON billing_events;
CREATE POLICY "Admins can view billing events"
  ON billing_events FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- ============================================
-- 9. Update Triggers
-- ============================================

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usage_records_updated_at ON usage_records;
CREATE TRIGGER update_usage_records_updated_at
  BEFORE UPDATE ON usage_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. Functions for Usage Tracking
-- ============================================

-- Function to get or create current usage record
CREATE OR REPLACE FUNCTION get_current_usage_record(org_id UUID)
RETURNS UUID AS $$
DECLARE
  record_id UUID;
  period_s DATE;
  period_e DATE;
BEGIN
  -- Calculate current billing period (monthly, starting on subscription date or 1st of month)
  period_s := DATE_TRUNC('month', NOW())::DATE;
  period_e := (DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- Try to get existing record
  SELECT id INTO record_id
  FROM usage_records
  WHERE organization_id = org_id
    AND period_start = period_s
    AND period_end = period_e;
  
  -- If not exists, create it
  IF record_id IS NULL THEN
    -- Reset is_current for old records
    UPDATE usage_records
    SET is_current = FALSE
    WHERE organization_id = org_id AND is_current = TRUE;
    
    -- Create new record
    INSERT INTO usage_records (organization_id, period_start, period_end, is_current)
    VALUES (org_id, period_s, period_e, TRUE)
    RETURNING id INTO record_id;
  END IF;
  
  RETURN record_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment usage counter
CREATE OR REPLACE FUNCTION increment_usage(org_id UUID, counter_name TEXT, increment_by INTEGER DEFAULT 1)
RETURNS VOID AS $$
DECLARE
  record_id UUID;
BEGIN
  record_id := get_current_usage_record(org_id);
  
  EXECUTE format('UPDATE usage_records SET %I = %I + $1, updated_at = NOW() WHERE id = $2', 
                 counter_name, counter_name)
  USING increment_by, record_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create subscription when organization is created
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (organization_id, plan_id, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (organization_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_subscription_trigger ON organizations;
CREATE TRIGGER create_subscription_trigger
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

-- ============================================
-- Done! Billing tables are ready.
-- ============================================

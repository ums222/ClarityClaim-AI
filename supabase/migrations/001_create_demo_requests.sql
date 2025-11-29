-- ============================================
-- ClarityClaim AI - Demo Requests Table
-- Migration: 001_create_demo_requests
-- ============================================

-- Create demo_requests table
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  organization_name VARCHAR(255) NOT NULL,
  organization_type VARCHAR(100),
  monthly_claim_volume VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests(created_at DESC);

-- Add comment to table
COMMENT ON TABLE demo_requests IS 'Stores demo request submissions from the landing page';

-- Column comments
COMMENT ON COLUMN demo_requests.id IS 'Unique identifier for the demo request';
COMMENT ON COLUMN demo_requests.full_name IS 'Full name of the person requesting the demo';
COMMENT ON COLUMN demo_requests.email IS 'Work email address of the requester';
COMMENT ON COLUMN demo_requests.organization_name IS 'Name of the healthcare organization';
COMMENT ON COLUMN demo_requests.organization_type IS 'Type of organization (Hospital, Health System, Clinic, FQHC, Other)';
COMMENT ON COLUMN demo_requests.monthly_claim_volume IS 'Estimated monthly claim volume (<1K, 1K-10K, 10K-50K, 50K+)';
COMMENT ON COLUMN demo_requests.status IS 'Status of the demo request (pending, contacted, scheduled, completed, cancelled)';
COMMENT ON COLUMN demo_requests.notes IS 'Internal notes about the demo request';
COMMENT ON COLUMN demo_requests.created_at IS 'Timestamp when the request was submitted';
COMMENT ON COLUMN demo_requests.updated_at IS 'Timestamp when the request was last updated';

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_demo_requests_updated_at ON demo_requests;
CREATE TRIGGER update_demo_requests_updated_at
  BEFORE UPDATE ON demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (full access)
-- Note: Service role key bypasses RLS, but we define policies for future use
CREATE POLICY "Service role has full access to demo_requests"
  ON demo_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

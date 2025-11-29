-- ============================================
-- ClarityClaim AI - Contact Submissions Table
-- Migration: 002_create_contact_submissions
-- ============================================

-- Create contact_submissions table for general inquiries
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  source VARCHAR(100) DEFAULT 'website',
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Add comments
COMMENT ON TABLE contact_submissions IS 'Stores general contact form submissions';
COMMENT ON COLUMN contact_submissions.source IS 'Source of the submission (website, email, etc.)';
COMMENT ON COLUMN contact_submissions.status IS 'Status of the submission (unread, read, responded, archived)';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role has full access to contact_submissions"
  ON contact_submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- ClarityClaim AI - Newsletter Subscribers Table
-- Migration: 003_create_newsletter_subscribers
-- ============================================

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  subscribed BOOLEAN DEFAULT true,
  source VARCHAR(100) DEFAULT 'website',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed ON newsletter_subscribers(subscribed);

-- Add comments
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscription information';
COMMENT ON COLUMN newsletter_subscribers.subscribed IS 'Whether the user is currently subscribed';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Where the subscription originated from';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role has full access to newsletter_subscribers"
  ON newsletter_subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

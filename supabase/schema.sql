-- ==============================================================================
-- ClarityClaim AI - Database Schema
-- ==============================================================================
-- Run this in your Supabase SQL Editor to set up all required tables
-- https://app.supabase.com/project/_/sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- DEMO REQUESTS TABLE
-- ==============================================================================
-- Stores all demo/sales inquiry requests from the website

CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Contact Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  monthly_claim_volume TEXT NOT NULL,
  message TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
  notes TEXT,
  
  -- Metadata
  source TEXT DEFAULT 'website',
  ip_address TEXT,
  user_agent TEXT
);

-- Create index for faster queries
CREATE INDEX idx_demo_requests_status ON demo_requests(status);
CREATE INDEX idx_demo_requests_email ON demo_requests(email);
CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at DESC);

-- ==============================================================================
-- CONTACT SUBMISSIONS TABLE
-- ==============================================================================
-- Stores contact form submissions

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Contact Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  monthly_claim_volume TEXT NOT NULL,
  message TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  
  -- Metadata
  source TEXT DEFAULT 'contact-page',
  ip_address TEXT,
  user_agent TEXT
);

-- Create indexes
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- ==============================================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ==============================================================================
-- Stores newsletter email subscriptions

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Subscriber Information
  email TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  
  -- Tracking
  source TEXT, -- Where they subscribed from (e.g., 'resources-page', 'footer', 'landing')
  unsubscribed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- ==============================================================================
-- USER PROFILES TABLE
-- ==============================================================================
-- Extended profile information for authenticated users
-- Links to Supabase Auth users

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Basic Information
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Organization Information
  organization_name TEXT,
  organization_type TEXT,
  
  -- Role & Permissions
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- Create indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- IMPORTANT: Enable RLS on all tables for security

-- Enable RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Demo Requests: Anyone can insert, only authenticated admins can read/update
CREATE POLICY "Anyone can submit demo requests" ON demo_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view demo requests" ON demo_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update demo requests" ON demo_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Contact Submissions: Same as demo requests
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions" ON contact_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update contact submissions" ON contact_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Newsletter: Anyone can subscribe, only admins can view
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own subscription" ON newsletter_subscribers
  FOR UPDATE USING (email = current_setting('request.jwt.claims')::json->>'email');

CREATE POLICY "Admins can view newsletter subscribers" ON newsletter_subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- User Profiles: Users can read/update their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "New users can create their profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ==============================================================================
-- FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ==============================================================================
-- Uncomment the following to insert test data

-- INSERT INTO newsletter_subscribers (email, source) VALUES
--   ('test1@example.com', 'website'),
--   ('test2@example.com', 'resources-page');

-- ==============================================================================
-- GRANTS
-- ==============================================================================
-- Grant necessary permissions for the anon and authenticated roles

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ==============================================================================
-- NOTES
-- ==============================================================================
--
-- 1. After running this schema, configure your Supabase project:
--    - Go to Authentication > Providers and enable Email
--    - Optionally enable Google OAuth
--    - Configure email templates for confirmation, password reset, etc.
--
-- 2. For production:
--    - Review and tighten RLS policies as needed
--    - Set up email notifications via Edge Functions
--    - Configure rate limiting in Supabase
--
-- 3. To create an admin user:
--    UPDATE user_profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
--

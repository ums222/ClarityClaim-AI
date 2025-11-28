# ClarityClaim AI - Backend Setup Guide

This guide walks you through setting up the Supabase backend for the ClarityClaim AI website.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" and fill in:
   - **Project Name**: `clarityclaim-ai`
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the closest to your users
3. Wait for the project to be created (usually 2-3 minutes)

### 2. Get Your API Keys

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon/public key** (safe to expose in browser)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL to create all tables and policies

### 5. Configure Authentication

#### Email Authentication (Default)

1. Go to **Authentication > Providers**
2. Email should be enabled by default
3. Configure email templates under **Authentication > Email Templates**

#### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google OAuth 2.0 API
4. Create OAuth credentials:
   - Application type: Web application
   - Authorized redirect URI: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
5. In Supabase, go to **Authentication > Providers > Google**
6. Enable and paste your Client ID and Secret

## 📋 What's Included

### Database Tables

| Table | Description |
|-------|-------------|
| `demo_requests` | Stores demo/sales inquiries from the website |
| `contact_submissions` | Stores contact form submissions |
| `newsletter_subscribers` | Stores newsletter email subscriptions |
| `user_profiles` | Extended profile info for authenticated users |

### API Features

| Feature | File | Description |
|---------|------|-------------|
| Demo Request | `src/lib/api.ts` | `submitDemoRequest()` - Submit demo inquiries |
| Contact Form | `src/lib/api.ts` | `submitContactForm()` - Submit contact messages |
| Newsletter | `src/lib/api.ts` | `subscribeToNewsletter()` - Newsletter signup |
| User Profile | `src/lib/api.ts` | `getUserProfile()`, `updateUserProfile()` |

### Authentication

| Feature | File | Description |
|---------|------|-------------|
| Sign Up | `src/hooks/useAuth.tsx` | Email/password and Google OAuth |
| Sign In | `src/hooks/useAuth.tsx` | Email/password and Google OAuth |
| Password Reset | `src/hooks/useAuth.tsx` | Email-based recovery |
| Protected Routes | `src/pages/DashboardPage.tsx` | Auth-guarded dashboard |

### Pages

| Route | File | Description |
|-------|------|-------------|
| `/login` | `LoginPage.tsx` | User login |
| `/signup` | `SignUpPage.tsx` | User registration |
| `/forgot-password` | `ForgotPasswordPage.tsx` | Password recovery |
| `/reset-password` | `ResetPasswordPage.tsx` | Set new password |
| `/dashboard` | `DashboardPage.tsx` | Protected user dashboard |

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS enabled with these policies:

- **Demo/Contact Forms**: Anyone can submit, only admins can view
- **Newsletter**: Anyone can subscribe, users can update own subscription
- **User Profiles**: Users can only access their own profile

### Making Yourself an Admin

After creating your account, run this SQL in the Supabase SQL Editor:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## 📧 Email Notifications (Optional)

### Set Up Resend

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain
3. Get your API key

### Deploy the Edge Function

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Set secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=your-resend-api-key
   supabase secrets set NOTIFICATION_EMAIL=team@yourdomain.com
   ```

4. Deploy:
   ```bash
   supabase functions deploy send-notification
   ```

## 🚀 Deployment (Vercel)

### Option 1: Vercel Dashboard

1. Import your GitHub repository in Vercel
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy

### Option 2: Vercel CLI

```bash
vercel --prod
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

## 🧪 Testing Locally

The backend is designed to work even without Supabase configured:

- All forms will "simulate" successful submissions in console
- Auth functions will log actions without errors
- You can develop UI without setting up Supabase

Once you add the environment variables, everything will connect to your real backend.

## 📊 Viewing Submissions

### In Supabase Dashboard

1. Go to **Table Editor**
2. Click on `demo_requests`, `contact_submissions`, or `newsletter_subscribers`
3. View, filter, and export data

### Building an Admin Panel

For a custom admin panel:

1. Create an admin account and set `role = 'admin'`
2. Build admin pages that query:
   ```typescript
   const { data } = await supabase
     .from('demo_requests')
     .select('*')
     .order('created_at', { ascending: false });
   ```

The RLS policies will automatically allow admins to view all records.

## 🔧 Troubleshooting

### "Supabase credentials not found"
- Ensure `.env` file exists with correct variable names
- Restart your dev server after adding env vars

### Forms not submitting
- Check browser console for errors
- Verify RLS policies allow anonymous inserts

### Auth not working
- Enable the Email provider in Supabase dashboard
- Check email templates are configured

### "Permission denied" errors
- Review RLS policies in `supabase/schema.sql`
- Ensure your user has the correct role

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)

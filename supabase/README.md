# Supabase Database Setup

This document explains how to set up the Supabase database for ClarityClaim AI.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project

## Quick Setup

### 1. Get Your API Keys

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Service Role Key** (under "Project API keys" → `service_role` secret)

> ⚠️ **Important**: The service role key bypasses Row Level Security. Never expose it in client-side code. Only use it in server-side environments.

### 2. Configure Environment Variables

**For local development** (`server/.env`):
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**For Vercel deployment** (Vercel Dashboard → Settings → Environment Variables):
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Database Migrations

You have two options to set up the database schema:

#### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:
   - `supabase/migrations/001_create_demo_requests.sql`
   - `supabase/migrations/002_create_contact_submissions.sql`
   - `supabase/migrations/003_create_newsletter_subscribers.sql`

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Push migrations
supabase db push
```

## Database Schema

### Tables

#### `demo_requests`
Stores demo request submissions from the landing page.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `full_name` | VARCHAR(255) | Requester's full name |
| `email` | VARCHAR(255) | Work email |
| `organization_name` | VARCHAR(255) | Organization name |
| `organization_type` | VARCHAR(100) | Type (Hospital, Clinic, etc.) |
| `monthly_claim_volume` | VARCHAR(50) | Claim volume range |
| `status` | VARCHAR(50) | Status (pending, contacted, etc.) |
| `notes` | TEXT | Internal notes |
| `created_at` | TIMESTAMPTZ | Submission time |
| `updated_at` | TIMESTAMPTZ | Last update time |

#### `contact_submissions`
Stores general contact form submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(255) | Contact name |
| `email` | VARCHAR(255) | Email address |
| `subject` | VARCHAR(255) | Message subject |
| `message` | TEXT | Message content |
| `source` | VARCHAR(100) | Source (website, etc.) |
| `status` | VARCHAR(50) | Status (unread, read, etc.) |
| `created_at` | TIMESTAMPTZ | Submission time |
| `updated_at` | TIMESTAMPTZ | Last update time |

#### `newsletter_subscribers`
Stores newsletter subscriptions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | VARCHAR(255) | Email address (unique) |
| `name` | VARCHAR(255) | Subscriber name |
| `subscribed` | BOOLEAN | Subscription status |
| `source` | VARCHAR(100) | Signup source |
| `subscribed_at` | TIMESTAMPTZ | Subscription time |
| `unsubscribed_at` | TIMESTAMPTZ | Unsubscription time |
| `created_at` | TIMESTAMPTZ | Record creation time |
| `updated_at` | TIMESTAMPTZ | Last update time |

## Security

### Row Level Security (RLS)

All tables have RLS enabled. The service role key bypasses RLS, which is appropriate for server-side operations.

If you need client-side access in the future, you'll need to:
1. Create appropriate RLS policies
2. Use the `anon` key instead of `service_role`

### Best Practices

1. **Never expose the service role key** in client-side code
2. **Rotate keys** periodically via Supabase dashboard
3. **Monitor usage** in the Supabase dashboard
4. **Back up data** regularly using Supabase's backup features

## API Endpoints

Once configured, the following endpoints interact with the database:

| Endpoint | Method | Table |
|----------|--------|-------|
| `/api/demo-request` | POST | `demo_requests` |
| `/api/contact` | POST | `contact_submissions` |
| `/api/newsletter/subscribe` | POST | `newsletter_subscribers` |
| `/api/newsletter/unsubscribe` | POST | `newsletter_subscribers` |
| `/api/health` | GET | Shows DB status |

## Troubleshooting

### "Database not configured"

Check that:
1. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
2. The values are correct (no extra spaces or quotes)
3. The server was restarted after adding env vars

### "Table does not exist"

Run the migration scripts in the Supabase SQL Editor.

### Connection errors

1. Check your Supabase project is active
2. Verify the project URL is correct
3. Ensure the service role key hasn't been rotated

## Local Development Without Supabase

The application is designed to work without Supabase configured:
- Form submissions will be logged to the console
- A mock ID will be returned
- No data will be persisted

This allows local development and testing without a database connection.

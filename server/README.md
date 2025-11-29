# ClarityClaim AI Backend Server

Express.js backend server for the ClarityClaim AI landing website with Supabase database integration.

## Features

- RESTful API endpoints
- **Supabase database integration** for data persistence
- CORS configuration for frontend integration
- Request validation
- Error handling middleware
- Health check endpoint with database status
- Graceful fallback when database is not configured

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status, timestamp, and database connection status.

### Demo Request
```
POST /api/demo-request
```
Submit a demo request form. Saves to `demo_requests` table.

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@hospital.org",
  "organizationName": "Regional Medical Center",
  "organizationType": "Hospital",
  "monthlyClaimVolume": "10K–50K"
}
```

### Contact Form
```
POST /api/contact
```
Submit a contact message. Saves to `contact_submissions` table.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@hospital.org",
  "subject": "Partnership Inquiry",
  "message": "I would like to discuss..."
}
```

### Newsletter Subscribe
```
POST /api/newsletter/subscribe
```
Subscribe to newsletter. Saves to `newsletter_subscribers` table.

**Request Body:**
```json
{
  "email": "jane.doe@hospital.org",
  "name": "Jane Doe"
}
```

### Newsletter Unsubscribe
```
POST /api/newsletter/unsubscribe
```
Unsubscribe from newsletter.

**Request Body:**
```json
{
  "email": "jane.doe@hospital.org"
}
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp server/.env.example server/.env
```

3. Configure environment variables in `server/.env`:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase (required for database)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Set up the database (see `/supabase/README.md`)

5. Start the server:
```bash
# Development mode
npm run dev:server

# Or run both frontend and backend together
npm run dev:all
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Environment (development/production) |
| `FRONTEND_URL` | No | Frontend URL for CORS |
| `SUPABASE_URL` | Yes* | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes* | Supabase service role key |

*Required for database functionality. Server works without these but won't persist data.

## Database

See `/supabase/README.md` for complete database setup instructions.

### Tables
- `demo_requests` - Demo request submissions
- `contact_submissions` - Contact form messages
- `newsletter_subscribers` - Newsletter subscriptions

## Development

The server uses ES modules (`type: "module"` in package.json) and runs on Node.js.

### Without Database
The server works without Supabase configured - it will log submissions but not persist them. This is useful for local development and testing.

### Production Deployment
Consider:
- Using a process manager (PM2)
- Setting up reverse proxy (Nginx)
- Implementing proper logging
- Adding monitoring and alerting
- Setting up CI/CD pipeline
- Rate limiting for API endpoints

# Vercel Deployment Guide

This project is configured to deploy on Vercel with serverless functions for the backend API and Supabase for database storage.

## Project Structure

- **Frontend**: Vite + React app (builds to `dist/`)
- **Backend API**: Serverless functions in `/api` directory
  - `/api/health.js` - Health check endpoint
  - `/api/demo-request.js` - Demo request submission endpoint
  - `/api/contact.js` - Contact form endpoint
  - `/api/newsletter/subscribe.js` - Newsletter subscription
  - `/api/newsletter/unsubscribe.js` - Newsletter unsubscription
- **Database**: Supabase (PostgreSQL)

## Deployment Steps

1. **Connect to Vercel**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Import the project in Vercel dashboard
   - Vercel will auto-detect Vite framework

2. **Set up Supabase Database**:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the migration scripts in `/supabase/migrations/` via SQL Editor
   - Get your API keys from Settings → API

3. **Environment Variables**:
   In Vercel dashboard, go to Settings → Environment Variables and add:
   ```
   VITE_API_URL=/api
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   
   > ⚠️ Make sure to add these to all environments (Production, Preview, Development)

3. **Build Settings** (auto-detected by Vercel):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## API Endpoints

Once deployed, your API endpoints will be available at:
- `GET  /api/health` - Health check with database status
- `POST /api/demo-request` - Submit demo request
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

## Local Development

For local development with the Express server:
```bash
npm run dev:all
```

This runs both:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001/api

## Production vs Development

- **Development**: Uses Express server on port 3001
- **Production (Vercel)**: Uses serverless functions in `/api` directory

The API client (`src/lib/api.ts`) automatically detects the environment:
- Production: Uses relative paths (`/api/*`)
- Development: Uses Express server URL (`http://localhost:3001/api`)

## Troubleshooting

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that `vercel.json` is properly configured
- Verify build command: `npm run build`

### API Not Working
- Check that `/api` directory exists with serverless functions
- Verify CORS headers in `vercel.json`
- Check Vercel function logs in dashboard

### Database Not Connecting
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in Vercel
- Check that the service role key is correct (not the anon key)
- Ensure database tables exist (run migrations)
- Check the `/api/health` endpoint - it shows database status

### Environment Variables
- Make sure `VITE_API_URL` is set in Vercel dashboard
- Environment variables prefixed with `VITE_` are exposed to the frontend
- `SUPABASE_*` variables should NOT have `VITE_` prefix (server-side only)

## Serverless Functions

The serverless functions in `/api`:
- Use Node.js runtime
- Support CORS automatically
- Handle OPTIONS preflight requests
- Return JSON responses

## Next Steps

1. Deploy to Vercel
2. Test the API endpoints
3. Update frontend API URL if needed
4. Monitor function logs in Vercel dashboard

# Vercel Deployment Guide

This project is configured to deploy on Vercel with serverless functions for the backend API.

## Project Structure

- **Frontend**: Vite + React app (builds to `dist/`)
- **Backend API**: Serverless functions in `/api` directory
  - `/api/health.js` - Health check endpoint
  - `/api/demo-request.js` - Demo request submission endpoint

## Deployment Steps

1. **Connect to Vercel**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Import the project in Vercel dashboard
   - Vercel will auto-detect Vite framework

2. **Environment Variables**:
   In Vercel dashboard, go to Settings → Environment Variables and add:
   ```
   VITE_API_URL=/api
   ```
   (This is optional - the code defaults to `/api` in production)

3. **Build Settings** (auto-detected by Vercel):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## API Endpoints

Once deployed, your API endpoints will be available at:
- `https://your-domain.vercel.app/api/health`
- `https://your-domain.vercel.app/api/demo-request`

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

### Environment Variables
- Make sure `VITE_API_URL` is set in Vercel dashboard
- Environment variables prefixed with `VITE_` are exposed to the frontend

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

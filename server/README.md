# ClarityClaim AI Backend Server

Express.js backend server for the ClarityClaim AI landing website.

## Features

- RESTful API endpoints
- CORS configuration for frontend integration
- Request validation
- Error handling middleware
- Health check endpoint

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Demo Request
```
POST /api/demo-request
```
Submit a demo request form.

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

**Response (201):**
```json
{
  "success": true,
  "message": "Demo request submitted successfully",
  "data": {
    "id": "demo-1234567890",
    "fullName": "Jane Doe",
    "email": "jane.doe@hospital.org",
    "organizationName": "Regional Medical Center",
    "organizationType": "Hospital",
    "monthlyClaimVolume": "10K–50K",
    "submittedAt": "2024-01-01T00:00:00.000Z"
  }
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
```

4. Start the server:
```bash
# Development mode
npm run dev:server

# Or run both frontend and backend together
npm run dev:all
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

## Future Enhancements

- Database integration (PostgreSQL, MongoDB, etc.)
- Email notifications (SendGrid, AWS SES, etc.)
- CRM integration (Salesforce, HubSpot, etc.)
- Authentication and authorization
- Rate limiting
- Request logging
- Data persistence

## Development

The server uses ES modules (`type: "module"` in package.json) and runs on Node.js.

For production deployment, consider:
- Using a process manager (PM2)
- Setting up reverse proxy (Nginx)
- Implementing proper logging
- Adding monitoring and alerting
- Setting up CI/CD pipeline

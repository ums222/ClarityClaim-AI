# ClarityClaim AI Landing Website

A modern, responsive landing website for ClarityClaim AI with integrated backend services.

## Features

- 🎨 Modern, responsive design with dark/light theme support
- ⚡ Fast performance with Vite and React
- 🔌 Backend API integration with Express.js
- 📝 Demo request form with validation
- 🎭 Smooth animations with Framer Motion
- 🎯 TypeScript for type safety

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios

### Backend
- Node.js
- Express.js
- CORS enabled
- Environment-based configuration

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd clarityclaim-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Frontend** - Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

**Backend** - Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```

4. Configure environment variables:

**`.env` (Frontend):**
```env
VITE_API_URL=http://localhost:3001/api
```

**`server/.env` (Backend):**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Running the Application

#### Option 1: Run Frontend and Backend Together
```bash
npm run dev:all
```

This will start both the frontend (Vite dev server) and backend (Express server) concurrently.

#### Option 2: Run Separately

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run dev:server
```

### Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## API Endpoints

### Health Check
```
GET /api/health
```

### Demo Request
```
POST /api/demo-request
```

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

## Project Structure

```
/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API client
│   └── ...
├── server/               # Backend server
│   ├── index.js         # Express server entry point
│   ├── .env             # Backend environment variables
│   └── README.md        # Backend documentation
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend development server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run start` - Start production backend server
- `npm run lint` - Run ESLint

## Development

### Frontend Development

The frontend uses Vite for fast development. Hot module replacement (HMR) is enabled by default.

### Backend Development

The backend uses Express.js with ES modules. The server automatically reloads on file changes when using `npm run dev:server`.

## Environment Variables

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001/api)

### Backend (server/.env)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Building for Production

1. Build the frontend:
```bash
npm run build
```

2. The built files will be in the `dist/` directory.

3. Start the production server:
```bash
npm run start
```

## Future Enhancements

- Database integration
- Email notifications
- CRM integration
- Authentication
- Analytics
- SEO optimization

## License

[Your License Here]

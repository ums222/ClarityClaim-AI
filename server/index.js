import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Override existing env vars with .env file values
dotenv.config({ path: join(__dirname, '.env'), override: true });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ClarityClaim AI Backend'
  });
});

// Demo request endpoint
app.post('/api/demo-request', async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      organizationName, 
      organizationType, 
      monthlyClaimVolume 
    } = req.body;

    // Validation
    if (!fullName || !email || !organizationName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['fullName', 'email', 'organizationName']
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    // In a production environment, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with CRM (Salesforce, HubSpot, etc.)
    // 4. Add to email marketing platform
    
    // For now, we'll log and return success
    console.log('Demo request received:', {
      fullName,
      email,
      organizationName,
      organizationType,
      monthlyClaimVolume,
      timestamp: new Date().toISOString()
    });

    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 500));

    res.status(201).json({
      success: true,
      message: 'Demo request submitted successfully',
      data: {
        id: `demo-${Date.now()}`,
        fullName,
        email,
        organizationName,
        organizationType,
        monthlyClaimVolume,
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing demo request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process demo request. Please try again later.'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

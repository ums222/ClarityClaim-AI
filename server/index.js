import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { isSupabaseConfigured } from './lib/supabase.js';
import { demoRequestsService, contactSubmissionsService, newsletterService } from './lib/database.js';
import { isHubSpotConfigured, syncDemoRequestToHubSpot } from './lib/hubspot.js';

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
    service: 'ClarityClaim AI Backend',
    database: isSupabaseConfigured() ? 'connected' : 'not configured',
    hubspot: isHubSpotConfigured() ? 'connected' : 'not configured'
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

    // Log the request
    console.log('Demo request received:', {
      fullName,
      email,
      organizationName,
      organizationType,
      monthlyClaimVolume,
      timestamp: new Date().toISOString()
    });

    // Save to database
    const { data, error } = await demoRequestsService.create({
      fullName,
      email,
      organizationName,
      organizationType,
      monthlyClaimVolume
    });

    if (error) {
      console.error('Database error:', error);
      // Still return success even if database fails - we logged the request
      // This prevents losing leads due to database issues
    }

    // Sync to HubSpot CRM (async, don't block response)
    syncDemoRequestToHubSpot({
      fullName,
      email,
      organizationName,
      organizationType,
      monthlyClaimVolume
    }).then(({ contact, deal, error: hubspotError }) => {
      if (hubspotError) {
        console.error('HubSpot sync error:', hubspotError);
      } else if (contact) {
        console.log('✅ Synced to HubSpot - Contact:', contact.id, deal ? `Deal: ${deal.id}` : '');
      }
    }).catch(err => {
      console.error('HubSpot sync failed:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Demo request submitted successfully',
      data: {
        id: data?.id || `demo-${Date.now()}`,
        fullName,
        email,
        organizationName,
        organizationType,
        monthlyClaimVolume,
        submittedAt: data?.created_at || new Date().toISOString()
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

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'message']
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    console.log('Contact submission received:', {
      name,
      email,
      subject,
      timestamp: new Date().toISOString()
    });

    // Save to database
    const { data, error } = await contactSubmissionsService.create({
      name,
      email,
      subject,
      message
    });

    if (error) {
      console.error('Database error:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: data?.id || `contact-${Date.now()}`,
        submittedAt: data?.created_at || new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing contact submission:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    console.log('Newsletter subscription:', {
      email,
      name,
      timestamp: new Date().toISOString()
    });

    // Save to database
    const { data, error } = await newsletterService.subscribe({
      email,
      name
    });

    if (error) {
      console.error('Database error:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        id: data?.id,
        email: data?.email || email,
        subscribedAt: data?.subscribed_at || new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to subscribe. Please try again later.'
    });
  }
});

// Newsletter unsubscribe endpoint
app.post('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required'
      });
    }

    const { data, error } = await newsletterService.unsubscribe(email);

    if (error) {
      console.error('Database error:', error);
      return res.status(404).json({
        error: 'Email not found in subscription list'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Error processing unsubscription:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to unsubscribe. Please try again later.'
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

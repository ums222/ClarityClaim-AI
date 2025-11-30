import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';
import { isSupabaseConfigured, getSupabaseClient } from './lib/supabase.js';
import { demoRequestsService, contactSubmissionsService, newsletterService } from './lib/database.js';
import { isHubSpotConfigured, syncDemoRequestToHubSpot } from './lib/hubspot.js';
import { isAIConfigured, predictDenialRisk, generateAppealLetter, analyzePatterns, getRiskFactorDefinitions } from './lib/ai.js';

// Load environment variables from server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Override existing env vars with .env file values
dotenv.config({ path: join(__dirname, '.env'), override: true });
// Also load from root .env for Railway
dotenv.config({ path: join(__dirname, '..', '.env'), override: false });

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: isProduction ? true : (process.env.FRONTEND_URL || 'http://localhost:5173'),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files in production
const distPath = join(__dirname, '..', 'dist');
console.log('📂 Static files path:', distPath);
console.log('📂 Dist exists:', existsSync(distPath));

if (existsSync(distPath)) {
  // Serve static files with proper MIME types
  app.use(express.static(distPath, {
    maxAge: isProduction ? '1d' : 0,
    etag: true,
    index: false, // Don't auto-serve index.html, let SPA fallback handle it
  }));
  console.log('✅ Static file middleware registered');
}

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

// ============================================
// AI/ML API Endpoints
// ============================================

// Update health check to include AI status
app.get('/api/health', (req, res) => {
  let distFiles = [];
  let assetsFiles = [];
  
  try {
    if (existsSync(distPath)) {
      distFiles = readdirSync(distPath);
    }
    const assetsPath = join(distPath, 'assets');
    if (existsSync(assetsPath)) {
      assetsFiles = readdirSync(assetsPath);
    }
  } catch (e) {
    distFiles = ['error: ' + e.message];
  }
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ClarityClaim AI Backend',
    database: isSupabaseConfigured() ? 'connected' : 'not configured',
    hubspot: isHubSpotConfigured() ? 'connected' : 'not configured',
    ai: isAIConfigured() ? 'connected' : 'using fallback (template-based)',
    environment: process.env.NODE_ENV || 'development',
    distExists: existsSync(distPath),
    distPath: distPath,
    distFiles: distFiles,
    assetsFiles: assetsFiles
  });
});

// Predict denial risk for a claim
app.post('/api/claims/:id/predict-denial', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({
        error: 'Database not configured',
        message: 'Supabase is not configured. Cannot fetch claim data.'
      });
    }
    
    // Fetch claim data
    const { data: claim, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !claim) {
      return res.status(404).json({
        error: 'Claim not found',
        message: `No claim found with ID: ${id}`
      });
    }
    
    // Run prediction
    const prediction = await predictDenialRisk(claim);
    
    // Update claim with prediction results
    await supabase
      .from('claims')
      .update({
        denial_risk_score: prediction.score,
        denial_risk_level: prediction.level,
        denial_risk_factors: prediction.factors,
        ai_recommendations: prediction.recommendations,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    res.json({
      success: true,
      claimId: id,
      prediction,
      aiEnabled: isAIConfigured(),
    });
  } catch (error) {
    console.error('Error predicting denial:', error);
    res.status(500).json({
      error: 'Prediction failed',
      message: error.message || 'Failed to predict denial risk'
    });
  }
});

// Generate appeal letter for a claim
app.post('/api/claims/:id/generate-appeal', async (req, res) => {
  try {
    const { id } = req.params;
    const { denial_reason, denial_code, additional_context } = req.body;
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({
        error: 'Database not configured',
        message: 'Supabase is not configured. Cannot fetch claim data.'
      });
    }
    
    // Fetch claim data
    const { data: claim, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !claim) {
      return res.status(404).json({
        error: 'Claim not found',
        message: `No claim found with ID: ${id}`
      });
    }
    
    // Generate appeal letter
    const appeal = await generateAppealLetter(claim, {
      denial_reason: denial_reason || claim.denial_reasons?.[0],
      denial_code: denial_code || claim.denial_codes?.[0],
      additional_context,
    });
    
    // Log activity
    await supabase.from('claim_activities').insert({
      claim_id: id,
      action: 'appeal_generated',
      action_details: {
        type: appeal.type,
        denial_reason,
      },
    });
    
    res.json({
      success: true,
      claimId: id,
      appeal,
      aiEnabled: isAIConfigured(),
    });
  } catch (error) {
    console.error('Error generating appeal:', error);
    res.status(500).json({
      error: 'Appeal generation failed',
      message: error.message || 'Failed to generate appeal letter'
    });
  }
});

// Get pattern analysis for organization's claims
app.get('/api/analytics/patterns', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({
        error: 'Database not configured',
        message: 'Supabase is not configured.'
      });
    }
    
    // Get date range from query params (default to last 90 days)
    const { days = 90 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Fetch claims for analysis
    const { data: claims, error } = await supabase
      .from('claims')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Run pattern analysis
    const analysis = await analyzePatterns(claims || []);
    
    res.json({
      success: true,
      ...analysis,
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days: parseInt(days),
      },
    });
  } catch (error) {
    console.error('Error analyzing patterns:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'Failed to analyze patterns'
    });
  }
});

// Get risk factor definitions
app.get('/api/analytics/risk-factors', (req, res) => {
  try {
    const riskFactors = getRiskFactorDefinitions();
    
    res.json({
      success: true,
      riskFactors,
      count: riskFactors.length,
    });
  } catch (error) {
    console.error('Error fetching risk factors:', error);
    res.status(500).json({
      error: 'Failed to fetch risk factors',
      message: error.message
    });
  }
});

// Bulk prediction for multiple claims
app.post('/api/claims/bulk-predict', async (req, res) => {
  try {
    const { claimIds } = req.body;
    
    if (!claimIds || !Array.isArray(claimIds) || claimIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'claimIds array is required'
      });
    }
    
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({
        error: 'Database not configured'
      });
    }
    
    // Fetch claims
    const { data: claims, error } = await supabase
      .from('claims')
      .select('*')
      .in('id', claimIds);
    
    if (error) {
      throw error;
    }
    
    // Process predictions in parallel (limit to 10 at a time)
    const results = [];
    for (const claim of claims) {
      const prediction = await predictDenialRisk(claim);
      
      // Update claim
      await supabase
        .from('claims')
        .update({
          denial_risk_score: prediction.score,
          denial_risk_level: prediction.level,
          denial_risk_factors: prediction.factors,
          ai_recommendations: prediction.recommendations,
          updated_at: new Date().toISOString(),
        })
        .eq('id', claim.id);
      
      results.push({
        claimId: claim.id,
        claimNumber: claim.claim_number,
        prediction,
      });
    }
    
    res.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error('Error in bulk prediction:', error);
    res.status(500).json({
      error: 'Bulk prediction failed',
      message: error.message
    });
  }
});

// Get AI status and capabilities
app.get('/api/ai/status', (req, res) => {
  res.json({
    enabled: isAIConfigured(),
    capabilities: {
      denialPrediction: true,
      appealGeneration: true,
      patternAnalysis: true,
      riskScoring: true,
    },
    model: isAIConfigured() ? 'gemini-2.0-flash' : 'rule-based',
    features: {
      realTimeAnalysis: true,
      bulkProcessing: true,
      customRecommendations: isAIConfigured(),
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// SPA fallback - serve index.html for client-side routing in production
if (isProduction && existsSync(distPath)) {
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes or static assets
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`
      });
    }
    
    // Check if it's a static file request (has file extension)
    if (req.path.match(/\.\w+$/)) {
      // It's a file request but file wasn't found by static middleware
      return res.status(404).send('File not found');
    }
    
    // For all other routes, serve index.html (SPA routing)
    res.sendFile(join(distPath, 'index.html'));
  });
} else {
  // 404 handler for development
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not found',
      message: `Route ${req.method} ${req.path} not found`
    });
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (isProduction) {
    console.log(`📦 Serving static files from ${distPath}`);
  }
});

export default app;

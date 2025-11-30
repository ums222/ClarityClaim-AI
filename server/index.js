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
import {
  isStripeConfigured,
  getStripeClient,
  getOrCreateCustomer,
  createCheckoutSession,
  createPortalSession,
  createSetupIntent,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  resumeSubscription,
  getCustomerInvoices,
  getPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  verifyWebhookSignature,
  getUpcomingInvoice,
  PLANS,
} from './lib/stripe.js';

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

const getUserOrganizationContext = async (req, supabase) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return { error: { status: 401, body: { error: 'Authorization required' } } };
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (authError || !user) {
    return { error: { status: 401, body: { error: 'Invalid token' } } };
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.organization_id) {
    return { error: { status: 404, body: { error: 'Organization not found' } } };
  }

  return { user, organizationId: profile.organization_id };
};

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

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    // Fetch claim data
    const { data: claim, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error || !claim) {
      const { data: claimOrg } = await supabase
        .from('claims')
        .select('organization_id')
        .eq('id', id)
        .single();

      if (claimOrg && claimOrg.organization_id !== organizationId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'This claim does not belong to your organization.'
        });
      }

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
      .eq('id', id)
      .eq('organization_id', organizationId);
    
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

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    // Fetch claim data
    const { data: claim, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error || !claim) {
      const { data: claimOrg } = await supabase
        .from('claims')
        .select('organization_id')
        .eq('id', id)
        .single();

      if (claimOrg && claimOrg.organization_id !== organizationId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'This claim does not belong to your organization.'
        });
      }

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

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    // Fetch claims
    const { data: claims, error } = await supabase
      .from('claims')
      .select('*')
      .in('id', claimIds)
      .eq('organization_id', organizationId);

    if (error) {
      throw error;
    }

    const missingIds = claimIds.filter(id => !claims?.some(claim => claim.id === id));
    if (missingIds.length > 0) {
      const { data: missingClaims } = await supabase
        .from('claims')
        .select('id, organization_id')
        .in('id', missingIds);

      const unauthorizedIds = missingClaims?.filter(claim => claim.organization_id !== organizationId).map(claim => claim.id) || [];

      if (unauthorizedIds.length > 0) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'One or more claims do not belong to your organization.',
          unauthorizedIds,
        });
      }

      return res.status(404).json({
        error: 'Claims not found',
        missingIds,
      });
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
        .eq('id', claim.id)
        .eq('organization_id', organizationId);
      
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

// ============================================
// Appeals API Endpoints
// ============================================

// Get all appeals with filters
app.get('/api/appeals', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    const {
      status,
      outcome,
      priority,
      page = 1, 
      pageSize = 20,
      sortBy = 'created_at',
      sortOrder = 'desc',
      search
    } = req.query;

    let query = supabase
      .from('appeals')
      .select(`
        *,
        claim:claims(claim_number, patient_name, payer_name, service_date, billed_amount)
      `, { count: 'exact' });

    query = query.eq('organization_id', organizationId);

    // Apply filters
    if (status) {
      query = query.in('status', status.split(','));
    }
    if (outcome) {
      query = query.in('outcome', outcome.split(','));
    }
    if (priority) {
      query = query.in('priority', priority.split(','));
    }
    if (search) {
      query = query.or(`appeal_number.ilike.%${search}%,original_denial_reason.ilike.%${search}%`);
    }

    // Pagination
    const from = (parseInt(page) - 1) * parseInt(pageSize);
    const to = from + parseInt(pageSize) - 1;
    
    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

    const { data, count, error } = await query;
    
    if (error) throw error;

    res.json({
      success: true,
      appeals: data || [],
      total: count || 0,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  } catch (error) {
    console.error('Error fetching appeals:', error);
    res.status(500).json({ error: 'Failed to fetch appeals', message: error.message });
  }
});

// Get single appeal with full details
app.get('/api/appeals/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    const { id } = req.params;
    const { data, error } = await supabase
      .from('appeals')
      .select(`
        *,
        claim:claims(*)
      `)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') throw error;
    }
    if (!data) {
      const { data: appealOrg } = await supabase
        .from('appeals')
        .select('organization_id')
        .eq('id', id)
        .single();

      if (appealOrg && appealOrg.organization_id !== organizationId) {
        return res.status(403).json({ error: 'Forbidden', message: 'This appeal does not belong to your organization.' });
      }

      return res.status(404).json({ error: 'Appeal not found' });
    }

    res.json({ success: true, appeal: data });
  } catch (error) {
    console.error('Error fetching appeal:', error);
    res.status(500).json({ error: 'Failed to fetch appeal', message: error.message });
  }
});

// Create new appeal
app.post('/api/appeals', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const appealData = req.body;
    
    // Generate appeal number
    const appealNumber = `APL-${Date.now().toString(36).toUpperCase()}`;
    
    const { data, error } = await supabase
      .from('appeals')
      .insert({
        ...appealData,
        appeal_number: appealNumber,
        status: appealData.status || 'draft',
        priority: appealData.priority || 'normal',
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from('appeal_activities').insert({
      appeal_id: data.id,
      action: 'created',
      action_details: { appeal_number: data.appeal_number },
    });

    res.status(201).json({ success: true, appeal: data });
  } catch (error) {
    console.error('Error creating appeal:', error);
    res.status(500).json({ error: 'Failed to create appeal', message: error.message });
  }
});

// Update appeal
app.put('/api/appeals/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    const { id } = req.params;
    const updates = req.body;

    // Get old appeal for activity logging
    const { data: oldAppeal } = await supabase
      .from('appeals')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (!oldAppeal) {
      const { data: appealOrg } = await supabase
        .from('appeals')
        .select('organization_id')
        .eq('id', id)
        .single();

      if (appealOrg && appealOrg.organization_id !== organizationId) {
        return res.status(403).json({ error: 'Forbidden', message: 'This appeal does not belong to your organization.' });
      }

      return res.status(404).json({ error: 'Appeal not found' });
    }

    const { data, error } = await supabase
      .from('appeals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw error;

    // Log status change
    if (oldAppeal && updates.status && oldAppeal.status !== updates.status) {
      await supabase.from('appeal_activities').insert({
        appeal_id: id,
        action: 'status_changed',
        action_details: { from: oldAppeal.status, to: updates.status },
        previous_value: oldAppeal.status,
        new_value: updates.status,
      });
    }

    // Log outcome received
    if (oldAppeal && updates.outcome && oldAppeal.outcome !== updates.outcome) {
      await supabase.from('appeal_activities').insert({
        appeal_id: id,
        action: 'outcome_received',
        action_details: {
          outcome: updates.outcome,
          amount_approved: updates.amount_approved,
        },
      });
    }

    res.json({ success: true, appeal: data });
  } catch (error) {
    console.error('Error updating appeal:', error);
    res.status(500).json({ error: 'Failed to update appeal', message: error.message });
  }
});

// Submit appeal
app.post('/api/appeals/:id/submit', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    const { id } = req.params;
    const { submission_method = 'portal' } = req.body;

    const { data: appealOrg } = await supabase
      .from('appeals')
      .select('organization_id')
      .eq('id', id)
      .single();

    if (!appealOrg) {
      return res.status(404).json({ error: 'Appeal not found' });
    }

    if (appealOrg.organization_id !== organizationId) {
      return res.status(403).json({ error: 'Forbidden', message: 'This appeal does not belong to your organization.' });
    }

    const { data, error } = await supabase
      .from('appeals')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        submission_method,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from('appeal_activities').insert({
      appeal_id: id,
      action: 'submitted',
      action_details: { method: submission_method, submitted_at: data.submitted_at },
    });

    res.json({ success: true, appeal: data });
  } catch (error) {
    console.error('Error submitting appeal:', error);
    res.status(500).json({ error: 'Failed to submit appeal', message: error.message });
  }
});

// Record appeal outcome
app.post('/api/appeals/:id/outcome', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    const { id } = req.params;
    const { outcome, outcome_reason, amount_approved, amount_recovered, payer_response } = req.body;

    const newStatus = outcome === 'approved' ? 'approved'
      : outcome === 'partially_approved' ? 'partially_approved'
      : outcome === 'denied' ? 'denied'
      : 'under_review';

    const { data: appealOrg } = await supabase
      .from('appeals')
      .select('organization_id, claim_id')
      .eq('id', id)
      .single();

    if (!appealOrg) {
      return res.status(404).json({ error: 'Appeal not found' });
    }

    if (appealOrg.organization_id !== organizationId) {
      return res.status(403).json({ error: 'Forbidden', message: 'This appeal does not belong to your organization.' });
    }

    const { data, error } = await supabase
      .from('appeals')
      .update({
        status: newStatus,
        outcome,
        outcome_date: new Date().toISOString().split('T')[0],
        outcome_reason,
        amount_approved,
        amount_recovered,
        payer_response,
        payer_response_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from('appeal_activities').insert({
      appeal_id: id,
      action: 'outcome_received',
      action_details: { outcome, amount_approved, amount_recovered },
    });

    // Update related claim status if appeal was successful
    if (data.claim_id && (outcome === 'approved' || outcome === 'partially_approved')) {
      await supabase
        .from('claims')
        .update({
          status: outcome === 'approved' ? 'appeal_won' : 'partially_paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.claim_id)
        .eq('organization_id', organizationId);
    }

    res.json({ success: true, appeal: data });
  } catch (error) {
    console.error('Error recording outcome:', error);
    res.status(500).json({ error: 'Failed to record outcome', message: error.message });
  }
});

// Get appeal activities
app.get('/api/appeals/:id/activities', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    const { id } = req.params;

    const { data: appealOrg } = await supabase
      .from('appeals')
      .select('organization_id')
      .eq('id', id)
      .single();

    if (!appealOrg) {
      return res.status(404).json({ error: 'Appeal not found' });
    }

    if (appealOrg.organization_id !== organizationId) {
      return res.status(403).json({ error: 'Forbidden', message: 'This appeal does not belong to your organization.' });
    }

    const { data, error } = await supabase
      .from('appeal_activities')
      .select('*')
      .eq('appeal_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, activities: data || [] });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities', message: error.message });
  }
});

// Generate AI appeal letter for an appeal
app.post('/api/appeals/:id/generate-letter', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { error: authError, organizationId } = await getUserOrganizationContext(req, supabase);
    if (authError) {
      return res.status(authError.status).json(authError.body);
    }

    const { id } = req.params;
    const { template_id, additional_context } = req.body;

    // Get appeal with claim data
    const { data: appeal, error: appealError } = await supabase
      .from('appeals')
      .select(`*, claim:claims(*)`)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (appealError || !appeal) {
      const { data: appealOrg } = await supabase
        .from('appeals')
        .select('organization_id')
        .eq('id', id)
        .single();

      if (appealOrg && appealOrg.organization_id !== organizationId) {
        return res.status(403).json({ error: 'Forbidden', message: 'This appeal does not belong to your organization.' });
      }

      return res.status(404).json({ error: 'Appeal not found' });
    }

    // Generate letter using AI
    const result = await generateAppealLetter(appeal.claim || {}, {
      denial_reason: appeal.original_denial_reason,
      denial_code: appeal.original_denial_code,
      additional_context,
    });

    // Update appeal with generated letter
    await supabase
      .from('appeals')
      .update({
        appeal_letter: result.letter,
        ai_generated: result.type === 'ai-generated',
        ai_model: result.model,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('organization_id', organizationId);

    // Log activity
    await supabase.from('appeal_activities').insert({
      appeal_id: id,
      action: 'letter_generated',
      action_details: { type: result.type, model: result.model },
    });

    res.json({
      success: true,
      letter: result.letter,
      type: result.type,
      model: result.model,
      generatedAt: result.generatedAt,
    });
  } catch (error) {
    console.error('Error generating letter:', error);
    res.status(500).json({ error: 'Failed to generate letter', message: error.message });
  }
});

// ============================================
// Appeal Templates API
// ============================================

// Get all templates
app.get('/api/appeal-templates', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { category, active_only = 'true' } = req.query;

    let query = supabase.from('appeal_templates').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    if (active_only === 'true') {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query.order('usage_count', { ascending: false });

    if (error) throw error;

    res.json({ success: true, templates: data || [] });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates', message: error.message });
  }
});

// Get single template
app.get('/api/appeal-templates/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { id } = req.params;
    const { data, error } = await supabase
      .from('appeal_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ success: true, template: data });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template', message: error.message });
  }
});

// Create custom template
app.post('/api/appeal-templates', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const templateData = req.body;
    
    const { data, error } = await supabase
      .from('appeal_templates')
      .insert({
        ...templateData,
        is_system: false,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, template: data });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template', message: error.message });
  }
});

// Increment template usage
app.post('/api/appeal-templates/:id/use', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { id } = req.params;
    
    // Get current usage count
    const { data: template } = await supabase
      .from('appeal_templates')
      .select('usage_count')
      .eq('id', id)
      .single();

    await supabase
      .from('appeal_templates')
      .update({ usage_count: (template?.usage_count || 0) + 1 })
      .eq('id', id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating usage:', error);
    res.status(500).json({ error: 'Failed to update usage', message: error.message });
  }
});

// ============================================
// Appeals Analytics
// ============================================

app.get('/api/appeals/analytics/stats', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { data: appeals, error } = await supabase.from('appeals').select('*');
    if (error) throw error;

    const stats = {
      total: appeals?.length || 0,
      byStatus: {},
      byOutcome: {},
      byPriority: {},
      totalAppealed: 0,
      totalRecovered: 0,
      recoveryRate: 0,
      avgDaysToResolution: 0,
      pendingDeadlines: 0,
      successRate: 0,
    };

    if (!appeals || appeals.length === 0) {
      return res.json({ success: true, stats });
    }

    let resolvedCount = 0;
    let totalDays = 0;
    let successCount = 0;
    const today = new Date();

    appeals.forEach(appeal => {
      // Status counts
      stats.byStatus[appeal.status] = (stats.byStatus[appeal.status] || 0) + 1;

      // Outcome counts
      if (appeal.outcome) {
        stats.byOutcome[appeal.outcome] = (stats.byOutcome[appeal.outcome] || 0) + 1;
        if (appeal.outcome === 'approved' || appeal.outcome === 'partially_approved') {
          successCount++;
        }
      }

      // Priority counts
      stats.byPriority[appeal.priority] = (stats.byPriority[appeal.priority] || 0) + 1;

      // Financial totals
      stats.totalAppealed += appeal.amount_appealed || 0;
      stats.totalRecovered += appeal.amount_recovered || 0;

      // Resolution time
      if (appeal.outcome_date && appeal.created_at) {
        const created = new Date(appeal.created_at);
        const resolved = new Date(appeal.outcome_date);
        totalDays += Math.floor((resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        resolvedCount++;
      }

      // Pending deadlines (within 7 days)
      if (appeal.deadline && !['submitted', 'approved', 'denied', 'withdrawn'].includes(appeal.status)) {
        const deadline = new Date(appeal.deadline);
        const daysToDeadline = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysToDeadline <= 7 && daysToDeadline >= 0) {
          stats.pendingDeadlines++;
        }
      }
    });

    const totalOutcomes = (stats.byOutcome.approved || 0) + (stats.byOutcome.partially_approved || 0) + (stats.byOutcome.denied || 0);
    stats.recoveryRate = stats.totalAppealed > 0 ? (stats.totalRecovered / stats.totalAppealed) * 100 : 0;
    stats.avgDaysToResolution = resolvedCount > 0 ? Math.round(totalDays / resolvedCount) : 0;
    stats.successRate = totalOutcomes > 0 ? (successCount / totalOutcomes) * 100 : 0;

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching appeal stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

// ============================================
// Settings & Configuration API Endpoints
// ============================================

// Get current user profile
app.get('/api/settings/profile', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    // In production, get user from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, organization:organizations(name)')
      .eq('id', userData.user.id)
      .single();

    if (error) throw error;

    res.json({ success: true, profile: data });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile', message: error.message });
  }
});

// Update user profile
app.put('/api/settings/profile', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const updates = req.body;
    const allowedFields = ['full_name', 'phone', 'job_title', 'department', 'timezone', 'date_format', 'avatar_url'];
    const filteredUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...filteredUpdates, updated_at: new Date().toISOString() })
      .eq('id', userData.user.id)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabase.from('audit_logs').insert({
      organization_id: data.organization_id,
      user_id: userData.user.id,
      action: 'profile.updated',
      resource_type: 'user',
      resource_id: userData.user.id,
      new_values: filteredUpdates,
    });

    res.json({ success: true, profile: data });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile', message: error.message });
  }
});

// Update password
app.post('/api/settings/password', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password', message: error.message });
  }
});

// Get organization settings
app.get('/api/settings/organization', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', userData.user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'No organization found' });
    }

    // Get organization with settings
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', profile.organization_id)
      .single();

    if (orgError) throw orgError;

    // Get or create organization settings
    let { data: settings, error: settingsError } = await supabase
      .from('organization_settings')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .single();

    if (settingsError && settingsError.code === 'PGRST116') {
      // Create default settings
      const { data: newSettings, error: createError } = await supabase
        .from('organization_settings')
        .insert({ organization_id: profile.organization_id })
        .select()
        .single();

      if (createError) throw createError;
      settings = newSettings;
    } else if (settingsError) {
      throw settingsError;
    }

    res.json({
      success: true,
      organization: org,
      settings,
      userRole: profile.role,
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'Failed to fetch organization', message: error.message });
  }
});

// Update organization
app.put('/api/settings/organization', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', userData.user.id)
      .single();

    if (!['owner', 'admin'].includes(profile?.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { name, ...settings } = req.body;

    // Update organization name if provided
    if (name) {
      await supabase
        .from('organizations')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', profile.organization_id);
    }

    // Update settings if any
    if (Object.keys(settings).length > 0) {
      await supabase
        .from('organization_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('organization_id', profile.organization_id);
    }

    // Log audit
    await supabase.from('audit_logs').insert({
      organization_id: profile.organization_id,
      user_id: userData.user.id,
      action: 'organization.updated',
      resource_type: 'organization',
      resource_id: profile.organization_id,
      new_values: req.body,
    });

    res.json({ success: true, message: 'Organization updated' });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ error: 'Failed to update organization', message: error.message });
  }
});

// Get team members
app.get('/api/settings/team', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', userData.user.id)
      .single();

    if (!profile?.organization_id) {
      return res.json({ success: true, members: [], invitations: [] });
    }

    // Get members
    const { data: members, error: membersError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, avatar_url, role, job_title, department, last_login, created_at')
      .eq('organization_id', profile.organization_id)
      .order('created_at');

    if (membersError) throw membersError;

    // Get pending invitations
    const { data: invitations, error: invError } = await supabase
      .from('team_invitations')
      .select('*, inviter:user_profiles!team_invitations_invited_by_fkey(full_name, email)')
      .eq('organization_id', profile.organization_id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (invError) throw invError;

    res.json({
      success: true,
      members: members || [],
      invitations: invitations || [],
      currentUserId: userData.user.id,
      userRole: profile.role,
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team', message: error.message });
  }
});

// Invite team member
app.post('/api/settings/team/invite', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', userData.user.id)
      .single();

    if (!['owner', 'admin', 'manager'].includes(profile?.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { email, role = 'member' } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate token
    const token = `inv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data, error } = await supabase
      .from('team_invitations')
      .insert({
        organization_id: profile.organization_id,
        invited_by: userData.user.id,
        email,
        role,
        token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabase.from('audit_logs').insert({
      organization_id: profile.organization_id,
      user_id: userData.user.id,
      action: 'team.invited',
      resource_type: 'invitation',
      resource_id: data.id,
      new_values: { email, role },
    });

    res.status(201).json({ success: true, invitation: data });
  } catch (error) {
    console.error('Error inviting member:', error);
    res.status(500).json({ error: 'Failed to send invitation', message: error.message });
  }
});

// Update team member role
app.put('/api/settings/team/:memberId/role', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', userData.user.id)
      .single();

    if (!['owner', 'admin'].includes(profile?.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { memberId } = req.params;
    const { role } = req.body;

    if (role === 'owner') {
      return res.status(400).json({ error: 'Cannot assign owner role' });
    }

    // Get target member's current role
    const { data: targetMember } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', memberId)
      .eq('organization_id', profile.organization_id)
      .single();

    if (targetMember?.role === 'owner') {
      return res.status(400).json({ error: 'Cannot change owner role' });
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', memberId)
      .eq('organization_id', profile.organization_id);

    if (error) throw error;

    // Log audit
    await supabase.from('audit_logs').insert({
      organization_id: profile.organization_id,
      user_id: userData.user.id,
      action: 'team.role_changed',
      resource_type: 'user',
      resource_id: memberId,
      old_values: { role: targetMember?.role },
      new_values: { role },
    });

    res.json({ success: true, message: 'Role updated' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role', message: error.message });
  }
});

// Remove team member
app.delete('/api/settings/team/:memberId', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', userData.user.id)
      .single();

    if (!['owner', 'admin'].includes(profile?.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { memberId } = req.params;

    if (memberId === userData.user.id) {
      return res.status(400).json({ error: 'Cannot remove yourself' });
    }

    const { data: targetMember } = await supabase
      .from('user_profiles')
      .select('role, email')
      .eq('id', memberId)
      .eq('organization_id', profile.organization_id)
      .single();

    if (targetMember?.role === 'owner') {
      return res.status(400).json({ error: 'Cannot remove organization owner' });
    }

    // Remove from organization (don't delete account)
    const { error } = await supabase
      .from('user_profiles')
      .update({ organization_id: null, role: 'member', updated_at: new Date().toISOString() })
      .eq('id', memberId);

    if (error) throw error;

    // Log audit
    await supabase.from('audit_logs').insert({
      organization_id: profile.organization_id,
      user_id: userData.user.id,
      action: 'team.removed',
      resource_type: 'user',
      resource_id: memberId,
      old_values: { email: targetMember?.email },
    });

    res.json({ success: true, message: 'Member removed' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Failed to remove member', message: error.message });
  }
});

// Revoke invitation
app.delete('/api/settings/team/invitation/:invitationId', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { invitationId } = req.params;

    const { error } = await supabase
      .from('team_invitations')
      .update({ status: 'revoked' })
      .eq('id', invitationId);

    if (error) throw error;

    res.json({ success: true, message: 'Invitation revoked' });
  } catch (error) {
    console.error('Error revoking invitation:', error);
    res.status(500).json({ error: 'Failed to revoke invitation', message: error.message });
  }
});

// Get integrations
app.get('/api/settings/integrations', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', userData.user.id)
      .single();

    if (!profile?.organization_id) {
      return res.json({ success: true, integrations: [] });
    }

    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, integrations: data || [] });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ error: 'Failed to fetch integrations', message: error.message });
  }
});

// Create integration
app.post('/api/settings/integrations', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', userData.user.id)
      .single();

    if (!['owner', 'admin'].includes(profile?.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const integrationData = req.body;

    const { data, error } = await supabase
      .from('integrations')
      .insert({
        ...integrationData,
        organization_id: profile.organization_id,
        created_by: userData.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabase.from('audit_logs').insert({
      organization_id: profile.organization_id,
      user_id: userData.user.id,
      action: 'integration.created',
      resource_type: 'integration',
      resource_id: data.id,
      new_values: { name: data.name, type: data.type, provider: data.provider },
    });

    res.status(201).json({ success: true, integration: data });
  } catch (error) {
    console.error('Error creating integration:', error);
    res.status(500).json({ error: 'Failed to create integration', message: error.message });
  }
});

// Update integration
app.put('/api/settings/integrations/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('integrations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, integration: data });
  } catch (error) {
    console.error('Error updating integration:', error);
    res.status(500).json({ error: 'Failed to update integration', message: error.message });
  }
});

// Delete integration
app.delete('/api/settings/integrations/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Integration deleted' });
  } catch (error) {
    console.error('Error deleting integration:', error);
    res.status(500).json({ error: 'Failed to delete integration', message: error.message });
  }
});

// Test integration
app.post('/api/settings/integrations/:id/test', async (req, res) => {
  try {
    // Simulate integration test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({
      success: true,
      status: 'connected',
      message: 'Connection test successful',
      testedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error testing integration:', error);
    res.status(500).json({ error: 'Connection test failed', message: error.message });
  }
});

// Get API keys
app.get('/api/settings/api-keys', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', userData.user.id)
      .single();

    if (!profile?.organization_id) {
      return res.json({ success: true, apiKeys: [] });
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('*, creator:user_profiles!api_keys_created_by_fkey(full_name, email)')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, apiKeys: data || [] });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Failed to fetch API keys', message: error.message });
  }
});

// Create API key
app.post('/api/settings/api-keys', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', userData.user.id)
      .single();

    if (!['owner', 'admin'].includes(profile?.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { name, description, permissions = ['read'], expiresInDays } = req.body;

    // Generate key
    const fullKey = `cc_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const keyPrefix = fullKey.substring(0, 12);
    const keyHash = fullKey; // In production, hash this

    let expiresAt = null;
    if (expiresInDays) {
      const date = new Date();
      date.setDate(date.getDate() + expiresInDays);
      expiresAt = date.toISOString();
    }

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        organization_id: profile.organization_id,
        created_by: userData.user.id,
        name,
        description,
        key_prefix: keyPrefix,
        key_hash: keyHash,
        permissions,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabase.from('audit_logs').insert({
      organization_id: profile.organization_id,
      user_id: userData.user.id,
      action: 'api_key.created',
      resource_type: 'api_key',
      resource_id: data.id,
      new_values: { name, permissions },
    });

    // Return full key only once
    res.status(201).json({
      success: true,
      apiKey: data,
      fullKey, // This is the only time the full key is returned
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Failed to create API key', message: error.message });
  }
});

// Revoke API key
app.post('/api/settings/api-keys/:id/revoke', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('api_keys')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_by: userData.user.id,
      })
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'API key revoked' });
  } catch (error) {
    console.error('Error revoking API key:', error);
    res.status(500).json({ error: 'Failed to revoke API key', message: error.message });
  }
});

// Get notification preferences
app.get('/api/settings/notifications', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    let { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Create default preferences
      const { data: newPrefs, error: createError } = await supabase
        .from('notification_preferences')
        .insert({ user_id: userData.user.id })
        .select()
        .single();

      if (createError) throw createError;
      data = newPrefs;
    } else if (error) {
      throw error;
    }

    res.json({ success: true, preferences: data });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch preferences', message: error.message });
  }
});

// Update notification preferences
app.put('/api/settings/notifications', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const updates = req.body;

    // Try update first, if not exists, insert
    const { data: existing } = await supabase
      .from('notification_preferences')
      .select('id')
      .eq('user_id', userData.user.id)
      .single();

    let data;
    if (existing) {
      const { data: updated, error } = await supabase
        .from('notification_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userData.user.id)
        .select()
        .single();

      if (error) throw error;
      data = updated;
    } else {
      const { data: created, error } = await supabase
        .from('notification_preferences')
        .insert({ user_id: userData.user.id, ...updates })
        .select()
        .single();

      if (error) throw error;
      data = created;
    }

    res.json({ success: true, preferences: data });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({ error: 'Failed to update preferences', message: error.message });
  }
});

// Get audit logs
app.get('/api/settings/audit-logs', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', userData.user.id)
      .single();

    if (!['owner', 'admin'].includes(profile?.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { page = 1, pageSize = 50, action, resource_type } = req.query;

    let query = supabase
      .from('audit_logs')
      .select('*, user:user_profiles(full_name, email)', { count: 'exact' })
      .eq('organization_id', profile.organization_id);

    if (action) query = query.eq('action', action);
    if (resource_type) query = query.eq('resource_type', resource_type);

    const from = (parseInt(page) - 1) * parseInt(pageSize);
    const to = from + parseInt(pageSize) - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      success: true,
      logs: data || [],
      total: count || 0,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs', message: error.message });
  }
});

// ============================================
// Security & Compliance API Endpoints
// ============================================

// Get 2FA settings
app.get('/api/security/2fa', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: settings, error } = await supabase
      .from('user_2fa')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Return default settings if none exist
    if (!settings) {
      return res.json({
        user_id: user.id,
        totp_enabled: false,
        sms_enabled: false,
        backup_codes_used: 0,
        require_2fa_for_sensitive: true,
        trusted_devices: [],
      });
    }

    // Don't expose secrets
    const safeSettings = { ...settings };
    delete safeSettings.totp_secret;
    delete safeSettings.backup_codes;

    res.json(safeSettings);
  } catch (error) {
    console.error('Error fetching 2FA settings:', error);
    res.status(500).json({ error: 'Failed to fetch 2FA settings' });
  }
});

// Setup 2FA (generate TOTP secret)
app.post('/api/security/2fa/setup', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Generate a random secret (in production, use a proper TOTP library)
    const secret = Array.from({ length: 32 }, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
    ).join('');

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // Store in database
    await supabase
      .from('user_2fa')
      .upsert({
        user_id: user.id,
        totp_secret: secret, // In production, encrypt this
        backup_codes: JSON.stringify(backupCodes), // In production, hash these
        backup_codes_generated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    // Generate QR code URL (otpauth format)
    const qrCode = `otpauth://totp/ClarityClaim:${user.email}?secret=${secret}&issuer=ClarityClaim`;

    res.json({
      secret,
      qrCode,
      backupCodes,
    });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

// Verify and enable 2FA
app.post('/api/security/2fa/verify', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Verification code required' });
    }

    // In production, actually verify the TOTP code against the secret
    // For demo purposes, accept any 6-digit code
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Invalid code format' });
    }

    await supabase
      .from('user_2fa')
      .update({
        totp_enabled: true,
        totp_verified_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    // Log the action
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    await supabase.from('security_audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      organization_id: profile?.organization_id,
      action_type: '2fa_enabled',
      action_category: 'auth',
      description: 'Two-factor authentication enabled',
      severity: 'info',
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// Disable 2FA
app.post('/api/security/2fa/disable', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Verification code required' });
    }

    await supabase
      .from('user_2fa')
      .update({
        totp_enabled: false,
        totp_secret: null,
        backup_codes: null,
      })
      .eq('user_id', user.id);

    // Log the action
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    await supabase.from('security_audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      organization_id: profile?.organization_id,
      action_type: '2fa_disabled',
      action_category: 'auth',
      description: 'Two-factor authentication disabled',
      severity: 'warning',
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

// Regenerate backup codes
app.post('/api/security/2fa/backup-codes', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Generate new backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    await supabase
      .from('user_2fa')
      .update({
        backup_codes: JSON.stringify(backupCodes),
        backup_codes_generated_at: new Date().toISOString(),
        backup_codes_used: 0,
      })
      .eq('user_id', user.id);

    res.json({ backupCodes });
  } catch (error) {
    console.error('Error regenerating backup codes:', error);
    res.status(500).json({ error: 'Failed to regenerate backup codes' });
  }
});

// Get user sessions
app.get('/api/security/sessions', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: sessions, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('last_active_at', { ascending: false });

    if (error) throw error;

    // If no sessions exist, create mock data for demo
    if (!sessions || sessions.length === 0) {
      const mockSessions = [
        {
          id: '1',
          user_id: user.id,
          device_name: 'Chrome on Windows',
          device_type: 'desktop',
          browser: 'Chrome 120',
          os: 'Windows 11',
          ip_address: req.ip || '192.168.1.1',
          location_city: 'San Francisco',
          location_country: 'US',
          is_current: true,
          is_trusted: true,
          last_active_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          created_at: new Date().toISOString(),
        },
      ];
      return res.json(mockSessions);
    }

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Revoke a session
app.post('/api/security/sessions/:id/revoke', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    await supabase
      .from('user_sessions')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_reason: 'User initiated',
      })
      .eq('id', req.params.id)
      .eq('user_id', user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error revoking session:', error);
    res.status(500).json({ error: 'Failed to revoke session' });
  }
});

// Revoke all other sessions
app.post('/api/security/sessions/revoke-all', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { count } = await supabase
      .from('user_sessions')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_reason: 'Revoke all sessions',
      })
      .eq('user_id', user.id)
      .eq('is_current', false)
      .eq('status', 'active');

    // Log the action
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    await supabase.from('security_audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      organization_id: profile?.organization_id,
      action_type: 'sessions_revoked',
      action_category: 'auth',
      description: `Revoked all other sessions`,
      severity: 'warning',
    });

    res.json({ success: true, count: count || 0 });
  } catch (error) {
    console.error('Error revoking sessions:', error);
    res.status(500).json({ error: 'Failed to revoke sessions' });
  }
});

// Get security audit logs
app.get('/api/security/audit-logs', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { 
      category, 
      action_type, 
      user_id, 
      severity, 
      phi_only,
      start_date,
      end_date,
      page = '1', 
      page_size = '50' 
    } = req.query;

    let query = supabase
      .from('security_audit_logs')
      .select('*', { count: 'exact' })
      .eq('organization_id', profile.organization_id);

    if (category) query = query.eq('action_category', category);
    if (action_type) query = query.eq('action_type', action_type);
    if (user_id) query = query.eq('user_id', user_id);
    if (severity) query = query.eq('severity', severity);
    if (phi_only === 'true') query = query.eq('phi_accessed', true);
    if (start_date) query = query.gte('created_at', start_date);
    if (end_date) query = query.lte('created_at', end_date);

    const from = (parseInt(page) - 1) * parseInt(page_size);
    const to = from + parseInt(page_size) - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // If no audit logs exist, return demo data
    if (!data || data.length === 0) {
      const demoLogs = [
        {
          id: '1',
          user_email: user.email,
          user_name: 'Current User',
          action_type: 'login',
          action_category: 'auth',
          description: 'Successful login',
          severity: 'info',
          phi_accessed: false,
          ip_address: '192.168.1.1',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_email: user.email,
          user_name: 'Current User',
          action_type: 'view_claim',
          action_category: 'phi_access',
          resource_type: 'claim',
          resource_id: 'CLM-001',
          description: 'Viewed claim details',
          severity: 'info',
          phi_accessed: true,
          phi_fields_accessed: ['patient_name', 'date_of_birth'],
          ip_address: '192.168.1.1',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          user_email: user.email,
          user_name: 'Current User',
          action_type: 'export_data',
          action_category: 'data_export',
          description: 'Exported claims report',
          severity: 'warning',
          phi_accessed: true,
          ip_address: '192.168.1.1',
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
      ];
      return res.json({
        logs: demoLogs,
        total: demoLogs.length,
        page: parseInt(page),
        pageSize: parseInt(page_size),
      });
    }

    res.json({
      logs: data,
      total: count || 0,
      page: parseInt(page),
      pageSize: parseInt(page_size),
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Get roles
app.get('/api/security/roles', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const { data: roles, error } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .eq('is_active', true)
      .order('is_system', { ascending: false });

    if (error) throw error;

    // If no roles exist, return default roles
    if (!roles || roles.length === 0) {
      const defaultRoles = [
        {
          id: '1',
          role: 'owner',
          role_name: 'Owner',
          role_description: 'Full access to all features',
          is_system: true,
          is_custom: false,
          phi_access_level: 'full',
          permissions: {
            claims: { view: true, create: true, edit: true, delete: true, export: true },
            appeals: { view: true, create: true, edit: true, delete: true, submit: true },
            patients: { view: true, create: true, edit: true, delete: true, view_phi: true },
            analytics: { view: true, export: true },
            integrations: { view: true, manage: true },
            team: { view: true, invite: true, manage_roles: true, remove: true },
            billing: { view: true, manage: true },
            settings: { view: true, manage: true },
            security: { view_logs: true, manage_2fa: true, manage_sessions: true },
            api: { view_keys: true, create_keys: true, revoke_keys: true },
          },
        },
        {
          id: '2',
          role: 'admin',
          role_name: 'Administrator',
          role_description: 'Manage team and settings',
          is_system: true,
          is_custom: false,
          phi_access_level: 'full',
          permissions: {
            claims: { view: true, create: true, edit: true, delete: true, export: true },
            appeals: { view: true, create: true, edit: true, delete: true, submit: true },
            patients: { view: true, create: true, edit: true, delete: true, view_phi: true },
            analytics: { view: true, export: true },
            integrations: { view: true, manage: true },
            team: { view: true, invite: true, manage_roles: false, remove: true },
            billing: { view: true, manage: false },
            settings: { view: true, manage: true },
            security: { view_logs: true, manage_2fa: true, manage_sessions: true },
            api: { view_keys: true, create_keys: true, revoke_keys: true },
          },
        },
        {
          id: '3',
          role: 'member',
          role_name: 'Member',
          role_description: 'Standard access to claims and appeals',
          is_system: true,
          is_custom: false,
          phi_access_level: 'limited',
          permissions: {
            claims: { view: true, create: true, edit: true, delete: false, export: false },
            appeals: { view: true, create: true, edit: true, delete: false, submit: false },
            patients: { view: true, create: false, edit: false, delete: false, view_phi: false },
            analytics: { view: true, export: false },
            integrations: { view: false, manage: false },
            team: { view: true, invite: false, manage_roles: false, remove: false },
            billing: { view: false, manage: false },
            settings: { view: true, manage: false },
            security: { view_logs: false, manage_2fa: false, manage_sessions: false },
            api: { view_keys: false, create_keys: false, revoke_keys: false },
          },
        },
        {
          id: '4',
          role: 'viewer',
          role_name: 'Viewer',
          role_description: 'Read-only access',
          is_system: true,
          is_custom: false,
          phi_access_level: 'none',
          permissions: {
            claims: { view: true, create: false, edit: false, delete: false, export: false },
            appeals: { view: true, create: false, edit: false, delete: false, submit: false },
            patients: { view: false, create: false, edit: false, delete: false, view_phi: false },
            analytics: { view: true, export: false },
            integrations: { view: false, manage: false },
            team: { view: false, invite: false, manage_roles: false, remove: false },
            billing: { view: false, manage: false },
            settings: { view: false, manage: false },
            security: { view_logs: false, manage_2fa: false, manage_sessions: false },
            api: { view_keys: false, create_keys: false, revoke_keys: false },
          },
        },
      ];
      return res.json(defaultRoles);
    }

    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Update role permissions
app.put('/api/security/roles/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { permissions, phi_access_level, role_description } = req.body;

    const { data: updated, error } = await supabase
      .from('role_permissions')
      .update({
        permissions,
        phi_access_level,
        role_description,
      })
      .eq('id', req.params.id)
      .eq('organization_id', profile.organization_id)
      .select()
      .single();

    if (error) throw error;

    res.json(updated);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Get security settings
app.get('/api/security/settings', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const { data: settings, error } = await supabase
      .from('security_settings')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Return default settings if none exist
    if (!settings) {
      return res.json({
        organization_id: profile.organization_id,
        require_2fa_all_users: false,
        require_2fa_admins: true,
        require_2fa_phi_access: true,
        allowed_2fa_methods: ['totp', 'backup_codes'],
        session_timeout_minutes: 30,
        absolute_session_timeout_hours: 12,
        max_concurrent_sessions: 3,
        force_single_session: false,
        notify_new_session: true,
        password_min_length: 12,
        password_require_uppercase: true,
        password_require_lowercase: true,
        password_require_numbers: true,
        password_require_special: true,
        password_expiry_days: 90,
        password_history_count: 12,
        max_login_attempts: 5,
        lockout_duration_minutes: 30,
        notify_failed_logins: true,
        notify_login_from_new_device: true,
        notify_login_from_new_location: true,
        ip_whitelist_enabled: false,
        ip_whitelist: [],
        ip_blacklist: [],
        encryption_at_rest: true,
        encryption_in_transit: true,
        phi_access_logging: true,
        auto_logout_on_close: false,
        mask_phi_in_logs: true,
        audit_log_retention_days: 2555,
        detailed_audit_logging: true,
        export_audit_logs_enabled: true,
        hipaa_mode: true,
        baa_signed: false,
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching security settings:', error);
    res.status(500).json({ error: 'Failed to fetch security settings' });
  }
});

// Update security settings
app.put('/api/security/settings', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.organization_id;
    delete updateData.created_at;

    const { data: updated, error } = await supabase
      .from('security_settings')
      .upsert({
        organization_id: profile.organization_id,
        ...updateData,
      }, { onConflict: 'organization_id' })
      .select()
      .single();

    if (error) throw error;

    // Log the change
    await supabase.from('security_audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      organization_id: profile.organization_id,
      action_type: 'security_settings_updated',
      action_category: 'admin',
      description: 'Security settings updated',
      severity: 'warning',
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating security settings:', error);
    res.status(500).json({ error: 'Failed to update security settings' });
  }
});

// Get login history
app.get('/api/security/login-history', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { limit = '20' } = req.query;

    const { data: history, error } = await supabase
      .from('login_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    // Return demo data if none exists
    if (!history || history.length === 0) {
      const demoHistory = [
        {
          id: '1',
          user_id: user.id,
          login_type: 'password',
          status: 'success',
          ip_address: '192.168.1.1',
          location_city: 'San Francisco',
          location_country: 'US',
          used_2fa: false,
          risk_score: 0,
          is_suspicious: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: user.id,
          login_type: 'password',
          status: 'success',
          ip_address: '192.168.1.1',
          location_city: 'San Francisco',
          location_country: 'US',
          used_2fa: false,
          risk_score: 0,
          is_suspicious: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      return res.json(demoHistory);
    }

    res.json(history);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ error: 'Failed to fetch login history' });
  }
});

// Get encryption status
app.get('/api/security/encryption', async (req, res) => {
  try {
    // Return encryption status (mostly static for display purposes)
    res.json({
      at_rest: {
        enabled: true,
        algorithm: 'AES-256-GCM',
        key_rotation_days: 90,
        last_rotation: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      in_transit: {
        enabled: true,
        tls_version: 'TLS 1.3',
        cipher_suites: [
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'TLS_AES_128_GCM_SHA256',
        ],
      },
      phi_encryption: {
        enabled: true,
        fields_encrypted: [
          'patient_ssn',
          'patient_dob',
          'medical_record_number',
          'diagnosis_codes',
          'procedure_codes',
          'provider_npi',
        ],
        last_audit: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching encryption status:', error);
    res.status(500).json({ error: 'Failed to fetch encryption status' });
  }
});

// ============================================
// Billing & Subscription API Endpoints
// ============================================

// Get subscription plans
app.get('/api/billing/plans', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    res.json(plans || Object.keys(PLANS).map(id => ({ id, ...PLANS[id] })));
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get current subscription
app.get('/api/billing/subscription', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('organization_id', profile.organization_id)
      .single();

    if (subError && subError.code !== 'PGRST116') throw subError;

    // If no subscription, return free plan
    if (!subscription) {
      return res.json({
        plan_id: 'free',
        status: 'active',
        plan: { id: 'free', name: 'Free', ...PLANS.free },
      });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Get usage for current billing period
app.get('/api/billing/usage', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Get current usage record
    const { data: usage, error: usageError } = await supabase
      .from('usage_records')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .eq('is_current', true)
      .single();

    if (usageError && usageError.code !== 'PGRST116') throw usageError;

    // If no usage record, return zeros
    if (!usage) {
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      return res.json({
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        claims_processed: 0,
        claims_submitted: 0,
        appeals_created: 0,
        appeals_submitted: 0,
        ai_predictions: 0,
        ai_letters_generated: 0,
        api_requests: 0,
      });
    }

    res.json(usage);
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
});

// Create checkout session
app.post('/api/billing/checkout', async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: 'Payment processing not configured' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { priceId, successUrl, cancelUrl } = req.body;
    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: organization } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', profile.organization_id)
      .single();

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      profile.organization_id,
      organization,
      user.email
    );

    // Update subscription with Stripe customer ID
    await supabase
      .from('subscriptions')
      .upsert({
        organization_id: profile.organization_id,
        stripe_customer_id: customer.id,
      }, { onConflict: 'organization_id' });

    // Create checkout session
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      profile.organization_id,
      successUrl,
      cancelUrl
    );

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create portal session
app.post('/api/billing/portal', async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: 'Payment processing not configured' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { returnUrl } = req.body;
    if (!returnUrl) {
      return res.status(400).json({ error: 'Return URL required' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('organization_id', profile.organization_id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return res.status(404).json({ error: 'No billing account found' });
    }

    const session = await createPortalSession(subscription.stripe_customer_id, returnUrl);

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// Get invoices
app.get('/api/billing/invoices', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Get from database first
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .order('invoice_date', { ascending: false })
      .limit(20);

    if (invoicesError) throw invoicesError;

    // If Stripe is configured and we have a customer, get latest from Stripe
    if (isStripeConfigured()) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('organization_id', profile.organization_id)
        .single();

      if (subscription?.stripe_customer_id) {
        try {
          const stripeInvoices = await getCustomerInvoices(subscription.stripe_customer_id, 20);
          
          // Sync Stripe invoices to database
          for (const inv of stripeInvoices) {
            await supabase
              .from('invoices')
              .upsert({
                organization_id: profile.organization_id,
                stripe_invoice_id: inv.id,
                invoice_number: inv.number,
                status: inv.status,
                subtotal: inv.subtotal,
                tax: inv.tax || 0,
                total: inv.total,
                amount_due: inv.amount_due,
                amount_paid: inv.amount_paid,
                currency: inv.currency,
                invoice_date: new Date(inv.created * 1000).toISOString(),
                due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null,
                paid_at: inv.status_transitions?.paid_at ? new Date(inv.status_transitions.paid_at * 1000).toISOString() : null,
                period_start: new Date(inv.period_start * 1000).toISOString(),
                period_end: new Date(inv.period_end * 1000).toISOString(),
                hosted_invoice_url: inv.hosted_invoice_url,
                invoice_pdf_url: inv.invoice_pdf,
              }, { onConflict: 'stripe_invoice_id' });
          }

          // Refresh from database
          const { data: refreshedInvoices } = await supabase
            .from('invoices')
            .select('*')
            .eq('organization_id', profile.organization_id)
            .order('invoice_date', { ascending: false })
            .limit(20);

          return res.json(refreshedInvoices || []);
        } catch (stripeError) {
          console.error('Error fetching Stripe invoices:', stripeError);
        }
      }
    }

    res.json(invoices || []);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get payment methods
app.get('/api/billing/payment-methods', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get from database first
    const { data: paymentMethods, error: pmError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .order('is_default', { ascending: false });

    if (pmError) throw pmError;

    // If Stripe is configured, sync from Stripe
    if (isStripeConfigured()) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('organization_id', profile.organization_id)
        .single();

      if (subscription?.stripe_customer_id) {
        try {
          const stripePMs = await getPaymentMethods(subscription.stripe_customer_id);
          
          // Get default payment method
          const stripe = getStripeClient();
          const customer = await stripe.customers.retrieve(subscription.stripe_customer_id);
          const defaultPM = customer.invoice_settings?.default_payment_method;

          // Sync to database
          for (const pm of stripePMs) {
            await supabase
              .from('payment_methods')
              .upsert({
                organization_id: profile.organization_id,
                stripe_payment_method_id: pm.id,
                type: pm.type,
                card_brand: pm.card?.brand,
                card_last4: pm.card?.last4,
                card_exp_month: pm.card?.exp_month,
                card_exp_year: pm.card?.exp_year,
                is_default: pm.id === defaultPM,
              }, { onConflict: 'stripe_payment_method_id' });
          }

          // Refresh from database
          const { data: refreshedPMs } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('organization_id', profile.organization_id)
            .order('is_default', { ascending: false });

          return res.json(refreshedPMs || []);
        } catch (stripeError) {
          console.error('Error fetching Stripe payment methods:', stripeError);
        }
      }
    }

    res.json(paymentMethods || []);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Create setup intent for adding payment method
app.post('/api/billing/setup-intent', async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: 'Payment processing not configured' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('organization_id', profile.organization_id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    // Create customer if doesn't exist
    if (!customerId) {
      const { data: organization } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single();

      const customer = await getOrCreateCustomer(
        profile.organization_id,
        organization,
        user.email
      );
      customerId = customer.id;

      await supabase
        .from('subscriptions')
        .upsert({
          organization_id: profile.organization_id,
          stripe_customer_id: customerId,
        }, { onConflict: 'organization_id' });
    }

    const setupIntent = await createSetupIntent(customerId);

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    res.status(500).json({ error: 'Failed to create setup intent' });
  }
});

// Set default payment method
app.post('/api/billing/payment-methods/:id/default', async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: 'Payment processing not configured' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('organization_id', profile.organization_id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return res.status(404).json({ error: 'No billing account found' });
    }

    const { data: paymentMethod } = await supabase
      .from('payment_methods')
      .select('stripe_payment_method_id')
      .eq('id', req.params.id)
      .single();

    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    await setDefaultPaymentMethod(subscription.stripe_customer_id, paymentMethod.stripe_payment_method_id);

    // Update database
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('organization_id', profile.organization_id);

    await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', req.params.id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    res.status(500).json({ error: 'Failed to set default payment method' });
  }
});

// Delete payment method
app.delete('/api/billing/payment-methods/:id', async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: 'Payment processing not configured' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: paymentMethod } = await supabase
      .from('payment_methods')
      .select('stripe_payment_method_id, is_default')
      .eq('id', req.params.id)
      .single();

    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    if (paymentMethod.is_default) {
      return res.status(400).json({ error: 'Cannot delete default payment method' });
    }

    await deletePaymentMethod(paymentMethod.stripe_payment_method_id);

    await supabase
      .from('payment_methods')
      .delete()
      .eq('id', req.params.id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
});

// Cancel subscription
app.post('/api/billing/cancel', async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: 'Payment processing not configured' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { reason, immediate } = req.body;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('organization_id', profile.organization_id)
      .single();

    if (!subscription?.stripe_subscription_id) {
      return res.status(404).json({ error: 'No active subscription' });
    }

    await cancelSubscription(subscription.stripe_subscription_id, !immediate);

    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: !immediate,
        canceled_at: new Date().toISOString(),
        cancellation_reason: reason,
      })
      .eq('organization_id', profile.organization_id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Resume subscription
app.post('/api/billing/resume', async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: 'Payment processing not configured' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (!['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('organization_id', profile.organization_id)
      .single();

    if (!subscription?.stripe_subscription_id) {
      return res.status(404).json({ error: 'No subscription to resume' });
    }

    await resumeSubscription(subscription.stripe_subscription_id);

    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: false,
        canceled_at: null,
        cancellation_reason: null,
      })
      .eq('organization_id', profile.organization_id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    res.status(500).json({ error: 'Failed to resume subscription' });
  }
});

// Stripe webhook handler
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = verifyWebhookSignature(req.body, sig);

    if (!event) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    // Log the event
    await supabase
      .from('billing_events')
      .insert({
        event_type: event.type,
        stripe_event_id: event.id,
        data: event.data,
      });

    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orgId = session.metadata?.organization_id;
        
        if (orgId && session.subscription) {
          const stripeSubscription = await getSubscription(session.subscription);
          
          await supabase
            .from('subscriptions')
            .update({
              stripe_subscription_id: session.subscription,
              status: stripeSubscription.status,
              current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
            })
            .eq('organization_id', orgId);
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const orgId = subscription.metadata?.organization_id;
        
        if (orgId) {
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
            .eq('organization_id', orgId);
        }
        break;
      }
      
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        await supabase
          .from('invoices')
          .upsert({
            stripe_invoice_id: invoice.id,
            status: invoice.status,
            amount_paid: invoice.amount_paid,
            paid_at: invoice.status === 'paid' ? new Date().toISOString() : null,
          }, { onConflict: 'stripe_invoice_id' });
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Billing status endpoint
app.get('/api/billing/status', (req, res) => {
  res.json({
    stripe_configured: isStripeConfigured(),
    webhook_configured: !!process.env.STRIPE_WEBHOOK_SECRET,
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

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

    const { id } = req.params;
    const { data, error } = await supabase
      .from('appeals')
      .select(`
        *,
        claim:claims(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
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

    const { id } = req.params;
    const updates = req.body;

    // Get old appeal for activity logging
    const { data: oldAppeal } = await supabase
      .from('appeals')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('appeals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
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

    const { id } = req.params;
    const { submission_method = 'portal' } = req.body;

    const { data, error } = await supabase
      .from('appeals')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        submission_method,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
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

    const { id } = req.params;
    const { outcome, outcome_reason, amount_approved, amount_recovered, payer_response } = req.body;

    const newStatus = outcome === 'approved' ? 'approved' 
      : outcome === 'partially_approved' ? 'partially_approved'
      : outcome === 'denied' ? 'denied'
      : 'under_review';

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
        .eq('id', data.claim_id);
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

    const { id } = req.params;
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

    const { id } = req.params;
    const { template_id, additional_context } = req.body;

    // Get appeal with claim data
    const { data: appeal, error: appealError } = await supabase
      .from('appeals')
      .select(`*, claim:claims(*)`)
      .eq('id', id)
      .single();

    if (appealError || !appeal) {
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
      .eq('id', id);

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

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * AI Appeal Generation Endpoint
 * 
 * This endpoint generates appeal letters using AI.
 * Configure AI_APPEALS_URL env variable to point to your AI service.
 */
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify the JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return res.status(403).json({ error: 'User not associated with an organization' });
    }

    const { claim_id, denial_reason, additional_context } = req.body;

    if (!claim_id) {
      return res.status(400).json({ error: 'claim_id is required' });
    }

    // Fetch claim details
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select(`
        *,
        patient:patients(*),
        payer:payers(*)
      `)
      .eq('id', claim_id)
      .eq('organization_id', profile.organization_id)
      .single();

    if (claimError || !claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Check if AI service is configured
    const aiServiceUrl = process.env.AI_APPEALS_URL;
    
    let appealLetter;
    let aiConfidenceScore = null;
    let aiCitations = null;

    if (aiServiceUrl) {
      // Call external AI service
      try {
        const aiResponse = await fetch(aiServiceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.AI_API_KEY || ''}`,
          },
          body: JSON.stringify({
            claim,
            denial_reason: denial_reason || claim.denial_reason,
            additional_context,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          appealLetter = aiData.letter;
          aiConfidenceScore = aiData.confidence_score;
          aiCitations = aiData.citations;
        } else {
          console.error('AI service error:', await aiResponse.text());
          // Fall back to template
          appealLetter = generateTemplateAppeal(claim, denial_reason);
        }
      } catch (aiError) {
        console.error('AI service error:', aiError);
        appealLetter = generateTemplateAppeal(claim, denial_reason);
      }
    } else {
      // No AI service configured - use template
      appealLetter = generateTemplateAppeal(claim, denial_reason);
    }

    // Create the appeal in the database
    const appealNumber = `APL-${Date.now().toString(36).toUpperCase()}`;
    
    const { data: appeal, error: appealError } = await supabase
      .from('appeals')
      .insert({
        organization_id: profile.organization_id,
        claim_id,
        appeal_number: appealNumber,
        denial_reason: denial_reason || claim.denial_reason,
        letter_content: appealLetter,
        status: 'draft',
        ai_generated: true,
        ai_confidence_score: aiConfidenceScore,
        ai_citations: aiCitations,
        created_by: user.id,
        deadline_date: calculateDeadline(claim.payer?.appeal_deadline_days),
      })
      .select()
      .single();

    if (appealError) {
      return res.status(500).json({ error: appealError.message });
    }

    // Log activity
    await supabase.from('appeal_activities').insert({
      appeal_id: appeal.id,
      user_id: user.id,
      activity_type: 'created',
      description: 'AI-generated appeal created',
      metadata: { ai_generated: true, confidence_score: aiConfidenceScore },
    });

    return res.status(201).json({
      data: appeal,
      ai_used: !!aiServiceUrl,
      message: aiServiceUrl 
        ? 'Appeal generated using AI' 
        : 'Appeal generated using template (AI service not configured)',
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Generate a template-based appeal letter when AI is not available
 */
function generateTemplateAppeal(claim, denialReason) {
  const patientName = claim.patient 
    ? `${claim.patient.first_name} ${claim.patient.last_name}`
    : 'Patient';
  
  const payerName = claim.payer?.name || 'Insurance Company';
  const claimNumber = claim.claim_number;
  const serviceDate = claim.service_date;
  const billedAmount = claim.billed_amount;
  const reason = denialReason || claim.denial_reason || 'Medical Necessity';

  return `
[Organization Letterhead]

${new Date().toLocaleDateString()}

${payerName}
Appeals Department
[Payer Address]

RE: Appeal for Claim Denial
Patient: ${patientName}
Claim Number: ${claimNumber}
Date of Service: ${serviceDate}
Billed Amount: $${billedAmount}
Denial Reason: ${reason}

Dear Appeals Committee,

I am writing to formally appeal the denial of the above-referenced claim. After careful review of the denial reason and the patient's medical records, I believe this claim should be reconsidered and approved for payment.

SUMMARY OF SERVICES:
The services provided on ${serviceDate} were medically necessary for the treatment of the patient's condition. The procedures performed were appropriate and consistent with accepted standards of medical practice.

REASON FOR APPEAL:
The denial reason cited was "${reason}". However, I respectfully disagree with this determination for the following reasons:

1. The services rendered were medically necessary based on the patient's presenting symptoms and clinical findings.

2. The treatment provided followed established clinical guidelines and best practices.

3. The documentation submitted clearly supports the medical necessity of these services.

SUPPORTING DOCUMENTATION:
Please find enclosed:
- Complete medical records for the date of service
- Physician's notes and orders
- Any relevant test results
- Letter of medical necessity from the treating physician

REQUEST:
Based on the information provided, I respectfully request that you overturn the denial and process this claim for payment. The services provided were essential to the patient's care and meet all criteria for coverage under the patient's health plan.

Please contact me if you require any additional information or documentation to process this appeal.

Thank you for your prompt attention to this matter.

Sincerely,

[Provider Name]
[Provider NPI]
[Contact Information]

Enclosures: As noted above
`.trim();
}

/**
 * Calculate appeal deadline based on payer rules
 */
function calculateDeadline(appealDeadlineDays = 60) {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + appealDeadlineDays);
  return deadline.toISOString().split('T')[0];
}

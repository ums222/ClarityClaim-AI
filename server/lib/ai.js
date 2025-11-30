/**
 * AI Service - Google AI (Gemini) Integration for ClarityClaim AI
 * 
 * Features:
 * - Denial risk prediction
 * - Appeal letter generation
 * - Pattern analysis
 * - Risk factor identification
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI client
const genAI = process.env.GOOGLE_AI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null;

// Get the Gemini model
const getModel = () => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

/**
 * Check if AI is configured
 */
export function isAIConfigured() {
  return genAI !== null;
}

/**
 * Denial Risk Factors Database
 * These are common denial reasons in healthcare claims
 */
const DENIAL_RISK_FACTORS = {
  // Authorization Issues
  missing_prior_auth: {
    category: 'Authorization',
    factor: 'Missing prior authorization',
    impact: 'high',
    weight: 25,
    recommendation: 'Obtain prior authorization before submitting claim',
  },
  expired_auth: {
    category: 'Authorization',
    factor: 'Authorization expired',
    impact: 'high',
    weight: 20,
    recommendation: 'Verify authorization validity dates before service',
  },
  
  // Coding Issues
  missing_diagnosis: {
    category: 'Coding',
    factor: 'Missing or invalid diagnosis codes',
    impact: 'high',
    weight: 25,
    recommendation: 'Ensure all diagnosis codes are present and valid ICD-10 format',
  },
  missing_procedure: {
    category: 'Coding',
    factor: 'Missing procedure codes',
    impact: 'high',
    weight: 20,
    recommendation: 'Include all applicable CPT/HCPCS codes',
  },
  code_mismatch: {
    category: 'Coding',
    factor: 'Diagnosis-procedure code mismatch',
    impact: 'medium',
    weight: 15,
    recommendation: 'Verify diagnosis codes support medical necessity for procedures',
  },
  
  // Documentation Issues
  insufficient_documentation: {
    category: 'Documentation',
    factor: 'Insufficient clinical documentation',
    impact: 'high',
    weight: 20,
    recommendation: 'Attach complete medical records supporting the claim',
  },
  missing_provider_info: {
    category: 'Documentation',
    factor: 'Missing provider information',
    impact: 'medium',
    weight: 10,
    recommendation: 'Include complete provider NPI and credentials',
  },
  
  // Eligibility Issues
  coverage_terminated: {
    category: 'Eligibility',
    factor: 'Patient coverage may have terminated',
    impact: 'high',
    weight: 30,
    recommendation: 'Verify patient eligibility before service date',
  },
  out_of_network: {
    category: 'Eligibility',
    factor: 'Out-of-network provider',
    impact: 'medium',
    weight: 15,
    recommendation: 'Confirm network status or obtain out-of-network authorization',
  },
  
  // Billing Issues
  duplicate_claim: {
    category: 'Billing',
    factor: 'Potential duplicate claim',
    impact: 'high',
    weight: 25,
    recommendation: 'Check for previously submitted claims for same service',
  },
  timely_filing: {
    category: 'Billing',
    factor: 'Approaching timely filing deadline',
    impact: 'high',
    weight: 30,
    recommendation: 'Submit claim immediately to meet filing deadline',
  },
  high_amount: {
    category: 'Billing',
    factor: 'High billed amount may trigger review',
    impact: 'medium',
    weight: 15,
    recommendation: 'Ensure itemized charges are documented and justified',
  },
  
  // Payer-Specific
  medicare_strict: {
    category: 'Payer',
    factor: 'Medicare has stricter documentation requirements',
    impact: 'medium',
    weight: 10,
    recommendation: 'Follow Medicare LCD/NCD guidelines for this service',
  },
  medicaid_strict: {
    category: 'Payer',
    factor: 'Medicaid requires additional state-specific documentation',
    impact: 'medium',
    weight: 10,
    recommendation: 'Include state-specific Medicaid forms and documentation',
  },
};

/**
 * Analyze claim and predict denial risk
 * Uses rule-based analysis + optional AI enhancement
 */
export async function predictDenialRisk(claim) {
  const riskFactors = [];
  let baseScore = 0;
  
  // Rule-based analysis
  // Check for missing diagnosis codes
  if (!claim.diagnosis_codes || claim.diagnosis_codes.length === 0) {
    riskFactors.push({
      ...DENIAL_RISK_FACTORS.missing_diagnosis,
      description: 'No ICD-10 diagnosis codes provided',
    });
    baseScore += DENIAL_RISK_FACTORS.missing_diagnosis.weight;
  }
  
  // Check for missing procedure codes
  if (!claim.procedure_codes || claim.procedure_codes.length === 0) {
    riskFactors.push({
      ...DENIAL_RISK_FACTORS.missing_procedure,
      description: 'No CPT procedure codes provided',
    });
    baseScore += DENIAL_RISK_FACTORS.missing_procedure.weight;
  }
  
  // Check for missing provider NPI
  if (!claim.provider_npi) {
    riskFactors.push({
      ...DENIAL_RISK_FACTORS.missing_provider_info,
      description: 'Provider NPI not specified',
    });
    baseScore += DENIAL_RISK_FACTORS.missing_provider_info.weight;
  }
  
  // Check for high billed amount
  if (claim.billed_amount > 10000) {
    riskFactors.push({
      ...DENIAL_RISK_FACTORS.high_amount,
      description: `High billed amount of $${claim.billed_amount.toLocaleString()} may trigger additional review`,
    });
    baseScore += DENIAL_RISK_FACTORS.high_amount.weight;
  }
  
  // Check for Medicare/Medicaid
  if (claim.plan_type === 'Medicare') {
    riskFactors.push({
      ...DENIAL_RISK_FACTORS.medicare_strict,
      description: 'Medicare claims require strict adherence to coverage guidelines',
    });
    baseScore += DENIAL_RISK_FACTORS.medicare_strict.weight;
  } else if (claim.plan_type === 'Medicaid') {
    riskFactors.push({
      ...DENIAL_RISK_FACTORS.medicaid_strict,
      description: 'Medicaid claims require state-specific documentation',
    });
    baseScore += DENIAL_RISK_FACTORS.medicaid_strict.weight;
  }
  
  // Check for missing service date
  if (!claim.service_date) {
    riskFactors.push({
      category: 'Documentation',
      factor: 'Missing service date',
      impact: 'high',
      weight: 15,
      recommendation: 'Include date of service',
      description: 'Service date is required for claim processing',
    });
    baseScore += 15;
  }
  
  // Check for timely filing (if service date is more than 90 days ago)
  if (claim.service_date) {
    const serviceDate = new Date(claim.service_date);
    const daysSinceService = Math.floor((Date.now() - serviceDate) / (1000 * 60 * 60 * 24));
    if (daysSinceService > 90) {
      riskFactors.push({
        ...DENIAL_RISK_FACTORS.timely_filing,
        description: `${daysSinceService} days since service date - check payer timely filing limits`,
      });
      baseScore += DENIAL_RISK_FACTORS.timely_filing.weight;
    }
  }
  
  // Cap base score at 100
  baseScore = Math.min(baseScore, 100);
  
  // AI Enhancement (if configured)
  let aiInsights = null;
  if (genAI) {
    try {
      aiInsights = await getAIRiskInsights(claim, riskFactors);
      // Blend AI score with rule-based score
      if (aiInsights && aiInsights.adjustedScore !== undefined) {
        baseScore = Math.round((baseScore * 0.6) + (aiInsights.adjustedScore * 0.4));
      }
    } catch (error) {
      console.error('AI enhancement failed:', error);
    }
  }
  
  // Determine risk level
  let riskLevel = 'low';
  if (baseScore >= 60) riskLevel = 'high';
  else if (baseScore >= 30) riskLevel = 'medium';
  
  // Generate recommendations
  const recommendations = generateRecommendations(riskFactors, claim);
  
  return {
    score: baseScore,
    level: riskLevel,
    factors: riskFactors,
    recommendations,
    aiInsights,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Get AI-powered risk insights using Google Gemini
 */
async function getAIRiskInsights(claim, existingFactors) {
  const model = getModel();
  if (!model) return null;
  
  const prompt = `You are an expert healthcare claims analyst. Analyze this claim for denial risk and respond ONLY with valid JSON.

Claim Details:
- Patient: ${claim.patient_name}
- Payer: ${claim.payer_name} (${claim.plan_type || 'Unknown'})
- Billed Amount: $${claim.billed_amount}
- Service Date: ${claim.service_date || 'Not specified'}
- Procedure Codes: ${claim.procedure_codes?.join(', ') || 'None'}
- Diagnosis Codes: ${claim.diagnosis_codes?.join(', ') || 'None'}
- Provider NPI: ${claim.provider_npi || 'Not specified'}

Already identified risk factors:
${existingFactors.map(f => `- ${f.factor}: ${f.description}`).join('\n')}

Respond with this exact JSON structure (no markdown, no code blocks):
{"additionalFactors": [{"factor": "factor name", "impact": "low", "description": "description"}], "adjustedScore": 50, "insights": "brief insight", "specificRecommendations": ["recommendation 1"]}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response - remove any markdown code blocks
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Google AI API error:', error);
    return null;
  }
}

/**
 * Generate appeal letter for denied claim
 */
export async function generateAppealLetter(claim, denialInfo = {}) {
  const {
    denial_reason = 'The claim was denied',
    denial_code = '',
    additional_context = '',
  } = denialInfo;
  
  // If AI is not configured, use template-based generation
  const model = getModel();
  if (!model) {
    return generateTemplateAppeal(claim, denialInfo);
  }
  
  const prompt = `You are an expert healthcare appeals specialist. Generate a professional appeal letter for this denied claim.

CLAIM INFORMATION:
- Claim Number: ${claim.claim_number}
- Patient Name: ${claim.patient_name}
- Patient ID: ${claim.patient_id || 'N/A'}
- Service Date: ${claim.service_date || 'N/A'}
- Provider: ${claim.provider_name || 'N/A'}
- Provider NPI: ${claim.provider_npi || 'N/A'}
- Facility: ${claim.facility_name || 'N/A'}
- Payer: ${claim.payer_name}
- Billed Amount: $${claim.billed_amount}
- Procedure Codes: ${claim.procedure_codes?.join(', ') || 'N/A'}
- Diagnosis Codes: ${claim.diagnosis_codes?.join(', ') || 'N/A'}

DENIAL INFORMATION:
- Denial Reason: ${denial_reason}
- Denial Code: ${denial_code}
- Additional Context: ${additional_context}

Generate a professional, persuasive appeal letter that:
1. References the specific claim and denial
2. Argues for medical necessity
3. Cites relevant clinical guidelines if applicable
4. Requests reconsideration with specific supporting points
5. Maintains a professional but firm tone

Format the letter with proper business letter formatting. Do not include any markdown formatting, just plain text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const letter = response.text();
    
    return {
      letter: letter.trim(),
      generatedAt: new Date().toISOString(),
      model: 'gemini-1.5-flash',
      type: 'ai-generated',
    };
  } catch (error) {
    console.error('Google AI API error:', error);
    // Fallback to template
    return generateTemplateAppeal(claim, denialInfo);
  }
}

/**
 * Generate template-based appeal letter (fallback)
 */
function generateTemplateAppeal(claim, denialInfo) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const letter = `${today}

${claim.payer_name}
Appeals Department
[Payer Address]

RE: Appeal for Denied Claim
Claim Number: ${claim.claim_number}
Patient Name: ${claim.patient_name}
Patient ID: ${claim.patient_id || '[Patient ID]'}
Date of Service: ${claim.service_date || '[Service Date]'}
Billed Amount: $${claim.billed_amount?.toLocaleString() || '0'}

Dear Appeals Committee,

I am writing to formally appeal the denial of the above-referenced claim. After careful review of the denial reason and the patient's medical records, I believe this claim should be reconsidered and approved for payment.

DENIAL REASON CITED:
${denialInfo.denial_reason || 'The claim was denied without specific reason provided.'}
${denialInfo.denial_code ? `Denial Code: ${denialInfo.denial_code}` : ''}

GROUNDS FOR APPEAL:

1. MEDICAL NECESSITY
The services provided were medically necessary for the treatment of the patient's condition. The procedure codes (${claim.procedure_codes?.join(', ') || 'as documented'}) directly address the diagnosed conditions (${claim.diagnosis_codes?.join(', ') || 'as documented'}).

2. CLINICAL DOCUMENTATION
Complete clinical documentation supporting the medical necessity of these services is attached to this appeal. This includes:
- Progress notes from the date of service
- Relevant diagnostic test results
- Treatment plan documentation

3. COVERAGE UNDER PLAN BENEFITS
The services rendered are covered benefits under the patient's plan and meet all coverage criteria as outlined in the plan's Summary of Benefits.

REQUEST FOR RECONSIDERATION:
Based on the above information and the attached supporting documentation, I respectfully request that you overturn the denial and process this claim for payment. The services provided were appropriate, medically necessary, and consistent with accepted standards of care.

If additional information is needed to process this appeal, please contact our office at your earliest convenience.

Thank you for your prompt attention to this matter.

Sincerely,

${claim.provider_name || '[Provider Name]'}
${claim.provider_npi ? `NPI: ${claim.provider_npi}` : ''}
${claim.facility_name || '[Facility Name]'}

Enclosures:
- Copy of original claim
- Medical records
- Supporting clinical documentation`;

  return {
    letter,
    generatedAt: new Date().toISOString(),
    type: 'template',
  };
}

/**
 * Generate recommendations based on risk factors
 */
function generateRecommendations(riskFactors, claim) {
  const recommendations = [];
  
  // Add recommendations from risk factors
  riskFactors.forEach(factor => {
    if (factor.recommendation) {
      recommendations.push({
        type: factor.category,
        recommendation: factor.recommendation,
        priority: factor.impact,
        confidence: 0.85,
      });
    }
  });
  
  // Add general recommendations based on claim state
  if (claim.status === 'draft') {
    recommendations.push({
      type: 'Workflow',
      recommendation: 'Complete all required fields before submitting',
      priority: 'medium',
      confidence: 0.9,
    });
  }
  
  if (!claim.notes) {
    recommendations.push({
      type: 'Documentation',
      recommendation: 'Add clinical notes to support medical necessity',
      priority: 'low',
      confidence: 0.7,
    });
  }
  
  return recommendations;
}

/**
 * Analyze patterns across multiple claims
 */
export async function analyzePatterns(claims) {
  if (!claims || claims.length === 0) {
    return {
      patterns: [],
      summary: 'No claims to analyze',
    };
  }
  
  // Calculate statistics
  const stats = {
    total: claims.length,
    byStatus: {},
    byPayer: {},
    byDenialCategory: {},
    avgBilledAmount: 0,
    avgRiskScore: 0,
    totalBilled: 0,
    totalPaid: 0,
    denialRate: 0,
  };
  
  let riskScoreSum = 0;
  let riskScoreCount = 0;
  let deniedCount = 0;
  
  claims.forEach(claim => {
    // By status
    stats.byStatus[claim.status] = (stats.byStatus[claim.status] || 0) + 1;
    
    // By payer
    stats.byPayer[claim.payer_name] = stats.byPayer[claim.payer_name] || { count: 0, denied: 0, total_billed: 0 };
    stats.byPayer[claim.payer_name].count++;
    stats.byPayer[claim.payer_name].total_billed += claim.billed_amount || 0;
    
    // By denial category
    if (claim.denial_category) {
      stats.byDenialCategory[claim.denial_category] = (stats.byDenialCategory[claim.denial_category] || 0) + 1;
    }
    
    // Amounts
    stats.totalBilled += claim.billed_amount || 0;
    stats.totalPaid += claim.paid_amount || 0;
    
    // Risk score
    if (claim.denial_risk_score != null) {
      riskScoreSum += claim.denial_risk_score;
      riskScoreCount++;
    }
    
    // Denial tracking
    if (['denied', 'partially_denied', 'appeal_lost'].includes(claim.status)) {
      deniedCount++;
      if (claim.payer_name) {
        stats.byPayer[claim.payer_name].denied++;
      }
    }
  });
  
  stats.avgBilledAmount = stats.total > 0 ? stats.totalBilled / stats.total : 0;
  stats.avgRiskScore = riskScoreCount > 0 ? riskScoreSum / riskScoreCount : 0;
  stats.denialRate = stats.total > 0 ? (deniedCount / stats.total) * 100 : 0;
  
  // Identify patterns
  const patterns = [];
  
  // High denial rate payers
  Object.entries(stats.byPayer).forEach(([payer, data]) => {
    if (data.count >= 3) {
      const payerDenialRate = (data.denied / data.count) * 100;
      if (payerDenialRate > 20) {
        patterns.push({
          type: 'payer_denial_rate',
          severity: payerDenialRate > 40 ? 'high' : 'medium',
          title: `High denial rate with ${payer}`,
          description: `${payerDenialRate.toFixed(1)}% of claims with ${payer} are denied`,
          recommendation: `Review ${payer} submission requirements and consider additional documentation`,
          data: { payer, denialRate: payerDenialRate, totalClaims: data.count },
        });
      }
    }
  });
  
  // Common denial categories
  Object.entries(stats.byDenialCategory).forEach(([category, count]) => {
    if (count >= 2) {
      const percentage = (count / deniedCount) * 100;
      patterns.push({
        type: 'denial_category',
        severity: percentage > 30 ? 'high' : 'medium',
        title: `Frequent ${category} denials`,
        description: `${percentage.toFixed(1)}% of denials are due to ${category}`,
        recommendation: `Implement ${category.toLowerCase()} checklist before submission`,
        data: { category, count, percentage },
      });
    }
  });
  
  // High overall denial rate
  if (stats.denialRate > 15) {
    patterns.push({
      type: 'overall_denial_rate',
      severity: stats.denialRate > 25 ? 'high' : 'medium',
      title: 'Elevated overall denial rate',
      description: `Current denial rate of ${stats.denialRate.toFixed(1)}% exceeds industry benchmark of 10-15%`,
      recommendation: 'Review claim submission process and implement pre-submission validation',
      data: { denialRate: stats.denialRate, benchmark: 15 },
    });
  }
  
  // Revenue leakage
  const revenueLeakage = stats.totalBilled - stats.totalPaid;
  if (revenueLeakage > 0 && stats.totalBilled > 0) {
    const leakagePercent = (revenueLeakage / stats.totalBilled) * 100;
    if (leakagePercent > 20) {
      patterns.push({
        type: 'revenue_leakage',
        severity: leakagePercent > 40 ? 'high' : 'medium',
        title: 'Significant revenue leakage detected',
        description: `$${revenueLeakage.toLocaleString()} (${leakagePercent.toFixed(1)}%) of billed amount not collected`,
        recommendation: 'Prioritize follow-up on unpaid and underpaid claims',
        data: { totalBilled: stats.totalBilled, totalPaid: stats.totalPaid, leakage: revenueLeakage },
      });
    }
  }
  
  return {
    patterns,
    stats,
    analyzedAt: new Date().toISOString(),
    claimsAnalyzed: claims.length,
  };
}

/**
 * Get risk factors for analytics
 */
export function getRiskFactorDefinitions() {
  return Object.entries(DENIAL_RISK_FACTORS).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}

export default {
  isAIConfigured,
  predictDenialRisk,
  generateAppealLetter,
  analyzePatterns,
  getRiskFactorDefinitions,
};

/**
 * ClarityClaim AI - Demo Data Seed Script
 * 
 * This script generates comprehensive synthetic demo data for showcasing
 * all product capabilities to investors and potential customers.
 * 
 * Data Sources Inspiration (structures and distributions only - no real data copied):
 * - Synthea synthetic patient generator: https://github.com/synthetichealth/synthea
 * - CMS Medicare Claims Synthetic PUFs: https://www.cms.gov/data-research/statistics-trends-and-reports/medicare-claims-synthetic-public-use-files
 * - AHRQ SyH-DR: https://www.ahrq.gov/data/innovations/syh-dr.html
 * - Kaggle synthetic medical claims: https://www.kaggle.com/datasets/drscarlat/medicalclaimssynthetic1m
 * - X12 Claim Adjustment Reason Codes: https://x12.org/codes/claim-adjustment-reason-codes
 * - Common denial reasons: https://www.statmedical.net/understanding-the-top-10-claim-denials-in-2025-and-how-to-prevent-them
 * 
 * Run: npx tsx scripts/seed-demo-data.ts
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// =============================================================================
// CONSTANTS & REFERENCE DATA
// =============================================================================

// Denial reason codes based on X12 CARC codes
const DENIAL_REASONS = [
  { code: 'CO-4', category: 'coding', detail: 'Procedure code inconsistent with modifier' },
  { code: 'CO-11', category: 'medical_necessity', detail: 'Diagnosis inconsistent with procedure' },
  { code: 'CO-15', category: 'authorization', detail: 'Payment adjusted - prior authorization required' },
  { code: 'CO-16', category: 'information', detail: 'Claim lacks information needed for adjudication' },
  { code: 'CO-18', category: 'duplicate', detail: 'Exact duplicate claim' },
  { code: 'CO-22', category: 'coordination', detail: 'Care may be covered by another payer' },
  { code: 'CO-27', category: 'coverage', detail: 'Expenses incurred after coverage terminated' },
  { code: 'CO-29', category: 'timely_filing', detail: 'Timely filing limit exceeded' },
  { code: 'CO-45', category: 'contractual', detail: 'Charges exceed contracted/legislated fee' },
  { code: 'CO-50', category: 'medical_necessity', detail: 'Non-covered service - not medically necessary' },
  { code: 'CO-96', category: 'out_of_network', detail: 'Non-covered charge - out of network' },
  { code: 'CO-97', category: 'bundling', detail: 'Payment included in allowance for another service' },
  { code: 'PR-1', category: 'patient_responsibility', detail: 'Deductible amount' },
  { code: 'PR-2', category: 'patient_responsibility', detail: 'Coinsurance amount' },
  { code: 'PR-3', category: 'patient_responsibility', detail: 'Co-payment amount' },
];

// Denial categories with base rates
const DENIAL_CATEGORIES = [
  { name: 'authorization', baseRate: 0.25, appealSuccessRate: 0.55 },
  { name: 'medical_necessity', baseRate: 0.20, appealSuccessRate: 0.45 },
  { name: 'coding', baseRate: 0.18, appealSuccessRate: 0.60 },
  { name: 'timely_filing', baseRate: 0.08, appealSuccessRate: 0.15 },
  { name: 'duplicate', baseRate: 0.07, appealSuccessRate: 0.70 },
  { name: 'coverage', baseRate: 0.10, appealSuccessRate: 0.35 },
  { name: 'out_of_network', baseRate: 0.06, appealSuccessRate: 0.25 },
  { name: 'information', baseRate: 0.06, appealSuccessRate: 0.75 },
];

// ICD-10 codes (synthetic/realistic)
const ICD10_CODES = [
  'E11.9', 'I10', 'J06.9', 'Z23', 'M54.5', 'K21.0', 'F32.9', 'J44.1',
  'C34.90', 'N18.3', 'I25.10', 'G43.909', 'J18.9', 'K80.20', 'M17.11',
  'I48.91', 'E78.5', 'Z96.641', 'R10.9', 'D64.9', 'G47.33', 'L40.0',
];

// CPT codes with typical billing amounts
const CPT_CODES = [
  { code: '99213', desc: 'Office visit, established', baseAmount: 150 },
  { code: '99214', desc: 'Office visit, established, moderate', baseAmount: 200 },
  { code: '99215', desc: 'Office visit, established, high', baseAmount: 280 },
  { code: '99283', desc: 'ED visit, moderate severity', baseAmount: 450 },
  { code: '99284', desc: 'ED visit, high severity', baseAmount: 750 },
  { code: '99285', desc: 'ED visit, highest severity', baseAmount: 1200 },
  { code: '36415', desc: 'Venipuncture', baseAmount: 25 },
  { code: '80053', desc: 'Comprehensive metabolic panel', baseAmount: 120 },
  { code: '71046', desc: 'Chest X-ray', baseAmount: 180 },
  { code: '72148', desc: 'MRI lumbar spine', baseAmount: 1500 },
  { code: '27447', desc: 'Total knee replacement', baseAmount: 25000 },
  { code: '43239', desc: 'Upper GI endoscopy with biopsy', baseAmount: 2500 },
  { code: '96372', desc: 'Therapeutic injection', baseAmount: 85 },
  { code: '90834', desc: 'Psychotherapy, 45 min', baseAmount: 175 },
  { code: '99232', desc: 'Hospital visit, moderate', baseAmount: 140 },
  { code: '99233', desc: 'Hospital visit, high', baseAmount: 200 },
];

// Synthetic demographic data for equity analysis
const SYNTHETIC_DEMOGRAPHICS = {
  zipCodes: [
    { zip: '10001', incomeLevel: 'high', denialModifier: 0.9 },
    { zip: '10002', incomeLevel: 'medium', denialModifier: 1.0 },
    { zip: '10003', incomeLevel: 'low', denialModifier: 1.15 },
    { zip: '30301', incomeLevel: 'medium', denialModifier: 1.0 },
    { zip: '30302', incomeLevel: 'low', denialModifier: 1.2 },
    { zip: '60601', incomeLevel: 'high', denialModifier: 0.85 },
    { zip: '60602', incomeLevel: 'low', denialModifier: 1.18 },
    { zip: '90210', incomeLevel: 'high', denialModifier: 0.8 },
    { zip: '90011', incomeLevel: 'low', denialModifier: 1.25 },
    { zip: '77001', incomeLevel: 'medium', denialModifier: 1.05 },
  ],
  ageGroups: ['pediatric', 'adult', 'senior'],
  genders: ['M', 'F'],
};

// First names and last names for generating patient names
const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
  'Maria', 'Jose', 'Wei', 'Ahmed', 'Fatima', 'Raj', 'Priya', 'Yuki', 'Kenji', 'Anna',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'Chen', 'Patel', 'Kim', 'Nguyen', 'Santos', 'Ali', 'Singh', 'Wang', 'Tanaka',
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomChoices<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateClaimNumber(prefix: string, index: number): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(index).padStart(6, '0')}`;
}

function generateAppealNumber(claimNumber: string, level: number): string {
  return `APL-${claimNumber.split('-').slice(1).join('-')}-L${level}`;
}

function randomDate(startDays: number, endDays: number): Date {
  const start = new Date();
  start.setDate(start.getDate() - startDays);
  const end = new Date();
  end.setDate(end.getDate() - endDays);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function generatePatientName(): { first: string; last: string; full: string } {
  const first = randomChoice(FIRST_NAMES);
  const last = randomChoice(LAST_NAMES);
  return { first, last, full: `${first} ${last}` };
}

function generatePatientId(): string {
  return `PT${randomInt(100000, 999999)}`;
}

function generateNPI(): string {
  return `${randomInt(1000000000, 1999999999)}`;
}

// =============================================================================
// DATA GENERATORS
// =============================================================================

interface TenantConfig {
  id?: string;
  name: string;
  type: string;
  size: string;
  tier: string;
  baselineDenialRate: number;
  currentDenialRate: number;
  annualRevenue: number;
  claimVolume: number;
  facilities: FacilityConfig[];
}

interface FacilityConfig {
  name: string;
  type: string;
  city: string;
  state: string;
  zip: string;
}

interface DemoUser {
  email: string;
  fullName: string;
  role: string;
  jobTitle: string;
}

// Tenant configurations
const TENANT_CONFIGS: TenantConfig[] = [
  {
    name: 'Aegis Health System',
    type: 'Health System',
    size: 'Enterprise',
    tier: 'enterprise',
    baselineDenialRate: 0.19, // 19%
    currentDenialRate: 0.115, // 11.5% after ClarityClaim
    annualRevenue: 2800000000, // $2.8B
    claimVolume: 800, // claims to generate
    facilities: [
      { name: 'Aegis Medical Center - Downtown', type: 'hospital', city: 'Boston', state: 'MA', zip: '02108' },
      { name: 'Aegis Community Hospital - Westside', type: 'hospital', city: 'Boston', state: 'MA', zip: '02134' },
      { name: 'Aegis Specialty Clinic - Cambridge', type: 'clinic', city: 'Cambridge', state: 'MA', zip: '02139' },
      { name: 'Aegis Outpatient Center - Brookline', type: 'surgery_center', city: 'Brookline', state: 'MA', zip: '02445' },
    ],
  },
  {
    name: 'Unity Community Care Network',
    type: 'FQHC',
    size: 'Medium',
    tier: 'professional',
    baselineDenialRate: 0.22, // 22% - higher for safety net
    currentDenialRate: 0.14, // 14% after ClarityClaim
    annualRevenue: 85000000, // $85M
    claimVolume: 500,
    facilities: [
      { name: 'Unity Care Clinic - East Side', type: 'clinic', city: 'Detroit', state: 'MI', zip: '48207' },
      { name: 'Unity Care Clinic - Downtown', type: 'clinic', city: 'Detroit', state: 'MI', zip: '48226' },
      { name: 'Unity Mobile Health Unit', type: 'other', city: 'Detroit', state: 'MI', zip: '48201' },
    ],
  },
  {
    name: 'Sunrise Pediatrics Group',
    type: 'Specialty Practice',
    size: 'Small',
    tier: 'starter',
    baselineDenialRate: 0.15, // 15%
    currentDenialRate: 0.09, // 9% after ClarityClaim
    annualRevenue: 12000000, // $12M
    claimVolume: 300,
    facilities: [
      { name: 'Sunrise Pediatrics - Main Office', type: 'clinic', city: 'Austin', state: 'TX', zip: '78701' },
      { name: 'Sunrise Pediatrics - North Austin', type: 'clinic', city: 'Austin', state: 'TX', zip: '78758' },
    ],
  },
];

// Demo users per tenant
const DEMO_USERS: Record<string, DemoUser[]> = {
  'Aegis Health System': [
    { email: 'elena.moore@aegishealth.org', fullName: 'Elena Moore', role: 'executive', jobTitle: 'Chief Financial Officer' },
    { email: 'jordan.williams@aegishealth.org', fullName: 'Jordan Williams', role: 'manager', jobTitle: 'Revenue Cycle Manager' },
    { email: 'anthony.patel@aegishealth.org', fullName: 'Anthony Patel', role: 'billing_specialist', jobTitle: 'Senior Billing Specialist' },
    { email: 'lisa.chen@aegishealth.org', fullName: 'Lisa Chen', role: 'billing_specialist', jobTitle: 'Claims Analyst' },
  ],
  'Unity Community Care Network': [
    { email: 'maya.chen@unitycare.org', fullName: 'Dr. Maya Chen', role: 'manager', jobTitle: 'Compliance Director' },
    { email: 'marcus.johnson@unitycare.org', fullName: 'Marcus Johnson', role: 'billing_specialist', jobTitle: 'Billing Coordinator' },
  ],
  'Sunrise Pediatrics Group': [
    { email: 'priya.iyer@sunrisepeds.org', fullName: 'Priya Iyer', role: 'admin', jobTitle: 'Practice Administrator' },
    { email: 'david.martinez@sunrisepeds.org', fullName: 'David Martinez', role: 'billing_specialist', jobTitle: 'Medical Biller' },
  ],
};

// Payer configurations
const PAYER_CONFIGS = [
  { name: 'Medicare FFS', shortName: 'Medicare', type: 'medicare', avgDenialRate: 0.12, avgDaysToPay: 14 },
  { name: 'Medicare Advantage - Aetna', shortName: 'Aetna MA', type: 'medicare_advantage', avgDenialRate: 0.18, avgDaysToPay: 21 },
  { name: 'Medicare Advantage - UnitedHealthcare', shortName: 'UHC MA', type: 'medicare_advantage', avgDenialRate: 0.20, avgDaysToPay: 25 },
  { name: 'Medicaid - State Plan', shortName: 'Medicaid', type: 'medicaid', avgDenialRate: 0.15, avgDaysToPay: 30 },
  { name: 'Blue Cross Blue Shield', shortName: 'BCBS', type: 'commercial', avgDenialRate: 0.14, avgDaysToPay: 18 },
  { name: 'Cigna', shortName: 'Cigna', type: 'commercial', avgDenialRate: 0.16, avgDaysToPay: 20 },
  { name: 'UnitedHealthcare Commercial', shortName: 'UHC', type: 'commercial', avgDenialRate: 0.15, avgDaysToPay: 22 },
  { name: 'Marketplace Silver Plan', shortName: 'Exchange', type: 'exchange', avgDenialRate: 0.17, avgDaysToPay: 28 },
];

// =============================================================================
// MAIN SEEDING FUNCTIONS
// =============================================================================

async function createPayers(): Promise<string[]> {
  console.log('\n📋 Creating payers...');
  
  const payerIds: string[] = [];
  
  for (const payer of PAYER_CONFIGS) {
    const { data, error } = await supabase
      .from('payers')
      .upsert({
        name: payer.name,
        short_name: payer.shortName,
        type: payer.type,
        category: payer.type.includes('medicare') || payer.type === 'medicaid' ? 'government' : 'private',
        avg_denial_rate: payer.avgDenialRate,
        avg_days_to_pay: payer.avgDaysToPay,
        timely_filing_days: payer.type === 'medicare' ? 365 : 90,
        appeal_filing_days: payer.type === 'medicare' ? 180 : 60,
        is_active: true,
      }, { onConflict: 'name' })
      .select('id')
      .single();
    
    if (error) {
      console.error(`  ❌ Error creating payer ${payer.name}:`, error.message);
    } else if (data) {
      payerIds.push(data.id);
      console.log(`  ✓ Created payer: ${payer.name}`);
    }
  }
  
  return payerIds;
}

async function createAIModels(): Promise<void> {
  console.log('\n🤖 Creating AI model registry...');
  
  const models = [
    {
      name: 'ccai-denial-risk',
      version: 'v1.3',
      type: 'denial_risk',
      description: 'Predicts probability of claim denial based on historical patterns and claim characteristics',
      status: 'active',
      is_default: true,
      accuracy: 0.89,
      precision_score: 0.87,
      recall: 0.91,
      f1_score: 0.89,
      auc_roc: 0.94,
      total_inferences: 124500,
      avg_inference_time_ms: 45,
      deployed_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: 'ccai-appeal-gen',
      version: 'v1.3',
      type: 'appeal_generation',
      description: 'Generates structured appeal letters with clinical justification',
      status: 'active',
      is_default: true,
      accuracy: 0.92,
      total_inferences: 28300,
      avg_inference_time_ms: 850,
      deployed_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: 'ccai-equity-analyzer',
      version: 'v1.0',
      type: 'equity_analysis',
      description: 'Detects and quantifies disparities in denial patterns across demographics',
      status: 'active',
      is_default: true,
      total_inferences: 8500,
      avg_inference_time_ms: 1200,
      deployed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: 'ccai-denial-risk',
      version: 'v1.2',
      type: 'denial_risk',
      description: 'Previous version of denial risk model',
      status: 'deprecated',
      is_default: false,
      accuracy: 0.85,
      auc_roc: 0.91,
      total_inferences: 450000,
      retired_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  for (const model of models) {
    const { error } = await supabase.from('ai_models').upsert(model, { onConflict: 'name,version' });
    if (error) {
      console.error(`  ❌ Error creating model ${model.name} ${model.version}:`, error.message);
    } else {
      console.log(`  ✓ Created model: ${model.name} ${model.version}`);
    }
  }
}

async function createTenant(config: TenantConfig, payerIds: string[]): Promise<string | null> {
  console.log(`\n🏥 Creating tenant: ${config.name}`);
  
  // Create organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .upsert({
      name: config.name,
      type: config.type,
      size: config.size,
      subscription_tier: config.tier,
      subscription_status: 'active',
      settings: {
        baselineDenialRate: config.baselineDenialRate,
        currentDenialRate: config.currentDenialRate,
        annualRevenue: config.annualRevenue,
      },
    }, { onConflict: 'name' })
    .select('id')
    .single();
  
  if (orgError || !org) {
    console.error(`  ❌ Error creating organization:`, orgError?.message);
    return null;
  }
  
  const orgId = org.id;
  console.log(`  ✓ Organization created: ${orgId}`);
  
  // Create facilities
  const facilityIds: string[] = [];
  for (const facility of config.facilities) {
    const { data: fac, error: facError } = await supabase
      .from('facilities')
      .upsert({
        organization_id: orgId,
        name: facility.name,
        type: facility.type,
        city: facility.city,
        state: facility.state,
        zip_code: facility.zip,
        npi: generateNPI(),
        is_active: true,
        is_primary: config.facilities.indexOf(facility) === 0,
      }, { onConflict: 'organization_id,name' })
      .select('id')
      .single();
    
    if (!facError && fac) {
      facilityIds.push(fac.id);
      console.log(`    ✓ Facility: ${facility.name}`);
    }
  }
  
  // Link payers to organization
  for (const payerId of payerIds) {
    await supabase.from('organization_payers').upsert({
      organization_id: orgId,
      payer_id: payerId,
      is_active: true,
      total_claims: randomInt(100, 1000),
      denied_claims: randomInt(10, 150),
      paid_claims: randomInt(50, 800),
    }, { onConflict: 'organization_id,payer_id' });
  }
  
  // Store IDs in config for later use
  config.id = orgId;
  
  return orgId;
}

async function generateClaimsForTenant(
  config: TenantConfig,
  payerIds: string[],
  facilityIds: string[]
): Promise<{ claimIds: string[]; deniedClaimIds: string[] }> {
  console.log(`\n📄 Generating ${config.claimVolume} claims for ${config.name}...`);
  
  const claimIds: string[] = [];
  const deniedClaimIds: string[] = [];
  
  // Get facilities for this org
  const { data: facilities } = await supabase
    .from('facilities')
    .select('id')
    .eq('organization_id', config.id);
  
  const orgFacilityIds = facilities?.map(f => f.id) || facilityIds;
  
  for (let i = 0; i < config.claimVolume; i++) {
    const patient = generatePatientName();
    const cpt = randomChoice(CPT_CODES);
    const icd = randomChoices(ICD10_CODES, randomInt(1, 3));
    const demographic = randomChoice(SYNTHETIC_DEMOGRAPHICS.zipCodes);
    const payerId = randomChoice(payerIds);
    const facilityId = randomChoice(orgFacilityIds);
    
    // Determine if claim is denied based on rates
    const baseDenialProbability = i < config.claimVolume * 0.4 
      ? config.baselineDenialRate  // Earlier claims (baseline period)
      : config.currentDenialRate;  // Recent claims (with ClarityClaim)
    
    const adjustedDenialProbability = baseDenialProbability * demographic.denialModifier;
    const isDenied = Math.random() < adjustedDenialProbability;
    
    // Calculate amounts
    const billedAmount = cpt.baseAmount * randomFloat(0.9, 1.3);
    const allowedAmount = billedAmount * randomFloat(0.6, 0.9);
    const paidAmount = isDenied ? 0 : allowedAmount * randomFloat(0.85, 1.0);
    
    // Dates
    const serviceDate = randomDate(365, 10);
    const submissionDate = new Date(serviceDate);
    submissionDate.setDate(submissionDate.getDate() + randomInt(1, 14));
    
    // Status and denial info
    let status = 'paid';
    let denialDate = null;
    let denialCategory = null;
    let denialCode = null;
    let denialReason = null;
    let riskScore = randomFloat(0.05, 0.35);
    
    if (isDenied) {
      const denialInfo = randomChoice(DENIAL_REASONS);
      status = 'denied';
      denialDate = new Date(submissionDate);
      denialDate.setDate(denialDate.getDate() + randomInt(7, 30));
      denialCategory = denialInfo.category;
      denialCode = denialInfo.code;
      denialReason = denialInfo.detail;
      riskScore = randomFloat(0.55, 0.95);
    }
    
    const claimNumber = generateClaimNumber(config.name.split(' ')[0].toUpperCase().slice(0, 3), i + 1);
    
    const claim = {
      organization_id: config.id,
      facility_id: facilityId,
      payer_id_ref: payerId,
      claim_number: claimNumber,
      patient_name: patient.full,
      patient_id: generatePatientId(),
      patient_zip: demographic.zip,
      patient_age_group: randomChoice(SYNTHETIC_DEMOGRAPHICS.ageGroups),
      patient_gender: randomChoice(SYNTHETIC_DEMOGRAPHICS.genders),
      payer_name: PAYER_CONFIGS.find(p => p.name)?.name || 'Unknown Payer',
      plan_type: randomChoice(['Medicare', 'Medicaid', 'Commercial']),
      claim_type: randomChoice(['professional', 'institutional']),
      service_date: formatDate(serviceDate),
      submitted_at: submissionDate.toISOString(),
      procedure_codes: [cpt.code],
      diagnosis_codes: icd,
      billed_amount: billedAmount,
      allowed_amount: allowedAmount,
      paid_amount: paidAmount,
      status,
      denial_date: denialDate ? formatDate(denialDate) : null,
      denial_category: denialCategory,
      denial_codes: denialCode ? [denialCode] : null,
      denial_reasons: denialReason ? [denialReason] : null,
      denial_risk_score: riskScore * 100,
      denial_risk_level: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
      priority: riskScore > 0.7 ? 'high' : 'normal',
      source: 'import',
    };
    
    const { data, error } = await supabase
      .from('claims')
      .insert(claim)
      .select('id')
      .single();
    
    if (!error && data) {
      claimIds.push(data.id);
      if (isDenied) {
        deniedClaimIds.push(data.id);
      }
    }
    
    // Progress indicator
    if ((i + 1) % 100 === 0) {
      console.log(`  ... ${i + 1}/${config.claimVolume} claims created`);
    }
  }
  
  console.log(`  ✓ Created ${claimIds.length} claims (${deniedClaimIds.length} denied)`);
  return { claimIds, deniedClaimIds };
}

async function generateAppealsForDeniedClaims(
  config: TenantConfig,
  deniedClaimIds: string[]
): Promise<string[]> {
  console.log(`\n📝 Generating appeals for ${config.name}...`);
  
  const appealIds: string[] = [];
  const appealsToCreate = Math.floor(deniedClaimIds.length * 0.55); // 55% of denied claims appealed
  const claimsToAppeal = randomChoices(deniedClaimIds, appealsToCreate);
  
  for (const claimId of claimsToAppeal) {
    // Get claim details
    const { data: claim } = await supabase
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single();
    
    if (!claim) continue;
    
    // Determine appeal outcome
    const categoryInfo = DENIAL_CATEGORIES.find(c => c.name === claim.denial_category);
    const successRate = categoryInfo?.appealSuccessRate || 0.4;
    const isSuccessful = Math.random() < successRate;
    
    const appealNumber = generateAppealNumber(claim.claim_number, 1);
    const submittedAt = claim.denial_date 
      ? new Date(new Date(claim.denial_date).getTime() + randomInt(3, 14) * 24 * 60 * 60 * 1000)
      : new Date();
    
    let status = 'draft';
    let outcome = null;
    let resolvedAt = null;
    let amountRecovered = null;
    
    if (Math.random() > 0.15) { // 85% submitted
      status = 'submitted';
      
      if (Math.random() > 0.25) { // 75% have outcome
        resolvedAt = new Date(submittedAt.getTime() + randomInt(14, 45) * 24 * 60 * 60 * 1000);
        
        if (isSuccessful) {
          outcome = Math.random() > 0.3 ? 'approved' : 'partially_approved';
          amountRecovered = outcome === 'approved' 
            ? claim.billed_amount * randomFloat(0.7, 0.95)
            : claim.billed_amount * randomFloat(0.3, 0.6);
          status = 'approved';
        } else {
          outcome = 'denied';
          status = 'denied';
        }
      } else {
        status = 'under_review';
      }
    }
    
    const appeal = {
      claim_id: claimId,
      organization_id: config.id,
      appeal_number: appealNumber,
      appeal_level: 1,
      appeal_type: 'standard',
      original_denial_reason: claim.denial_reasons?.[0] || 'Unspecified denial',
      original_denial_code: claim.denial_codes?.[0],
      original_denial_date: claim.denial_date,
      original_denial_amount: claim.billed_amount,
      amount_appealed: claim.billed_amount,
      amount_recovered: amountRecovered,
      status,
      outcome,
      submitted_at: status !== 'draft' ? submittedAt.toISOString() : null,
      outcome_date: resolvedAt ? formatDate(resolvedAt) : null,
      ai_generated: true,
      ai_model: 'ccai-appeal-gen-v1.3',
      ai_confidence: randomFloat(0.75, 0.95),
      appeal_letter: generateAppealLetter(claim),
      deadline: new Date(new Date(claim.denial_date || new Date()).getTime() + 60 * 24 * 60 * 60 * 1000),
    };
    
    const { data, error } = await supabase
      .from('appeals')
      .insert(appeal)
      .select('id')
      .single();
    
    if (!error && data) {
      appealIds.push(data.id);
      
      // Update claim status
      await supabase
        .from('claims')
        .update({ 
          status: outcome === 'approved' ? 'appeal_won' : outcome === 'denied' ? 'appeal_lost' : 'appealed',
          paid_amount: amountRecovered || 0,
        })
        .eq('id', claimId);
    }
  }
  
  console.log(`  ✓ Created ${appealIds.length} appeals`);
  return appealIds;
}

function generateAppealLetter(claim: Record<string, unknown>): string {
  return `Dear Appeals Committee,

I am writing to formally appeal the denial of claim ${claim.claim_number} for patient ${claim.patient_name}.

DENIAL INFORMATION:
- Claim Number: ${claim.claim_number}
- Date of Service: ${claim.service_date}
- Denial Reason: ${(claim.denial_reasons as string[])?.[0] || 'Not specified'}
- Billed Amount: $${(claim.billed_amount as number)?.toLocaleString()}

GROUNDS FOR APPEAL:
The services provided were medically necessary and appropriately documented. The denial appears to be based on incomplete review of the clinical documentation provided.

SUPPORTING EVIDENCE:
1. Complete medical records from date of service
2. Treating physician's clinical notes and rationale
3. Relevant diagnostic test results supporting medical necessity

Based on the above, I respectfully request reconsideration of this claim.

Sincerely,
[Provider Name]
[Provider NPI]`;
}

async function generateAIInsights(
  config: TenantConfig,
  claimIds: string[]
): Promise<void> {
  console.log(`\n🧠 Generating AI insights for ${config.name}...`);
  
  // Generate insights for a sample of claims
  const sampleSize = Math.min(150, Math.floor(claimIds.length * 0.3));
  const sampleClaims = randomChoices(claimIds, sampleSize);
  
  for (const claimId of sampleClaims) {
    const { data: claim } = await supabase
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single();
    
    if (!claim) continue;
    
    const isDenied = claim.status === 'denied' || claim.status === 'appealed';
    const riskScore = isDenied ? randomFloat(0.55, 0.95) : randomFloat(0.05, 0.45);
    
    const topFactors = [
      { label: 'Prior authorization status', weight: randomFloat(0.1, 0.4), direction: isDenied ? 'increases' : 'decreases' },
      { label: 'Documentation completeness', weight: randomFloat(0.1, 0.3), direction: isDenied ? 'increases' : 'decreases' },
      { label: 'Payer historical patterns', weight: randomFloat(0.05, 0.25), direction: isDenied ? 'increases' : 'decreases' },
      { label: 'Code combination validity', weight: randomFloat(0.05, 0.2), direction: 'neutral' },
    ].sort((a, b) => b.weight - a.weight);
    
    const suggestedActions = isDenied ? [
      { action: 'Review clinical documentation for completeness', priority: 'high', impact: 'high' },
      { action: 'Verify prior authorization on file', priority: 'high', impact: 'medium' },
      { action: 'Consider peer-to-peer review with payer', priority: 'medium', impact: 'high' },
    ] : [
      { action: 'Documentation appears complete', priority: 'low', impact: 'low' },
    ];
    
    await supabase.from('ai_insights').insert({
      claim_id: claimId,
      organization_id: config.id,
      risk_score: riskScore,
      risk_level: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
      confidence: randomFloat(0.8, 0.95),
      top_factors: topFactors,
      suggested_actions: suggestedActions,
      explanation: isDenied 
        ? `This claim has elevated denial risk (${(riskScore * 100).toFixed(1)}%) due to ${topFactors[0].label.toLowerCase()} and ${topFactors[1].label.toLowerCase()}.`
        : `This claim has low denial risk (${(riskScore * 100).toFixed(1)}%). Documentation and coding appear appropriate.`,
      model_name: 'ccai-denial-risk',
      model_version: 'v1.3',
      inference_time_ms: randomInt(30, 80),
      appeal_success_probability: isDenied ? randomFloat(0.35, 0.75) : null,
    });
  }
  
  console.log(`  ✓ Created ${sampleSize} AI insights`);
}

async function generateEquitySignals(
  config: TenantConfig,
  claimIds: string[]
): Promise<void> {
  // Only generate for Unity (FQHC) as specified
  if (!config.name.includes('Unity')) return;
  
  console.log(`\n⚖️ Generating equity signals for ${config.name}...`);
  
  const dimensions = [
    { dim: 'zip_code', values: SYNTHETIC_DEMOGRAPHICS.zipCodes.filter(z => z.incomeLevel === 'low').map(z => z.zip) },
    { dim: 'income_bracket', values: ['low_income', 'very_low_income'] },
    { dim: 'payer_type', values: ['medicaid', 'exchange'] },
  ];
  
  let signalCount = 0;
  
  for (const { dim, values } of dimensions) {
    for (const value of values) {
      // Get sample claims for this dimension
      const sampleClaims = randomChoices(claimIds, randomInt(5, 15));
      
      for (const claimId of sampleClaims) {
        const disparityScore = randomFloat(0.15, 0.45);
        const baselineRate = config.baselineDenialRate;
        const observedRate = baselineRate * (1 + disparityScore);
        
        await supabase.from('equity_signals').insert({
          claim_id: claimId,
          organization_id: config.id,
          dimension: dim,
          dimension_value: value,
          disparity_score: disparityScore,
          statistical_significance: randomFloat(0.01, 0.05),
          sample_size: randomInt(50, 200),
          baseline_denial_rate: baselineRate,
          observed_denial_rate: observedRate,
          rate_ratio: observedRate / baselineRate,
          comparison_group: 'Overall population',
          time_period_start: formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
          time_period_end: formatDate(new Date()),
          is_flagged: disparityScore > 0.3,
          analysis_type: 'individual',
          model_version: 'v1.0',
        });
        
        signalCount++;
      }
    }
  }
  
  console.log(`  ✓ Created ${signalCount} equity signals`);
}

async function generateAuditLogs(config: TenantConfig): Promise<void> {
  console.log(`\n📋 Generating audit logs for ${config.name}...`);
  
  const eventTypes = [
    { type: 'AI_DENIAL_RISK', category: 'ai', resource: 'claim' },
    { type: 'AI_APPEAL_GENERATED', category: 'ai', resource: 'appeal' },
    { type: 'CLAIM_VIEWED', category: 'phi_access', resource: 'claim' },
    { type: 'APPEAL_SUBMITTED', category: 'workflow', resource: 'appeal' },
    { type: 'EQUITY_ANALYSIS_RUN', category: 'ai', resource: 'report' },
  ];
  
  const logCount = randomInt(50, 100);
  
  for (let i = 0; i < logCount; i++) {
    const event = randomChoice(eventTypes);
    const createdAt = randomDate(30, 0);
    
    await supabase.from('security_audit_logs').insert({
      organization_id: config.id,
      action_type: event.type,
      action_category: event.category,
      resource_type: event.resource,
      phi_accessed: event.category === 'phi_access',
      severity: 'info',
      hipaa_relevant: event.category === 'phi_access',
      created_at: createdAt.toISOString(),
      description: `${event.type} action performed`,
      metadata: event.category === 'ai' ? { model_version: 'v1.3' } : {},
    });
  }
  
  console.log(`  ✓ Created ${logCount} audit logs`);
}

async function createHeroClaims(): Promise<void> {
  console.log('\n⭐ Creating hero demo scenarios...');
  
  // Get first org (Aegis) for hero claims
  const { data: aegis } = await supabase
    .from('organizations')
    .select('id')
    .eq('name', 'Aegis Health System')
    .single();
  
  const { data: unity } = await supabase
    .from('organizations')
    .select('id')
    .eq('name', 'Unity Community Care Network')
    .single();
  
  if (!aegis || !unity) {
    console.log('  ⚠️ Could not find organizations for hero claims');
    return;
  }
  
  // Hero Scenario 1: High-dollar oncology claim with successful AI appeal
  const hero1 = {
    organization_id: aegis.id,
    claim_number: 'HERO-2024-ONCO-001',
    patient_name: 'Margaret Thompson',
    patient_id: 'PT-HERO-001',
    payer_name: 'Medicare Advantage - UnitedHealthcare',
    plan_type: 'Medicare',
    service_date: formatDate(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)),
    procedure_codes: ['96413', '96415'],
    diagnosis_codes: ['C34.90', 'Z51.11'],
    billed_amount: 47500,
    allowed_amount: 38000,
    paid_amount: 36100,
    status: 'appeal_won',
    denial_date: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    denial_category: 'medical_necessity',
    denial_codes: ['CO-50'],
    denial_reasons: ['Non-covered service - not deemed medically necessary'],
    denial_risk_score: 78,
    denial_risk_level: 'high',
    is_demo_hero: true,
    claim_type: 'professional',
    notes: 'HERO SCENARIO: High-dollar oncology claim successfully overturned with AI-generated appeal.',
  };
  
  const { data: hero1Data } = await supabase.from('claims').insert(hero1).select('id').single();
  
  if (hero1Data) {
    // Create appeal for hero 1
    await supabase.from('appeals').insert({
      claim_id: hero1Data.id,
      organization_id: aegis.id,
      appeal_number: 'APL-HERO-ONCO-001-L1',
      appeal_level: 1,
      appeal_type: 'standard',
      original_denial_reason: 'Non-covered service - not deemed medically necessary',
      original_denial_amount: 47500,
      amount_appealed: 47500,
      amount_recovered: 36100,
      status: 'approved',
      outcome: 'approved',
      submitted_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      outcome_date: formatDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
      ai_generated: true,
      ai_model: 'ccai-appeal-gen-v1.3',
      ai_confidence: 0.92,
      appeal_letter: `Dear Appeals Committee,

I am writing to formally appeal the denial of chemotherapy services for Margaret Thompson (Claim #HERO-2024-ONCO-001).

CLINICAL JUSTIFICATION:
The patient has been diagnosed with Stage IIIA Non-Small Cell Lung Cancer (ICD-10: C34.90). The prescribed chemotherapy regimen follows NCCN Clinical Practice Guidelines and represents the standard of care for this diagnosis.

KEY SUPPORTING EVIDENCE:
1. Pathology report confirming adenocarcinoma
2. PET-CT staging showing locally advanced disease
3. Tumor board recommendation documenting treatment consensus
4. ECOG performance status of 1, indicating patient can tolerate treatment

The treatment plan directly addresses the patient's life-threatening condition and offers the best chance of disease control. Alternative treatments would be less effective and potentially more costly due to disease progression.

I respectfully request full reconsideration of this medically necessary treatment.`,
    });
    
    // Create AI insight
    await supabase.from('ai_insights').insert({
      claim_id: hero1Data.id,
      organization_id: aegis.id,
      risk_score: 0.78,
      risk_level: 'high',
      confidence: 0.91,
      top_factors: [
        { label: 'High-cost oncology treatment', weight: 0.35, direction: 'increases' },
        { label: 'Medicare Advantage payer', weight: 0.28, direction: 'increases' },
        { label: 'Strong clinical documentation', weight: 0.22, direction: 'decreases' },
      ],
      suggested_actions: [
        { action: 'Include tumor board notes in appeal', priority: 'high', impact: 'high' },
        { action: 'Reference NCCN guidelines', priority: 'high', impact: 'high' },
      ],
      explanation: 'High-cost oncology claims face elevated scrutiny. Strong clinical documentation and guideline adherence significantly improve appeal success probability.',
      model_name: 'ccai-denial-risk',
      model_version: 'v1.3',
      appeal_success_probability: 0.73,
    });
    
    console.log('  ✓ Hero 1: Oncology medical necessity appeal');
  }
  
  // Hero Scenario 2: Equity-flagged preventive care denial
  const hero2 = {
    organization_id: unity.id,
    claim_number: 'HERO-2024-PREV-002',
    patient_name: 'Maria Santos',
    patient_id: 'PT-HERO-002',
    patient_zip: '48207', // Low-income Detroit ZIP
    payer_name: 'Medicaid - State Plan',
    plan_type: 'Medicaid',
    service_date: formatDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)),
    procedure_codes: ['99396', '90471', '90715'],
    diagnosis_codes: ['Z23', 'Z00.129'],
    billed_amount: 285,
    allowed_amount: 225,
    paid_amount: 225,
    status: 'appeal_won',
    denial_date: formatDate(new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)),
    denial_category: 'coverage',
    denial_codes: ['CO-27'],
    denial_reasons: ['Benefits not covered'],
    denial_risk_score: 62,
    denial_risk_level: 'medium',
    is_demo_hero: true,
    claim_type: 'professional',
    notes: 'HERO SCENARIO: Preventive care denial flagged by equity analytics, successfully appealed.',
  };
  
  const { data: hero2Data } = await supabase.from('claims').insert(hero2).select('id').single();
  
  if (hero2Data) {
    // Create equity signal
    await supabase.from('equity_signals').insert({
      claim_id: hero2Data.id,
      organization_id: unity.id,
      dimension: 'zip_code',
      dimension_value: '48207',
      disparity_score: 0.38,
      statistical_significance: 0.02,
      sample_size: 145,
      baseline_denial_rate: 0.12,
      observed_denial_rate: 0.18,
      rate_ratio: 1.50,
      comparison_group: 'Overall Medicaid population',
      is_flagged: true,
      flag_reason: 'Significant disparity detected in preventive care denials',
      analysis_type: 'individual',
    });
    
    await supabase.from('appeals').insert({
      claim_id: hero2Data.id,
      organization_id: unity.id,
      appeal_number: 'APL-HERO-PREV-002-L1',
      status: 'approved',
      outcome: 'approved',
      amount_recovered: 225,
      ai_generated: true,
    });
    
    console.log('  ✓ Hero 2: Equity-flagged preventive care');
  }
  
  // Hero Scenario 3: Pre-submission prevention (authorization)
  const hero3 = {
    organization_id: aegis.id,
    claim_number: 'HERO-2024-PREV-003',
    patient_name: 'Robert Chen',
    patient_id: 'PT-HERO-003',
    payer_name: 'Blue Cross Blue Shield',
    plan_type: 'Commercial',
    service_date: formatDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    procedure_codes: ['72148'],
    diagnosis_codes: ['M54.5', 'M47.816'],
    billed_amount: 1850,
    allowed_amount: 1480,
    paid_amount: 1480,
    status: 'paid',
    denial_risk_score: 72,
    denial_risk_level: 'high',
    is_demo_hero: true,
    claim_type: 'professional',
    notes: 'HERO SCENARIO: High-risk claim flagged PRE-submission. Prior auth obtained, denial prevented.',
  };
  
  const { data: hero3Data } = await supabase.from('claims').insert(hero3).select('id').single();
  
  if (hero3Data) {
    await supabase.from('ai_insights').insert({
      claim_id: hero3Data.id,
      organization_id: aegis.id,
      risk_score: 0.72,
      risk_level: 'high',
      confidence: 0.88,
      top_factors: [
        { label: 'MRI requires prior authorization', weight: 0.45, direction: 'increases' },
        { label: 'No auth on file at intake', weight: 0.35, direction: 'increases' },
      ],
      suggested_actions: [
        { action: 'Obtain prior authorization before submission', priority: 'critical', impact: 'high' },
        { action: 'Document clinical necessity for imaging', priority: 'high', impact: 'medium' },
      ],
      explanation: 'PREVENTION SUCCESS: AI flagged missing prior authorization before submission. Authorization was obtained, preventing denial.',
      model_name: 'ccai-denial-risk',
      model_version: 'v1.3',
    });
    
    console.log('  ✓ Hero 3: Pre-submission prevention');
  }
  
  // Hero Scenario 4: Timely filing (unappealable) - root cause analysis
  const hero4 = {
    organization_id: aegis.id,
    claim_number: 'HERO-2024-TFL-004',
    patient_name: 'James Wilson',
    patient_id: 'PT-HERO-004',
    payer_name: 'Cigna',
    plan_type: 'Commercial',
    service_date: formatDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)),
    submitted_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    procedure_codes: ['99284'],
    diagnosis_codes: ['R10.9'],
    billed_amount: 890,
    status: 'denied',
    denial_date: formatDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
    denial_category: 'timely_filing',
    denial_codes: ['CO-29'],
    denial_reasons: ['Timely filing limit exceeded - claim submitted 150 days after DOS'],
    denial_risk_score: 95,
    denial_risk_level: 'critical',
    is_demo_hero: true,
    claim_type: 'professional',
    notes: 'HERO SCENARIO: Unappealable timely filing denial. Used for root-cause dashboard analysis.',
  };
  
  await supabase.from('claims').insert(hero4);
  console.log('  ✓ Hero 4: Timely filing root cause');
  
  // Hero Scenario 5: Multi-level appeal timeline
  const hero5 = {
    organization_id: aegis.id,
    claim_number: 'HERO-2024-MULTI-005',
    patient_name: 'Patricia Anderson',
    patient_id: 'PT-HERO-005',
    payer_name: 'Medicare Advantage - Aetna',
    plan_type: 'Medicare',
    service_date: formatDate(new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)),
    procedure_codes: ['27447'],
    diagnosis_codes: ['M17.11'],
    billed_amount: 32000,
    allowed_amount: 28000,
    paid_amount: 28000,
    status: 'appeal_won',
    denial_date: formatDate(new Date(Date.now() - 100 * 24 * 60 * 60 * 1000)),
    denial_category: 'medical_necessity',
    denial_codes: ['CO-50'],
    denial_reasons: ['Medical necessity not established for total knee arthroplasty'],
    denial_risk_score: 68,
    denial_risk_level: 'high',
    is_demo_hero: true,
    claim_type: 'institutional',
    notes: 'HERO SCENARIO: Multi-appeal timeline showing partial → full overturn. Demonstrates ROI tracking.',
  };
  
  const { data: hero5Data } = await supabase.from('claims').insert(hero5).select('id').single();
  
  if (hero5Data) {
    // First appeal - partial
    await supabase.from('appeals').insert({
      claim_id: hero5Data.id,
      organization_id: aegis.id,
      appeal_number: 'APL-HERO-MULTI-005-L1',
      appeal_level: 1,
      status: 'approved',
      outcome: 'partially_approved',
      original_denial_amount: 32000,
      amount_appealed: 32000,
      amount_recovered: 14000,
      submitted_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      outcome_date: formatDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)),
      ai_generated: true,
    });
    
    // Second appeal - full
    await supabase.from('appeals').insert({
      claim_id: hero5Data.id,
      organization_id: aegis.id,
      appeal_number: 'APL-HERO-MULTI-005-L2',
      appeal_level: 2,
      status: 'approved',
      outcome: 'approved',
      amount_appealed: 18000,
      amount_recovered: 14000,
      submitted_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      outcome_date: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      ai_generated: true,
    });
    
    console.log('  ✓ Hero 5: Multi-level appeal timeline');
  }
  
  // Create demo scenarios table entries
  const scenarios = [
    {
      name: 'AI-Powered Oncology Appeal',
      description: 'High-dollar chemotherapy claim denied for medical necessity, successfully overturned with AI-generated appeal citing NCCN guidelines.',
      category: 'ai_appeal',
      claim_id: hero1Data?.id,
      organization_id: aegis.id,
      display_order: 1,
      is_featured: true,
      icon: 'Sparkles',
      color: 'teal',
      narrative_intro: 'Watch how ClarityClaim AI transforms a $47,500 oncology denial into a successful appeal.',
      key_metrics: [
        { label: 'Amount Recovered', value: '$36,100', highlight: true },
        { label: 'Appeal Success Rate', value: '73%', highlight: false },
        { label: 'Time to Resolution', value: '15 days', highlight: false },
      ],
      target_url: hero1Data ? `/app/claims/${hero1Data.id}` : '/app/claims',
      is_active: true,
    },
    {
      name: 'Equity Analytics in Action',
      description: 'Preventive care denial in underserved ZIP code flagged by equity analytics, revealing systemic disparity patterns.',
      category: 'equity',
      claim_id: hero2Data?.id,
      organization_id: unity.id,
      display_order: 2,
      is_featured: true,
      icon: 'Scale',
      color: 'purple',
      narrative_intro: 'See how ClarityClaim identifies and addresses healthcare disparities through AI-powered equity analytics.',
      key_metrics: [
        { label: 'Disparity Score', value: '38%', highlight: true },
        { label: 'ZIP Code', value: '48207', highlight: false },
        { label: 'Sample Size', value: '145 claims', highlight: false },
      ],
      target_url: '/app/analytics?tab=equity',
      is_active: true,
    },
    {
      name: 'Pre-Submission Prevention',
      description: 'AI flagged missing prior authorization before claim submission, enabling proactive resolution.',
      category: 'prevention',
      claim_id: hero3Data?.id,
      organization_id: aegis.id,
      display_order: 3,
      is_featured: true,
      icon: 'ShieldCheck',
      color: 'green',
      narrative_intro: 'Prevention is better than cure. See how AI catches issues before they become denials.',
      key_metrics: [
        { label: 'Risk Score at Intake', value: '72%', highlight: true },
        { label: 'Denial Prevented', value: 'Yes', highlight: true },
        { label: 'Amount Saved', value: '$1,850', highlight: false },
      ],
      target_url: hero3Data ? `/app/claims/${hero3Data.id}` : '/app/claims',
      is_active: true,
    },
    {
      name: 'Root Cause Analysis',
      description: 'Timely filing denial identified for root cause analysis - drives operational improvement.',
      category: 'workflow',
      display_order: 4,
      is_featured: false,
      icon: 'PieChart',
      color: 'orange',
      narrative_intro: 'Not every denial can be appealed, but every denial teaches us something.',
      key_metrics: [
        { label: 'Days Past Deadline', value: '60 days', highlight: true },
        { label: 'Root Cause', value: 'Process Gap', highlight: false },
      ],
      target_url: '/app/analytics?tab=denials',
      is_active: true,
    },
    {
      name: 'Multi-Level Appeal ROI',
      description: 'Total knee replacement claim requiring two appeal levels before full payment - demonstrates persistence and ROI tracking.',
      category: 'roi',
      claim_id: hero5Data?.id,
      organization_id: aegis.id,
      display_order: 5,
      is_featured: true,
      icon: 'TrendingUp',
      color: 'blue',
      narrative_intro: 'Sometimes success requires persistence. Track ROI across multiple appeal levels.',
      key_metrics: [
        { label: 'Total Recovered', value: '$28,000', highlight: true },
        { label: 'Appeal Levels', value: '2', highlight: false },
        { label: 'Time to Full Recovery', value: '90 days', highlight: false },
      ],
      target_url: hero5Data ? `/app/claims/${hero5Data.id}` : '/app/claims',
      is_active: true,
    },
  ];
  
  for (const scenario of scenarios) {
    await supabase.from('demo_scenarios').insert(scenario);
  }
  
  console.log(`  ✓ Created ${scenarios.length} demo scenarios`);
}

async function createAdminUser(): Promise<void> {
  console.log('\n👤 Creating admin demo user...');
  
  // First, check if the ClarityClaim Demo org exists or create it
  const { data: demoOrg, error: orgError } = await supabase
    .from('organizations')
    .upsert({
      name: 'ClarityClaim Demo Org',
      type: 'Demo',
      size: 'Enterprise',
      subscription_tier: 'enterprise',
      subscription_status: 'active',
      settings: {
        isSystemOrg: true,
        description: 'System organization for admin users',
      },
    }, { onConflict: 'name' })
    .select('id')
    .single();
  
  if (orgError) {
    console.error('  ❌ Error creating demo org:', orgError.message);
    return;
  }
  
  // Note: In production, you would create the user through Supabase Auth
  // For demo purposes, we'll create a profile entry that can be linked to an auth user
  
  // First check if user profile exists
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', 'admin@clarityclaim.ai')
    .single();
  
  if (existingProfile) {
    // Update existing profile
    await supabase
      .from('user_profiles')
      .update({
        full_name: 'ClarityClaim System Admin',
        role: 'owner',
        organization_id: demoOrg?.id,
        job_title: 'System Administrator',
        is_system_admin: true,
        can_access_all_tenants: true,
      })
      .eq('id', existingProfile.id);
    
    console.log('  ✓ Updated existing admin user profile');
  } else {
    console.log('  ℹ️ Admin user profile will be created when user signs up with admin@clarityclaim.ai');
    console.log('  ℹ️ After signup, run: UPDATE user_profiles SET is_system_admin = true, can_access_all_tenants = true WHERE email = \'admin@clarityclaim.ai\';');
  }
  
  console.log('\n📋 Admin User Details:');
  console.log('  Email: admin@clarityclaim.ai');
  console.log('  Name: ClarityClaim System Admin');
  console.log('  Role: System Administrator (super_admin)');
  console.log('  Access: All tenants, full platform capabilities');
}

async function createDemoUsers(tenantConfigs: TenantConfig[]): Promise<void> {
  console.log('\n👥 Creating demo users for tenants...');
  
  for (const config of tenantConfigs) {
    const users = DEMO_USERS[config.name];
    if (!users || !config.id) continue;
    
    console.log(`  ${config.name}:`);
    
    for (const user of users) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', user.email)
        .single();
      
      if (!existingProfile) {
        // Create a placeholder that will be linked when user signs up
        console.log(`    ℹ️ ${user.fullName} (${user.email}) - profile ready for signup`);
      } else {
        // Update existing profile
        await supabase
          .from('user_profiles')
          .update({
            full_name: user.fullName,
            role: user.role,
            organization_id: config.id,
            job_title: user.jobTitle,
          })
          .eq('id', existingProfile.id);
        
        console.log(`    ✓ ${user.fullName} (${user.role})`);
      }
    }
  }
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║     ClarityClaim AI - Demo Data Seeding Script                 ║');
  console.log('║     Generating synthetic data for investor/customer demos      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  try {
    // Step 1: Create payers (shared across tenants)
    const payerIds = await createPayers();
    
    // Step 2: Create AI model registry
    await createAIModels();
    
    // Step 3: Create tenants and their data
    for (const config of TENANT_CONFIGS) {
      const orgId = await createTenant(config, payerIds);
      
      if (orgId) {
        // Get facility IDs for this org
        const { data: facilities } = await supabase
          .from('facilities')
          .select('id')
          .eq('organization_id', orgId);
        
        const facilityIds = facilities?.map(f => f.id) || [];
        
        // Generate claims
        const { claimIds, deniedClaimIds } = await generateClaimsForTenant(
          config,
          payerIds,
          facilityIds
        );
        
        // Generate appeals for denied claims
        await generateAppealsForDeniedClaims(config, deniedClaimIds);
        
        // Generate AI insights
        await generateAIInsights(config, claimIds);
        
        // Generate equity signals (Unity only)
        await generateEquitySignals(config, claimIds);
        
        // Generate audit logs
        await generateAuditLogs(config);
      }
    }
    
    // Step 4: Create hero demo scenarios
    await createHeroClaims();
    
    // Step 5: Create admin user
    await createAdminUser();
    
    // Step 6: Create demo users for each tenant
    await createDemoUsers(TENANT_CONFIGS);
    
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║     ✅ Demo data seeding complete!                             ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    
    console.log('\n📊 Summary:');
    console.log(`  • ${TENANT_CONFIGS.length} organizations created`);
    console.log(`  • ${PAYER_CONFIGS.length} payers created`);
    console.log(`  • ${TENANT_CONFIGS.reduce((sum, c) => sum + c.facilities.length, 0)} facilities created`);
    console.log(`  • ${TENANT_CONFIGS.reduce((sum, c) => sum + c.claimVolume, 0)} total claims generated`);
    console.log('  • AI models, insights, equity signals, and audit logs generated');
    console.log('  • 5 hero demo scenarios created');
    
    console.log('\n🔐 Next Steps:');
    console.log('  1. Sign up with admin@clarityclaim.ai');
    console.log('  2. Run SQL to grant admin privileges (see output above)');
    console.log('  3. Navigate to /app/admin to access admin features');
    
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();

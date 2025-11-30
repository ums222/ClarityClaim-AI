# ClarityClaim AI - Demo Data Scripts

This directory contains scripts for seeding and managing demo data for the ClarityClaim AI platform.

## seed-demo-data.ts

A comprehensive script that generates synthetic demo data for showcasing all product capabilities to investors and potential customers.

### What It Creates

1. **Demo Tenants (Organizations)**
   - **Aegis Health System** - Large IDN with 4 facilities, enterprise tier
   - **Unity Community Care Network** - FQHC/safety-net with 3 facilities
   - **Sunrise Pediatrics Group** - Specialty practice with 2 facilities

2. **Payers**
   - Medicare FFS
   - Medicare Advantage (Aetna, UnitedHealthcare)
   - Medicaid State Plan
   - Commercial (BCBS, Cigna, UHC)
   - Marketplace/Exchange plans

3. **Synthetic Claims (~1,600 total)**
   - Realistic denial patterns based on:
     - Synthea synthetic patient generator
     - CMS Medicare Claims Synthetic PUFs
     - AHRQ SyH-DR
   - Denial categories: Authorization, Medical Necessity, Coding, Timely Filing, etc.
   - Financial data with realistic amounts

4. **Appeals for Denied Claims**
   - ~55% of denied claims have appeals
   - AI-generated appeal letters
   - Outcome tracking (approved, partially approved, denied)

5. **AI Insights**
   - Denial risk predictions
   - Top risk factors
   - Suggested actions

6. **Equity Signals (for Unity tenant)**
   - Disparity analysis by ZIP code, income bracket, payer type
   - Flagged claims with equity concerns

7. **Hero Demo Scenarios**
   - High-dollar oncology appeal (AI success story)
   - Equity analytics in action
   - Pre-submission prevention
   - Root cause analysis
   - Multi-level appeal ROI tracking

8. **Audit Logs**
   - AI actions (denial risk, appeal generation)
   - PHI access logs
   - HIPAA-compliant audit trail

### Prerequisites

1. **Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Database Migration**
   Run the migration `011_create_admin_demo_tables.sql` in your Supabase SQL editor before seeding.

### Usage

```bash
# Run the seed script
npm run seed:demo

# Or directly with tsx
npx tsx scripts/seed-demo-data.ts
```

### Admin User Setup

After running the seed script:

1. Sign up with email: `admin@clarityclaim.ai`
2. Run the following SQL to grant admin privileges:
   ```sql
   UPDATE user_profiles 
   SET is_system_admin = true, 
       can_access_all_tenants = true,
       role = 'super_admin'
   WHERE email = 'admin@clarityclaim.ai';
   ```

### Data Sources (Inspiration Only)

The distributions and structures are inspired by (no real data copied):

- **Synthea** - https://synthea.mitre.org/
- **CMS SynPUFs** - https://www.cms.gov/data-research/statistics-trends-and-reports/medicare-claims-synthetic-public-use-files
- **AHRQ SyH-DR** - https://www.ahrq.gov/data/innovations/syh-dr.html
- **X12 CARC Codes** - https://x12.org/codes/claim-adjustment-reason-codes

### Customization

To modify the demo data:

1. Edit `TENANT_CONFIGS` for organization settings
2. Edit `PAYER_CONFIGS` for payer list
3. Edit `DENIAL_REASONS` and `DENIAL_CATEGORIES` for denial patterns
4. Edit `DEMO_USERS` for user personas
5. Adjust claim volume in `claimVolume` property per tenant

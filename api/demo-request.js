import { demoRequestsService } from './lib/database.js';
import { syncDemoRequestToHubSpot } from './lib/hubspot.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    }

    // Sync to HubSpot CRM
    try {
      const { contact, deal, error: hubspotError } = await syncDemoRequestToHubSpot({
        fullName,
        email,
        organizationName,
        organizationType,
        monthlyClaimVolume
      });
      
      if (hubspotError) {
        console.error('HubSpot sync error:', hubspotError);
      } else if (contact) {
        console.log('✅ Synced to HubSpot - Contact:', contact.id);
      }
    } catch (hubspotErr) {
      console.error('HubSpot sync failed:', hubspotErr);
    }

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
}

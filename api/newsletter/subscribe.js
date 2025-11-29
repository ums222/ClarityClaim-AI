import { newsletterService } from '../lib/database.js';

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
}

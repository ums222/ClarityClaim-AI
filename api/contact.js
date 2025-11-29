import { contactSubmissionsService } from './lib/database.js';

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
}

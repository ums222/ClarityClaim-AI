import { createClient } from '@supabase/supabase-js';

// Create Supabase client for verifying JWT tokens
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Middleware to verify JWT token and attach user to request
 * Use this for protected routes that require authentication
 */
export async function requireAuth(req, res, next) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Supabase not configured - authentication disabled');
      return res.status(500).json({
        error: 'Authentication service not configured'
      });
    }

    // Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header'
      });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Attach the user to the request object
    req.user = user;

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication failed'
    });
  }
}

/**
 * Optional auth middleware - attaches user if token is present but doesn't require it
 * Use this for routes that have different behavior for authenticated vs unauthenticated users
 */
export async function optionalAuth(req, res, next) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return next();
    }

    // Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue without user
      return next();
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!error && user) {
      // Attach the user to the request object
      req.user = user;
    }

    next();
  } catch (error) {
    // Don't fail on auth errors - just continue without user
    console.warn('Optional auth error:', error.message);
    next();
  }
}

export default { requireAuth, optionalAuth };

import supabase, { isSupabaseConfigured } from './supabase.js';

/**
 * Database service for demo requests
 */
export const demoRequestsService = {
  /**
   * Create a new demo request
   * @param {Object} data - Demo request data
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async create(data) {
    if (!isSupabaseConfigured()) {
      console.log('📝 Supabase not configured - demo request logged only');
      return { 
        data: { 
          id: `local-${Date.now()}`, 
          ...data,
          created_at: new Date().toISOString() 
        }, 
        error: null 
      };
    }

    try {
      const { data: result, error } = await supabase
        .from('demo_requests')
        .insert({
          full_name: data.fullName,
          email: data.email,
          organization_name: data.organizationName,
          organization_type: data.organizationType || null,
          monthly_claim_volume: data.monthlyClaimVolume || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      return { data: result, error: null };
    } catch (error) {
      console.error('Database error creating demo request:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all demo requests
   * @param {Object} options - Query options
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getAll(options = {}) {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      let query = supabase
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Database error fetching demo requests:', error);
      return { data: null, error };
    }
  },

  /**
   * Get a demo request by ID
   * @param {string} id - Demo request ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getById(id) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Database not configured') };
    }

    try {
      const { data, error } = await supabase
        .from('demo_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Database error fetching demo request:', error);
      return { data: null, error };
    }
  },

  /**
   * Update a demo request status
   * @param {string} id - Demo request ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async update(id, updates) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Database not configured') };
    }

    try {
      const { data, error } = await supabase
        .from('demo_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Database error updating demo request:', error);
      return { data: null, error };
    }
  }
};

/**
 * Database service for contact submissions
 */
export const contactSubmissionsService = {
  /**
   * Create a new contact submission
   * @param {Object} data - Contact submission data
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async create(data) {
    if (!isSupabaseConfigured()) {
      console.log('📝 Supabase not configured - contact submission logged only');
      return { 
        data: { 
          id: `local-${Date.now()}`, 
          ...data,
          created_at: new Date().toISOString() 
        }, 
        error: null 
      };
    }

    try {
      const { data: result, error } = await supabase
        .from('contact_submissions')
        .insert({
          name: data.name,
          email: data.email,
          subject: data.subject || null,
          message: data.message,
          source: data.source || 'website',
          status: 'unread'
        })
        .select()
        .single();

      if (error) throw error;

      return { data: result, error: null };
    } catch (error) {
      console.error('Database error creating contact submission:', error);
      return { data: null, error };
    }
  }
};

/**
 * Database service for newsletter subscribers
 */
export const newsletterService = {
  /**
   * Subscribe to newsletter
   * @param {Object} data - Subscriber data
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async subscribe(data) {
    if (!isSupabaseConfigured()) {
      console.log('📝 Supabase not configured - newsletter subscription logged only');
      return { 
        data: { 
          id: `local-${Date.now()}`, 
          email: data.email,
          subscribed: true,
          created_at: new Date().toISOString() 
        }, 
        error: null 
      };
    }

    try {
      // Use upsert to handle re-subscriptions
      const { data: result, error } = await supabase
        .from('newsletter_subscribers')
        .upsert({
          email: data.email,
          name: data.name || null,
          subscribed: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          source: data.source || 'website'
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (error) throw error;

      return { data: result, error: null };
    } catch (error) {
      console.error('Database error subscribing to newsletter:', error);
      return { data: null, error };
    }
  },

  /**
   * Unsubscribe from newsletter
   * @param {string} email - Email to unsubscribe
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async unsubscribe(email) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Database not configured') };
    }

    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({
          subscribed: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Database error unsubscribing:', error);
      return { data: null, error };
    }
  }
};

export default {
  demoRequests: demoRequestsService,
  contactSubmissions: contactSubmissionsService,
  newsletter: newsletterService
};

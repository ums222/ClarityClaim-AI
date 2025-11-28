import { supabase, isSupabaseConfigured } from './supabase';

// ============================================================================
// DEMO REQUESTS
// ============================================================================

export interface DemoRequestData {
  fullName: string;
  email: string;
  organizationName: string;
  organizationType: string;
  monthlyClaimVolume: string;
  message?: string;
}

export async function submitDemoRequest(data: DemoRequestData): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Fallback for development without Supabase
    console.log('Demo request (dev mode):', data);
    return { success: true };
  }

  try {
    const insertData = {
      full_name: data.fullName,
      email: data.email,
      organization_name: data.organizationName,
      organization_type: data.organizationType,
      monthly_claim_volume: data.monthlyClaimVolume,
      message: data.message || null,
      status: 'pending',
    };

    const { error } = await supabase.from('demo_requests').insert(insertData);

    if (error) {
      console.error('Error submitting demo request:', error);
      return { success: false, error: error.message };
    }

    // Optionally trigger email notification via edge function
    await triggerEmailNotification('demo_request', data);

    return { success: true };
  } catch (err) {
    console.error('Error submitting demo request:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

// ============================================================================
// CONTACT FORM
// ============================================================================

export interface ContactFormData {
  fullName: string;
  email: string;
  organizationName: string;
  organizationType: string;
  monthlyClaimVolume: string;
  message?: string;
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log('Contact form (dev mode):', data);
    return { success: true };
  }

  try {
    const insertData = {
      full_name: data.fullName,
      email: data.email,
      organization_name: data.organizationName,
      organization_type: data.organizationType,
      monthly_claim_volume: data.monthlyClaimVolume,
      message: data.message || null,
      status: 'new',
    };

    const { error } = await supabase.from('contact_submissions').insert(insertData);

    if (error) {
      console.error('Error submitting contact form:', error);
      return { success: false, error: error.message };
    }

    await triggerEmailNotification('contact_form', data);

    return { success: true };
  } catch (err) {
    console.error('Error submitting contact form:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

// ============================================================================
// NEWSLETTER
// ============================================================================

export async function subscribeToNewsletter(
  email: string,
  source?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log('Newsletter subscription (dev mode):', { email, source });
    return { success: true };
  }

  try {
    const insertData = {
      email,
      source: source || 'website',
      status: 'active',
    };

    const { error } = await supabase.from('newsletter_subscribers').insert(insertData);

    if (error) {
      // Check if already subscribed
      if (error.code === '23505') {
        return { success: false, error: 'This email is already subscribed.' };
      }
      console.error('Error subscribing to newsletter:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error subscribing to newsletter:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function unsubscribeFromNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log('Newsletter unsubscribe (dev mode):', email);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email);

    if (error) {
      console.error('Error unsubscribing:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error unsubscribing:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

// ============================================================================
// USER PROFILE
// ============================================================================

export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string | null;
  organization_name: string | null;
  organization_type: string | null;
  role: 'user' | 'admin';
  avatar_url: string | null;
}

export interface UserProfileUpdate {
  full_name?: string | null;
  organization_name?: string | null;
  organization_type?: string | null;
  avatar_url?: string | null;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdate
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log('Update profile (dev mode):', { userId, updates });
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error updating user profile:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

// ============================================================================
// EMAIL NOTIFICATIONS (via Edge Function)
// ============================================================================

async function triggerEmailNotification(
  type: 'demo_request' | 'contact_form',
  data: DemoRequestData | ContactFormData
): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    // This would call a Supabase Edge Function to send emails
    // For now, we'll just log it - you can implement the edge function later
    const { error } = await supabase.functions.invoke('send-notification', {
      body: { type, data },
    });

    if (error) {
      console.error('Error triggering email notification:', error);
    }
  } catch (err) {
    // Don't fail the main request if email fails
    console.error('Error triggering email notification:', err);
  }
}

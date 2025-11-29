import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration for client-side authentication
// These are public keys safe to expose in the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Create Supabase client for authentication
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  console.warn(
    'Supabase environment variables are not configured. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
  // Create a mock client that won't crash the app
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { supabase };
export default supabase;

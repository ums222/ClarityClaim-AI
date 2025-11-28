import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getUserProfile, type UserProfile } from '../lib/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const userProfile = await getUserProfile(userId);
    setProfile(userProfile);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }

      // Handle special events
      if (event === 'SIGNED_IN') {
        console.log('User signed in');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery initiated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ): Promise<{ error: AuthError | null }> => {
    if (!isSupabaseConfigured()) {
      console.log('Sign up (dev mode):', { email, metadata });
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    return { error };
  };

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    if (!isSupabaseConfigured()) {
      console.log('Sign in (dev mode):', { email });
      // Simulate successful login in dev mode
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signInWithGoogle = async (): Promise<{ error: AuthError | null }> => {
    if (!isSupabaseConfigured()) {
      console.log('Google sign in (dev mode)');
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    return { error };
  };

  const signOut = async (): Promise<void> => {
    if (!isSupabaseConfigured()) {
      console.log('Sign out (dev mode)');
      return;
    }

    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    if (!isSupabaseConfigured()) {
      console.log('Reset password (dev mode):', { email });
      return { error: null };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error };
  };

  const updatePassword = async (newPassword: string): Promise<{ error: AuthError | null }> => {
    if (!isSupabaseConfigured()) {
      console.log('Update password (dev mode)');
      return { error: null };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protecting routes
export function useRequireAuth(redirectTo = '/login') {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = redirectTo;
    }
  }, [user, loading, redirectTo]);

  return { user, loading };
}

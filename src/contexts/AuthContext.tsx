import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'owner' | 'admin' | 'manager' | 'user';
  organization_id: string | null;
  job_title: string | null;
  phone: string | null;
  timezone: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
  onboarding_completed: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string | null;
  size: string | null;
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise';
  subscription_status: 'active' | 'past_due' | 'canceled';
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  // State
  user: User | null;
  profile: UserProfile | null;
  organization: Organization | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  signUp: (email: string, password: string, fullName: string, organizationName?: string) => Promise<{ error: AuthError | Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | Error | null }>;
  
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as UserProfile;
  }, []);

  // Fetch organization from database
  const fetchOrganization = useCallback(async (orgId: string) => {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();
    
    if (error) {
      console.error('Error fetching organization:', error);
      return null;
    }
    
    return data as Organization;
  }, []);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
    
    if (profileData?.organization_id) {
      const orgData = await fetchOrganization(profileData.organization_id);
      setOrganization(orgData);
    }
  }, [user, fetchProfile, fetchOrganization]);

  // Initialize auth state
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await client.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          setProfile(profileData);
          
          if (profileData?.organization_id) {
            const orgData = await fetchOrganization(profileData.organization_id);
            setOrganization(orgData);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Defer profile fetch to avoid blocking
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
            
            if (profileData?.organization_id) {
              const orgData = await fetchOrganization(profileData.organization_id);
              setOrganization(orgData);
            }
          }, 0);
        } else {
          setProfile(null);
          setOrganization(null);
        }

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setOrganization(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, fetchOrganization]);

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    organizationName?: string
  ): Promise<{ error: AuthError | Error | null }> => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured') };
    }

    try {
      // Create the user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        return { error: signUpError };
      }

      // If organization name provided, create org and link user
      if (data.user && organizationName) {
        // Create organization
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: organizationName,
          })
          .select()
          .single();

        if (orgError) {
          console.error('Error creating organization:', orgError);
        } else if (orgData) {
          // Update user profile with organization and owner role
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
              organization_id: orgData.id,
              role: 'owner',
              full_name: fullName,
            })
            .eq('id', data.user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign in with email and password
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: AuthError | Error | null }> => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured') };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // Update last login timestamp
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await supabase
            .from('user_profiles')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', currentUser.id);
        }
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    if (!supabase) return;
    
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setOrganization(null);
    setSession(null);
    navigate('/login');
  };

  // Reset password (send reset email)
  const resetPassword = async (
    email: string
  ): Promise<{ error: AuthError | Error | null }> => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured') };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Update password
  const updatePassword = async (
    newPassword: string
  ): Promise<{ error: AuthError | Error | null }> => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured') };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Update profile
  const updateProfile = async (
    updates: Partial<UserProfile>
  ): Promise<{ error: Error | null }> => {
    if (!supabase || !user) {
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        await refreshProfile();
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    organization,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Check if Supabase Auth is available
export function useSupabaseAuth() {
  return {
    isConfigured: isSupabaseConfigured(),
    supabase,
  };
}

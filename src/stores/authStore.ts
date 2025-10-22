import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useUserProfileStore } from './userProfileStore';
import { useEcosystemStore } from './ecosystemStore';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  showOnboarding: boolean;
  loading: boolean;

  // Auth methods
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;

  // Legacy methods for compatibility
  login: (options?: { isNew?: boolean }) => void;
  logout: () => void;
  completeOnboarding: () => void;

  // Internal setters
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  showOnboarding: false,
  loading: true,
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  ...initialState,

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();

      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        loading: false,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
        });
      });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({ id: data.user.id });

        if (profileError) {
          console.error('Failed to create user profile:', profileError);
        }

        set({
          user: data.user,
          session: data.session,
          isAuthenticated: !!data.session,
          showOnboarding: true,
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        isAuthenticated: true,
        showOnboarding: false,
      });

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();

      // Clear all user-related data from other stores
      useUserProfileStore.getState().clear();
      useEcosystemStore.getState().clear();

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        showOnboarding: false,
      });

      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  // Legacy methods for backward compatibility
  login: (options) => {
    set({
      isAuthenticated: true,
      showOnboarding: options?.isNew || false,
    });
  },

  logout: async () => {
    await get().signOut();
  },

  completeOnboarding: () => set({ showOnboarding: false }),

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session, isAuthenticated: !!session }),
}));
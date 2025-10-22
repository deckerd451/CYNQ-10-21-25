import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to handle Supabase errors
export function handleSupabaseError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unknown error occurred');
}

// Type guard for Supabase error responses
export function isSupabaseError(error: unknown): error is { message: string; code?: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

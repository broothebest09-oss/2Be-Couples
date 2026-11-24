import { createClient } from '@supabase/supabase-js';

// Read from Vite environment variables or localStorage (allows easy testing in production)
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('2be_supabase_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('2be_supabase_anon_key') || '' : '';

export const SUPABASE_URL = (envUrl || storedUrl).trim();
export const SUPABASE_ANON_KEY = (envKey || storedKey).trim();

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_URL.includes('your-project-url')
);

// Fallback dummy client if credentials aren't set yet, to prevent app crashing
const dummyClient = {
  auth: {
    async getSession() { return { data: { session: null }, error: null }; },
    onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
    async signInWithOtp() { throw new Error('Supabase not configured'); },
    async verifyOtp() { throw new Error('Supabase not configured'); },
    async signOut() { return { error: null }; },
  },
  from() {
    return {
      select() { return this; },
      insert() { return this; },
      update() { return this; },
      delete() { return this; },
      eq() { return this; },
      order() { return this; },
      single() { return Promise.resolve({ data: null, error: null }); },
      then(resolve: any) { resolve({ data: [], error: null }); }
    };
  },
  channel() {
    return {
      on() { return this; },
      subscribe() { return this; },
      unsubscribe() {}
    };
  }
} as any;

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : dummyClient;

export function configureSupabaseCredentials(url: string, key: string) {
  localStorage.setItem('2be_supabase_url', url.trim());
  localStorage.setItem('2be_supabase_anon_key', key.trim());
  window.location.reload();
}

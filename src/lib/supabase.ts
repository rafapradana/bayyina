import { createClient } from '@supabase/supabase-js';

// Variabel-variabel ini harus diganti dengan nilai sebenarnya dari dashboard Supabase Anda
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fungsi untuk login dengan Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  return { data, error };
};

// Fungsi untuk logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Fungsi untuk mendapatkan session user saat ini
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

// Fungsi untuk mendapatkan user saat ini
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}; 
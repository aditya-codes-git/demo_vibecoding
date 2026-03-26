import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isRealUrl = supabaseUrl.startsWith('http') && !supabaseUrl.includes('your_supabase_project_url');

// Initialize Supabase only if credentials exist and are valid URLs to prevent crashing on launch
export const supabase = (isRealUrl && supabaseAnonKey && !supabaseAnonKey.includes('your_supabase_anon_key')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      auth: { 
        getUser: async () => ({ data: { user: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => ({ error: new Error('Supabase URL/Key missing in .env') }),
        signOut: async () => ({ error: null })
      },
      from: () => ({ 
        select: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }) }),
        insert: () => Promise.resolve({ error: new Error('Supabase URL/Key missing in .env') })
      })
    };

/**
 * Fetch the most recent excuses for a given user.
 * @param {string} userId
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchRecentExcuses(userId, limit = 5) {
  const { data, error } = await supabase
    .from('excuses')
    .select('situation, excuse, mode, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching excuses:', error);
    return [];
  }
  return data;
}

/**
 * Save a generated excuse to the database.
 * @param {{ userId: string, situation: string, excuse: string, mode: string }} params
 */
export async function saveExcuse({ userId, situation, excuse, mode }) {
  const { error } = await supabase
    .from('excuses')
    .insert([{ user_id: userId, situation, excuse, mode }]);

  if (error) {
    console.error('Error saving excuse:', error);
  }
}

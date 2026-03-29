import { createClient } from '@supabase/supabase-js';
import { requireSupabaseConfig } from '@/lib/supabase/config';

export const createSupabaseAdmin = () => {
  const { url, serviceRoleKey } = requireSupabaseConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};

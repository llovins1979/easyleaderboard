export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

export const isSupabaseConfigured = () =>
  Boolean(supabaseConfig.url && supabaseConfig.anonKey && supabaseConfig.serviceRoleKey);

export const requireSupabaseConfig = () => {
  if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  return {
    url: supabaseConfig.url,
    serviceRoleKey: supabaseConfig.serviceRoleKey
  };
};

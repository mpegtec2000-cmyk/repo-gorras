import { createClient } from "@supabase/supabase-js";

function pickBestKey(...candidates: (string | undefined)[]): string {
  // 1. Dar prioridad a las nuevas claves oficiales con prefijo sb_
  for (const c of candidates) {
    if (c && c.trim().startsWith("sb_")) {
      return c.trim();
    }
  }
  // 2. Descartar los tokens JWT caducados que arrojaban 'Invalid API key'
  for (const c of candidates) {
    if (c && !c.includes("yL8X-Gs0Lht_xKQ5oE7j_OvEDl0iBv93Ynw3p3xEve0") && !c.includes("a_w9zhheiG1rsVI4G94RUuRzMHHc-GKgWfZcdaZ-6Xg")) {
      const trimmed = c.trim();
      if (trimmed.length > 10) return trimmed;
    }
  }
  return "";
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uscjvmwknetmwwnxhtux.supabase.co";

const supabaseAnonKey = pickBestKey(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  process.env.SUPABASE_PUBLISHABLE_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  process.env.SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to create server-side client with service role / secret key
export function getServiceSupabase() {
  const serviceKey = pickBestKey(
    process.env.SUPABASE_SECRET_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey
  );

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

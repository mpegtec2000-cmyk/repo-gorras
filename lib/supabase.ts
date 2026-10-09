import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uscjvmwknetmwwnxhtux.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2p2bXdrbmV0bXd3bnhodHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNTY4MjcsImV4cCI6MjEwNzczMjgyN30.yL8X-Gs0Lht_xKQ5oE7j_OvEDl0iBv93Ynw3p3xEve0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to create server-side client with service role key if needed
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.");
  }
  return createClient(supabaseUrl, serviceKey);
}

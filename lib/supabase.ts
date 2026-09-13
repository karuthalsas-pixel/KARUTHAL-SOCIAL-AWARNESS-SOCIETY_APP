import { createClient } from "@supabase/supabase-js";

// We use the service_role key to bypass RLS for server-side uploads.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase URL or Service Role Key in environment variables.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

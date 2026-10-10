import { createClient } from "@supabase/supabase-js";

/** Browser + server: uses the public anon key. Safe in client components. */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

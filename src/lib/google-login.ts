"use client";
// Organiser signs in with Google through Supabase Auth and grants Drive access.
// drive.file = the app can only touch files it created (or the user picked) — enough for the demo
// because the app creates each role's Docs/Sheets itself. No Google verification needed for test users.
import { supabase } from "./supabase";

export async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes: "https://www.googleapis.com/auth/drive.file",
      queryParams: { access_type: "offline", prompt: "consent" },
      redirectTo: `${window.location.origin}/`,
    },
  });
}

/** Pass this to /api/role-pack/apply and /revoke as google_token. Expires after ~1 hour: sign in again if Drive calls fail. */
export async function getGoogleToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.provider_token ?? null;
}

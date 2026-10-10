// POST /api/role-pack/revoke { person_role_id, google_token } → removes all Drive access from that role
import { NextResponse } from "next/server";
import { revokeAccess } from "@/lib/google-drive";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const { person_role_id, google_token } = await req.json();
  const { data: grants } = await supabaseAdmin
    .from("file_grants")
    .select("id, drive_permission_id, role_files(drive_file_id)")
    .eq("person_role_id", person_role_id)
    .is("revoked_at", null);

  let revoked = 0;
  const errors: string[] = [];
  for (const g of grants ?? []) {
    try {
      const fileId = (g.role_files as unknown as { drive_file_id: string }).drive_file_id;
      await revokeAccess(google_token, fileId, g.drive_permission_id);
      await supabaseAdmin.from("file_grants").update({ revoked_at: new Date().toISOString() }).eq("id", g.id);
      revoked++;
    } catch (e) {
      errors.push(String(e));
    }
  }
  await supabaseAdmin.from("person_roles").update({ revoked_at: new Date().toISOString() }).eq("id", person_role_id);
  return NextResponse.json({ revoked, errors });
}

// GET /api/guides — first-time guides, ordered. Added by frontend (P3) so the
// guides page can read them without a service key.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("guides")
    .select("slug, title, body_md, emoji, order")
    .order("order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 });
  }
  return NextResponse.json(data);
}

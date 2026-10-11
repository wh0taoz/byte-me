// POST /api/going/attended — "I was there". Marks the going row attended and
// counts a step (profiles.steps + 1). Idempotent: re-marking doesn't double-count.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  let body: { going_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: 400 }, { status: 400 });
  }
  if (!body.going_id) {
    return NextResponse.json({ error: "going_id is required", code: 400 }, { status: 400 });
  }

  const { data: row, error } = await supabaseAdmin
    .from("going")
    .select("id, profile_id, attended")
    .eq("id", body.going_id)
    .maybeSingle();
  if (error || !row) {
    console.error("[going] attended lookup failed:", error?.message ?? "not found");
    return NextResponse.json(
      { error: "We couldn't find that plan — refresh the page and try again.", code: 404 },
      { status: 404 },
    );
  }
  if (row.attended) return NextResponse.json({ ok: true }); // already counted

  const { error: updateError } = await supabaseAdmin
    .from("going")
    .update({ attended: true })
    .eq("id", row.id);
  if (updateError) {
    console.error("[going] attended update failed:", updateError.message);
    return NextResponse.json(
      { error: "We couldn't save that right now — please try again.", code: 500 },
      { status: 500 },
    );
  }

  // steps + 1 (read-modify-write — fine for the demo scale)
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("steps")
    .eq("id", row.profile_id)
    .maybeSingle();
  const { error: stepsError } = await supabaseAdmin
    .from("profiles")
    .update({ steps: (profile?.steps ?? 0) + 1 })
    .eq("id", row.profile_id);
  if (stepsError) console.error("[going] steps increment failed:", stepsError.message);

  return NextResponse.json({ ok: true });
}

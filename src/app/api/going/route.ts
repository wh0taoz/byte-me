// POST /api/going — mark going. First-timers get paired with another unpaired
// first-timer for the same event (buddy_profile_id linked both ways).
// GET /api/going?profile_id= — the profile's going rows with event data (My events).
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const profileId = searchParams.get("profile_id");
  if (!profileId) {
    return NextResponse.json({ error: "profile_id is required", code: 400 }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("going")
    .select(
      "id, first_timer, buddy_profile_id, attended, created_at, events(id, title, organizer, type, level, city, starts_at, ends_at, venue, registration_url, description, what_to_expect, ai_summary, ai_level_suggestion, created_at)",
    )
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  let body: { event_id?: string; profile_id?: string; first_timer?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: 400 }, { status: 400 });
  }

  const { event_id, profile_id, first_timer } = body;
  if (!event_id || !profile_id || typeof first_timer !== "boolean") {
    return NextResponse.json(
      { error: "event_id, profile_id and first_timer (boolean) are required", code: 400 },
      { status: 400 }
    );
  }

  const { data: going, error } = await supabaseAdmin
    .from("going")
    .insert({ event_id, profile_id, first_timer, buddy_profile_id: null })
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 });
  }

  let buddy: { nickname: string } | null = null;
  if (first_timer) {
    const { data: candidate } = await supabaseAdmin
      .from("going")
      .select("id, profile_id")
      .eq("event_id", event_id)
      .eq("first_timer", true)
      .is("buddy_profile_id", null)
      .neq("profile_id", profile_id)
      .limit(1)
      .maybeSingle();

    if (candidate) {
      const [mine, theirs] = await Promise.all([
        supabaseAdmin.from("going").update({ buddy_profile_id: candidate.profile_id }).eq("id", going.id),
        supabaseAdmin.from("going").update({ buddy_profile_id: profile_id }).eq("id", candidate.id),
      ]);
      const updateError = mine.error ?? theirs.error;
      if (updateError) {
        return NextResponse.json({ error: updateError.message, code: 500 }, { status: 500 });
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("nickname")
        .eq("id", candidate.profile_id)
        .maybeSingle();
      if (profile) buddy = { nickname: profile.nickname };
    }
  }

  return NextResponse.json({ going: { id: going.id }, buddy });
}

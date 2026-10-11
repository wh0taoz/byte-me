// POST   /api/going — mark going (idempotent per profile+event). First-timers
// get paired with another unpaired first-timer (buddy_profile_id linked both
// ways, oldest waiting first so demo pairings are predictable).
// GET    /api/going?profile_id= — the profile's going rows with event data and
// buddy nicknames (My events, "already going" check on the detail page).
// DELETE /api/going?event_id=&profile_id= — un-going. If a buddy was paired,
// the link is cleared on both sides so the other person is free to re-pair.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EVENT_FIELDS =
  "id, title, organizer, type, level, city, starts_at, ends_at, venue, registration_url, description, what_to_expect, ai_summary, ai_level_suggestion, created_at";

async function buddyNickname(buddyProfileId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("nickname")
    .eq("id", buddyProfileId)
    .maybeSingle();
  return data?.nickname ?? null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const profileId = searchParams.get("profile_id");
  if (!profileId) {
    return NextResponse.json({ error: "profile_id is required", code: 400 }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("going")
    .select(`id, first_timer, buddy_profile_id, attended, created_at, events(${EVENT_FIELDS})`)
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[going] list failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't load your plan right now — please try again.", code: 500 },
      { status: 500 },
    );
  }

  const rows = data ?? [];
  const buddyIds = [...new Set(rows.map((r) => r.buddy_profile_id).filter((b): b is string => !!b))];
  const nicknames = new Map<string, string>();
  if (buddyIds.length) {
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, nickname")
      .in("id", buddyIds);
    for (const p of profiles ?? []) nicknames.set(p.id, p.nickname);
  }

  return NextResponse.json(
    rows.map((r) => ({ ...r, buddy_nickname: r.buddy_profile_id ? (nicknames.get(r.buddy_profile_id) ?? null) : null })),
  );
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
      { status: 400 },
    );
  }
  if (!UUID.test(event_id) || !UUID.test(profile_id)) {
    return NextResponse.json(
      { error: "That event or profile doesn't look right — refresh the page and try again.", code: 400 },
      { status: 400 },
    );
  }

  // Already going? Return the existing row — a reload or double-click must not
  // create a second row or trigger a new pairing.
  const { data: existing } = await supabaseAdmin
    .from("going")
    .select("id, buddy_profile_id")
    .eq("event_id", event_id)
    .eq("profile_id", profile_id)
    .maybeSingle();
  if (existing) {
    const nickname = existing.buddy_profile_id ? await buddyNickname(existing.buddy_profile_id) : null;
    return NextResponse.json({ going: { id: existing.id }, buddy: nickname ? { nickname } : null });
  }

  const { data: going, error } = await supabaseAdmin
    .from("going")
    .insert({ event_id, profile_id, first_timer, buddy_profile_id: null })
    .select("id")
    .single();
  if (error) {
    console.error("[going] insert failed:", error.message);
    if (/violates foreign key/.test(error.message)) {
      return NextResponse.json(
        { error: "We couldn't find your profile — refresh the page and try again.", code: 422 },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { error: "We couldn't save that right now — please try again.", code: 500 },
      { status: 500 },
    );
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
      .order("created_at", { ascending: true }) // oldest waiter first — deterministic pairing
      .limit(1)
      .maybeSingle();

    if (candidate) {
      const [mine, theirs] = await Promise.all([
        supabaseAdmin.from("going").update({ buddy_profile_id: candidate.profile_id }).eq("id", going.id),
        supabaseAdmin.from("going").update({ buddy_profile_id: profile_id }).eq("id", candidate.id),
      ]);
      const updateError = mine.error ?? theirs.error;
      if (updateError) {
        console.error("[going] buddy link failed:", updateError.message);
        return NextResponse.json(
          { error: "You're going! We couldn't pair your buddy right now — check My events in a moment.", code: 500 },
          { status: 500 },
        );
      }

      const nickname = await buddyNickname(candidate.profile_id);
      if (nickname) buddy = { nickname };
    }
  }

  return NextResponse.json({ going: { id: going.id }, buddy });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const event_id = searchParams.get("event_id");
  const profile_id = searchParams.get("profile_id");
  if (!event_id || !profile_id) {
    return NextResponse.json({ error: "event_id and profile_id are required", code: 400 }, { status: 400 });
  }
  if (!UUID.test(event_id) || !UUID.test(profile_id)) {
    return NextResponse.json(
      { error: "That event or profile doesn't look right — refresh the page and try again.", code: 400 },
      { status: 400 },
    );
  }

  const { data: row } = await supabaseAdmin
    .from("going")
    .select("id, buddy_profile_id")
    .eq("event_id", event_id)
    .eq("profile_id", profile_id)
    .maybeSingle();
  if (!row) return NextResponse.json({ ok: true }); // nothing to remove — already fine

  if (row.buddy_profile_id) {
    const { error: clearError } = await supabaseAdmin
      .from("going")
      .update({ buddy_profile_id: null })
      .eq("event_id", event_id)
      .eq("profile_id", row.buddy_profile_id);
    if (clearError) console.error("[going] buddy unlink failed:", clearError.message);
  }

  const { error } = await supabaseAdmin.from("going").delete().eq("id", row.id);
  if (error) {
    console.error("[going] delete failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't remove that right now — please try again.", code: 500 },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}

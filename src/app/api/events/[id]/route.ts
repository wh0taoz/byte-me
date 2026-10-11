// GET /api/events/[id] — single event. First read generates ai_summary via
// Gemma and caches it in the column; later reads return the cached row.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { eventSummary, type AiSummary } from "@/lib/gemma";

export const maxDuration = 30;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Never cached — if Gemma fails we say so kindly and retry on the next read.
const FALLBACK_SUMMARY: AiSummary = {
  what_to_expect: "I couldn't load the AI summary right now — try again in a moment.",
  is_this_for_me: "",
  key_terms: [],
  prior_knowledge: [],
  bring: [],
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // A non-UUID id makes Postgres throw "invalid input syntax" — reject it
  // up front instead of leaking a raw database error for typo'd/stale URLs.
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid event id", code: 400 }, { status: 400 });
  }

  const { data: event, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[events] detail failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't load this event right now — please try again.", code: 500 },
      { status: 500 },
    );
  }
  if (!event) {
    return NextResponse.json({ error: "Event not found", code: 404 }, { status: 404 });
  }

  if (event.ai_summary) {
    return NextResponse.json(event);
  }

  const summary = await eventSummary({
    title: event.title,
    type: event.type,
    description: String(event.description ?? ""),
    level: event.level,
    date: event.starts_at,
    location: [event.city, event.venue].filter(Boolean).join(", "),
    agenda: (event.what_to_expect ?? []).join("\n"),
  });

  if (summary) {
    await supabaseAdmin.from("events").update({ ai_summary: summary }).eq("id", id);
    return NextResponse.json({ ...event, ai_summary: summary });
  }

  return NextResponse.json({ ...event, ai_summary: FALLBACK_SUMMARY, fallback: true });
}

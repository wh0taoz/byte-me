// Shared types for SCOUT — mirrors supabase/schema-esc.sql.

export type Level = "beginner" | "intermediate" | "expert";
export type EventType = "hackathon" | "meetup" | "seminar" | "workshop" | "conference";
export type TeamPostKind = "looking_for_team" | "looking_for_member";

/** ai_summary jsonb — the shape src/lib/gemma.ts eventSummary() writes and caches. */
export interface AiSummary {
  what_to_expect: string; // 2–3 plain sentences
  is_this_for_me: string; // who the event is for
  key_terms: { term: string; explanation: string }[]; // 3–6 terms
  prior_knowledge: string[]; // empty array = nothing needed
  bring: string[]; // empty array = not mentioned
}

export interface EventRow {
  id: string;
  title: string;
  organizer: string;
  type: EventType;
  level: Level;
  city: string;
  starts_at: string;
  ends_at: string | null;
  venue: string | null;
  registration_url: string | null;
  description: string;
  what_to_expect: string[] | null;
  ai_summary: AiSummary | null;
  ai_level_suggestion: string | null;
  created_at: string;
}

export interface GuideRow {
  slug: string;
  title: string;
  body_md: string;
  emoji: string | null;
  order: number | null;
}

export interface ProfileRow {
  id: string;
  nickname: string;
  level: Level | null;
  interests: string[] | null;
  first_timer: boolean | null;
  steps: number | null;
  created_at: string;
}

export interface GoingResult {
  going: { id: string };
  // intro is set only on a fresh pairing — the idempotent replay omits it.
  buddy: { nickname: string; intro?: string } | null;
}

// ---- API contracts ----
// GET  /api/events?level=&type=&city=        -> EventRow[]
// GET  /api/events/[id]                      -> EventRow (generates + caches ai_summary)
// GET  /api/events/[id]/ics                  -> text/calendar (download)
// POST /api/explain { messages, event_id?, level } -> { reply, fallback? }
// POST /api/simplify { text, level }         -> { text, fallback? }
// POST /api/going { event_id, profile_id, first_timer } -> GoingResult
// DELETE /api/going?event_id=&profile_id=    -> { ok: true } (clears buddy links)
// POST /api/going/attended { going_id }      -> { ok: true } (profiles.steps + 1)
// GET  /api/guides                           -> GuideRow[]
// GET  /api/profiles                         -> ProfileRow[]
// POST /api/profiles { nickname, level?, first_timer? } -> ProfileRow

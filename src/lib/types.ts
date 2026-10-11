// Shared types for Every Step Counts — mirrors supabase/schema-esc.sql.

export type Level = "beginner" | "intermediate" | "expert";
export type EventType = "hackathon" | "meetup" | "seminar" | "workshop" | "conference";
export type TeamPostKind = "looking_for_team" | "looking_for_member";

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
  ai_summary: {
    summary?: string;
    prior_knowledge?: string[];
    key_terms?: { term: string; meaning: string }[];
  } | null;
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
  buddy: { nickname: string } | null;
}

// ---- API contracts ----
// GET  /api/events?level=&type=&city=        -> EventRow[]
// GET  /api/events/[id]                      -> EventRow
// GET  /api/events/[id]/ics                  -> text/calendar (download)
// POST /api/going { event_id, profile_id, first_timer } -> GoingResult
// GET  /api/guides                           -> GuideRow[]
// GET  /api/profiles                         -> ProfileRow[]
// POST /api/profiles { nickname, level?, first_timer? } -> ProfileRow

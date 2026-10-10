# byte-me — AI Agent Context

## Project
"Every Step Counts": all tech events in one place, labeled by difficulty
(beginner / intermediate / expert), with Gemma explaining everything to a
beginner — without judgment. The test for every feature: does it reduce
the fear of the first step? Stack: Next.js (App Router, TypeScript,
Tailwind v4), Supabase (Postgres), Gemma via Google AI Studio API,
deployed on Vercel.

## Status
Pivoted on 10 Oct 2026 evening from the old "organiser platform" (Role
Packs). Authoritative scope + contracts: `00-TEAM-SPLIT.md` (repo root),
plus `P1-ml-and-pitch.md`, `P2-backend.md`, `P3-frontend.md`. Old
organiser routes and unused lib files were removed (commit dbb2d54); old
organiser tables remain in Supabase (kept, harmless) — do not resurrect
either.

## Data model (LOCKED — do not change without team agreement)
- events: id, title, organizer, type (hackathon|meetup|seminar|workshop|
  conference), level (beginner|intermediate|expert), city, starts_at,
  ends_at, venue, registration_url, description, what_to_expect[],
  ai_summary jsonb, ai_level_suggestion, created_at
- guides: slug (pk), title, body_md, emoji, "order"
- profiles: id, nickname, level, interests[], first_timer (bool), steps
- going: id, event_id, profile_id, first_timer, buddy_profile_id,
  attended, created_at
- team_posts: id, event_id, kind (looking_for_team|looking_for_member),
  nickname, level, skills[], message, contact, created_at

`ai_summary` jsonb shape:
`{ summary, key_terms: [{term, explanation}], prior_knowledge: [],
good_for_beginners_because }`

## API routes
Live:
- GET /api/health → {ok: true}
- GET /api/events → Event[] sorted by starts_at asc; filters
  ?level=&type=&city=
- GET /api/events/[id] → Event (ai_summary may be null; generation +
  caching lands with the AI pass)

Planned (P2, contracts in 00-TEAM-SPLIT.md):
- POST /api/explain, POST /api/simplify, POST /api/going,
  GET /api/events/[id]/ics; light: POST /api/events,
  POST /api/going/attended
- team_posts: P3 reads/writes directly with the Supabase browser client
  (no route of our own)

## Conventions
- Dates: ISO 8601
- All API routes return JSON; lists are bare arrays (Event[]), single
  resources are bare objects (Event)
- Error format: {error: string, code: number}
- Every AI output is labeled: "AI summary — may contain errors."
- If Gemma fails: friendly fallback text + `fallback: true`, status 200 —
  the UI must never show a raw error in the demo
- Gemma prompts live as functions in src/lib/gemma.ts (P1 owns them);
  routes call the functions. Change a prompt without touching a route.
- `export const maxDuration = 30` on AI routes (Gemma is slow; Vercel)
- service_role key: backend only, NEVER in frontend
- Gemma never writes to the database directly — it produces, our route
  code saves

## Out of scope (do not build)
- Login / accounts (demo profile = localStorage + a profiles row)
- Scraping or Meetup/Luma import (events are entered manually)
- Matching algorithm (buddy pairing is a simple first-timer lookup)
- Self-hosting Gemma (production plan only; hackathon uses the hosted API)
- Native app
- Monetization
- Social features (feeds, ratings, leaderboards)

## Rules
- Feature freeze at Hour 04:00 (adjusted from 06:00); first deploy at
  Hour 00:30 (moved up from 01:30)
- Every AI result can be overridden (e.g. organizer confirms the
  suggested level in the UI)
- 00-TEAM-SPLIT.md wins on any scope or contract disagreement

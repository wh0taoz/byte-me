# SCOUT — AI Agent Context

## Project
SCOUT ("Every step counts"): all tech events in one place, labeled by difficulty
(beginner / intermediate / expert), with Gemma explaining everything to a
beginner — without judgment. The test for every feature: does it reduce
the fear of the first step? Stack: Next.js (App Router, TypeScript,
Tailwind v4), Supabase (Postgres), Gemma via Google AI Studio API.
Deployment: localhost only for hackathon demo (video-first pitch, no
live demo).

## Status
Pivoted on 10 Oct 2026 evening from the old "organiser platform" (Role
Packs). Authoritative scope + contracts: `00-TEAM-SPLIT.md` (repo root),
plus `P1-ml-and-pitch.md`, `P2-backend.md`, `P3-frontend.md`. Old
organiser routes and unused lib files were removed (commit dbb2d54); old
organiser tables remain in Supabase (kept, harmless) — do not resurrect
either.

11 Oct 2026: `origin/homepage` (the whole P3 frontend) is merged to main
and the UX holes are fixed. Chat is unified on POST /api/explain — the
old /api/chat route is deleted; do not resurrect it. Frontend pages:
`/`, `/events/[id]`, `/guides`, `/saved`, `/my-events`, `/ask-pip`,
`/profile`.

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

`ai_summary` jsonb shape (P1's `AiSummary` interface in src/lib/gemma.ts):
`{ what_to_expect: string (2–3 sentences), is_this_for_me: string,
key_terms: [{term, explanation}], prior_knowledge: string[],
bring: string[] }`

## API routes
Live:
- GET /api/health → {ok, gemma, supabase}
- GET /api/events → Event[] sorted by starts_at asc; filters
  ?level=&type=&city= (city is case-insensitive)
- GET /api/events/[id] → Event (generates + caches ai_summary on first
  read; friendly fallback + fallback: true if Gemma fails)
- GET /api/events/[id]/ics → .ics file (RFC 5545: DTSTAMP, folding,
  DTEND defaults +2h; slug filename)
- POST /api/explain → {reply}; {reply, fallback: true} on Gemma failure
- POST /api/simplify → {text}; {text: original, fallback: true} on failure
- POST /api/going → { going: {id}, buddy: {nickname, intro?} | null }
  (idempotent per profile+event; first-timer buddy pairing — see
  "Buddy pairing" below; intro field added by upcoming commit)
- GET /api/going?profile_id= → going rows + event data + buddy_nickname
- DELETE /api/going?event_id=&profile_id= → {ok: true} (clears buddy
  links on both sides)
- POST /api/going/attended {going_id} → {ok: true} (idempotent;
  profiles.steps + 1)
- GET /api/guides → Guide[] ordered
- GET/POST /api/profiles → list / create demo profile (nickname
  identity, no auth)
- GET /api/github/[username] → GitHub profile + recent repos
  (top languages derived; 1h in-memory cache; 400 invalid name,
  404 not found, 429 rate limit, 502 GitHub down; optional
  GITHUB_TOKEN raises 60→5000 req/h)

Planned (P2, contracts in 00-TEAM-SPLIT.md):
- light: POST /api/events (organizer form with suggestLevel)
- team_posts: P3 reads/writes directly with the Supabase browser client
  (no route of our own)

Error convention: `{error: friendly text, code}` — never raw Postgres
or SDK messages (uuid → 404, FK → 422, 5xx → friendly text; details go
to server logs only).

## Buddy pairing (POST /api/going)
- Rule-based matching, no AI for the match itself
- Hackathons: pick the first unpaired first-timer whose interests
  complement the newcomer's (overlap < min(a.length, b.length) —
  identical, covering, or empty lists never count); if nobody
  complements, fall back to the oldest waiter
- Meetups/workshops/seminars/conferences: oldest unpaired
  first-timer
- Idempotent: an existing going row is returned without re-pairing
- Response: { going: {id}, buddy: {nickname, intro?} | null }
- intro: Gemma-generated welcome message for the pair (added
  separately, upcoming commit)

## Gemma API (in src/lib/gemma.ts)

Base calls:
- `ask(system, user, opts?)` — plain-text completion; throws if Gemma
  is unreachable after retries. opts: {model?, temperature?}
- `askJSON<T>(system, user, opts?)` — parsed JSON or null, never throws

Constants: `GEMMA_FAST` = gemma-4-26b-a4b-it (chat) ·
`GEMMA_QUALITY` = gemma-4-31b-it (simplify, summaries, level
suggestions, guides).
Type `Level` = "beginner" | "intermediate" | "expert".

Route-facing prompt functions:
- `answerWithoutJudgment(question, level, eventContext?)` → string —
  chat reply with judgment-regeneration built in (the signature demo
  feature; POST /api/explain calls this — routes never reimplement
  the regen)
- `eventSummary(event: EventInput)` → AiSummary | null
- `suggestLevel(title, description)` → {level, reason} | null
- `simplify(text, level?)` → string
- `guideDraft(topic)` → markdown string

Helpers: `containsJudgment(text)` / `judgmentWords(text)` (banned-word
gate), `rewriteRequest(question, words)`.

Also exported (mentor matching, unused so far): `explainSystem(level,
eventContext?)` (internal building block of the chat prompt),
`extractTags(about)`, `shortlist(p, mentors, k?)`, `suggestMentor(p,
mentors)`, `matchEvent(participants, mentors)`, `matchIntro(p, m,
eventName)`.

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
- AI/ML matching (buddy pairing stays rule-based — see "Buddy pairing")
- Self-hosting Gemma (production plan only; hackathon uses the hosted API)
- Native app
- Monetization
- Social features (feeds, ratings, leaderboards)
- Vercel deploy for hackathon (video-first pitch)

## Rules
- Feature freeze at Hour 04:00 (adjusted from 06:00)
- No Vercel deploy for hackathon — all testing on localhost
- Every AI result can be overridden (e.g. organizer confirms the
  suggested level in the UI)
- 00-TEAM-SPLIT.md wins on any scope or contract disagreement

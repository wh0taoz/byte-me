# P2 — Backend (database, API, seed, deploy)

You own **data and routes**. P3 builds screens against your API; P1 gives you prompt functions. Read `00-TEAM-SPLIT.md` first.

## 1. Database (by 22:30)

- [ ] New migration `supabase/schema-esc.sql` with the 5 tables from the team file: `events`, `guides`, `profiles`, `going`, `team_posts`.
  - Use enums via `check` constraints (level, type, kind) like the old schema.
  - Indexes: `events(starts_at)`, `events(level)`, `going(event_id)`.
  - Open RLS "demo_all" policies like before (hackathon only).
- [ ] Drop or ignore the old organiser tables. Don't spend time migrating them.
- [ ] Realtime on `team_posts` (so new posts appear live in the demo).

## 2. Seed data (by 23:00 — the demo lives or dies on this)

- [ ] **15–20 events** across Belgrade, Novi Sad, Niš; mix of types; at least 6 beginner, 6 intermediate, 3 expert. Dates in the next 6 weeks.
  - Realistic but clearly demo data. Write descriptions the way real organizers do: some jargon-heavy, so "Say it simply" and the summary have something to do.
  - Each with `what_to_expect` in plain language (3–4 bullets: schedule, what to bring, who it's for).
- [ ] **3 guides** (P1 can draft with `guideDraft`, you insert): *What is a hackathon and what does it look like* · *What to bring to your first meetup* · *Can I come if I know nothing about the topic?*
- [ ] **4 profiles**, two of them first-timers going to the same hackathon (so buddy pairing works live).
- [ ] **5 team posts** on the main demo hackathon.
- [ ] Pre-generate `ai_summary` for every seeded event once the summary route works (so the demo never waits on Gemma).

## 3. Routes (contracts are in the team file)

| Order | Route | Notes |
| --- | --- | --- |
| 1 | `GET /api/events` | Filters `level`, `type`, `city`; sort by `starts_at`. |
| 2 | `GET /api/events/[id]` | If `ai_summary` is null → call P1's `eventSummary`, save, return. Cache = the column. |
| 3 | `POST /api/explain` | `{ messages, event_id?, level }`. Load the event if given, build system prompt with `explainSystem`, call Gemma with the last ~10 messages. If `containsJudgment(reply)`, regenerate once. |
| 4 | `POST /api/simplify` | `{ text, level }` → `simplify()`. Limit input to ~3,000 characters. |
| 5 | `POST /api/going` | Insert `going`. If `first_timer`, find another first-timer for the same event with no buddy → link them both ways → return `{ buddy: { nickname } }`. |
| 6 | `GET /api/events/[id]/ics` | Build the `.ics` text by hand (VCALENDAR / VEVENT with DTSTART, DTEND, SUMMARY, LOCATION, URL, DESCRIPTION). Header `Content-Type: text/calendar`, `Content-Disposition: attachment`. No library needed. |
| 7 *(light)* | `POST /api/events` | Organizer form: insert event, call `suggestLevel`, return the suggestion; organizer confirms the level in the UI. |
| 8 *(light)* | `POST /api/going/attended` | Mark attended → `profiles.steps += 1` (for the step streak). |

Error handling rule: if Gemma fails, return a friendly fallback (`"I couldn't load the AI summary right now — try again in a moment."`) with status 200 and a `fallback: true` flag. The UI must never show a raw error in the demo.

Gemma calls are slow (seconds). Keep `/api/explain` responses short (P1's prompt does this) and add `export const maxDuration = 30` on the AI routes for Vercel.

## 4. Deploy (by 01:30, then again at feature freeze)
- [ ] Vercel env vars: `GEMINI_API_KEY`, model names, Supabase URL + anon + service role, `NEXT_PUBLIC_APP_URL`.
- [ ] Open `/api/health` and one event page on the live URL, on a phone too.
- [ ] Remove the old organiser routes from the build if they break it (missing tables).

## 5. Help others
- Test P1's prompts through your routes and report bad replies.
- At 04:00 decide with the team whether Team Board / organizer form / streak go in.
- During rehearsals: watch the logs, re-seed if anything gets messed up (`seed-esc.sql` must be re-runnable: `truncate ... restart identity cascade` at the top).

## Your checklist
- [ ] 22:30 Schema in Supabase, `/api/health` ok
- [ ] 23:00 Seed data (events, guides, profiles, team posts)
- [ ] 23:30 `GET /api/events` and `/api/events/[id]` (without AI) — unblocks P3
- [ ] 00:30 AI summary route + explain + simplify (with P1's prompts)
- [ ] 01:30 Deployed; going + buddy pairing; ICS
- [ ] 03:00 Pre-generated summaries for all seeded events
- [ ] 04:00 Light features if green
- [ ] 06:00 Freeze, final deploy, re-runnable seed

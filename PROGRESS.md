# Progress

Last updated: 11 Oct 2026, 03:40

## P1 — AI / Pitch
- [x] Prompt functions in src/lib/gemma.ts (all exported functions, incl. answerWithoutJudgment, simplify, eventSummary, suggestLevel, guideDraft)
- [x] containsJudgment + judgmentWords helpers
- [x] No-judgment chatbot tone (smoke test: 5/5 replies clean, Serbian answered in Serbian)
- [x] scripts/test-gemma.ts smoke test (note: suggestLevel returned null on the misleading-description case — P1 to check before POST /api/events)
- [x] suggestLevel bug fixed (normalizeLevel helper) — commit 30ad0b9
- [x] gemma.ts hardening (maxTokens, retry temp, LaTeX rule)
- [ ] Kaggle notebook + synthetic dataset
- [ ] Before/after accuracy number for the pitch
- [ ] Pitch deck skeleton + demo script
- Blocked by: none — next is Kaggle + pitch

## P2 — Backend
- [x] /api/health green (Gemma + Supabase; fixed for P1's gemma.ts API in eb9c12a)
- [x] schema-esc.sql run in Supabase
- [x] seed-esc.sql run (15 events, 3 guides, 4 profiles, 2 going, 5 team posts)
- [x] GET /api/events works (verified: 6 beginner, 2 hackathon)
- [x] GET /api/events/[id] works (with ai_summary generate + cache)
- [x] Legacy organiser routes + unused lib files removed (dbb2d54)
- [x] POST /api/going with buddy pairing
- [x] GET /api/events/[id]/ics
- [x] POST /api/explain (calls answerWithoutJudgment)
- [x] POST /api/simplify
- [x] AI summary cache in GET /api/events/[id]
- [x] Pre-generated summaries for all 15 events (15/15)
- [x] Seed translated to English (fcf4d11)
- [x] Seed re-run in Supabase (verified: 15 events, 6 beginner / 6 intermediate / 3 expert, 2 hackathons, English)
- [x] 15 AI summaries regenerated after the re-run (15/15; one retry on ReDesign for Her)
- [x] Skip Vercel deploy logged — video-first pitch
- [x] POST /api/going is idempotent (existing row returned, no duplicate/re-pair); buddy candidates ordered created_at asc (deterministic "paired with Ana/Luka" demo)
- [x] DELETE /api/going (un-going; clears the buddy link on both sides)
- [x] POST /api/going/attended ("I was there", idempotent, profiles.steps + 1)
- [x] GET /api/going?profile_id= returns buddy_nickname
- [x] Friendly errors everywhere: uuid guards → 404 (no raw Postgres), FK → 422, 5xx mapped to friendly text (details only in server logs)
- [x] ICS: DTSTAMP + CALSCALE, DTEND defaults +2h, 75-octet folding, escaped URL, slug filename
- [x] gemma.ts client is lazy — missing GEMINI_API_KEY degrades to fallbacks instead of crashing route module load
- Blocked by: none

## P3 — Frontend
- [x] Event list with level badges + filters (level, type, city) — filters persist in the URL; upcoming/past split with "Finished" cards
- [x] Event page: what to expect, AI summary (ml's shape), "Say it simply" (toggle + fallback), chatbot
- [x] First-timer tag + buddy pairing UI — reload keeps the going state (no duplicate POST), remove-from-plan on both pages
- [x] Add to calendar (.ics) — blob download, failure = toast (never a raw JSON page)
- [x] Guides pages (3) — inline accordions
- [x] My events: greeting, buddy status, "I was there" (steps count), remove
- [x] origin/homepage MERGED to main (b18165e) + UX holes fixed — the video-recording blocker is resolved
- [x] Chat unified on the contract route /api/explain (event-aware, level from profile); /api/chat deleted (it broke against P1's gemma.ts rewrite)
- [x] Profile: nickname + level select + first_timer; localStorage keeps {id, nickname, level, first_timer} (legacy id-only keys still work); stale profile self-heals
- [x] Error/empty states on every page: friendly text + Try again; saved page no longer hangs on skeletons; my-events distinguishes error from empty
- [x] A11y: mobile nav names, chat panel dialog semantics + Esc + focus + live region + disclaimer, 44px send, teal darkened to AA
- [ ] Light if green: Team Board, organizer form (/submit)
- Blocked by: none

## Checkpoints
- 22:30 ✓ Schema + seed in Supabase, /api/health ok, events API live
- 00:30 Deployed on Vercel (moved up from 01:30)
- 01:30 Event page AI summary, chatbot, "Say it simply", Kaggle notebook running
- 04:00 FEATURE FREEZE (adjusted from 06:00) — bug fixes only after this
- After freeze: seed polish, deck, backup video, 2 timed rehearsals

## Blockers / Notes
- Old organiser routes + unused lib files removed (dbb2d54) — nothing left to clean
- Old organiser tables kept in Supabase (harmless)
- 00-TEAM-SPLIT says feature branches (ml/backend/frontend); DECISIONS.md says main-only — we work on main, 00-TEAM-SPLIT Git section is stale

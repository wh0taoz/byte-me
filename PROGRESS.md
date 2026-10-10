# Progress

Last updated: 11 Oct 2026, 01:20

## P1 — AI / Pitch
- [x] Prompt functions in src/lib/gemma.ts (all exported functions, incl. answerWithoutJudgment, simplify, eventSummary, suggestLevel, guideDraft)
- [x] containsJudgment + judgmentWords helpers
- [x] No-judgment chatbot tone (smoke test: 5/5 replies clean, Serbian answered in Serbian)
- [x] scripts/test-gemma.ts smoke test (note: suggestLevel returned null on the misleading-description case — P1 to check before POST /api/events)
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
- [ ] Seed re-run in English (translated, awaiting run in Supabase — wipes summaries, re-generate after)
- [ ] Vercel deploy (00:30 checkpoint — overdue)
- Blocked by: none — next is Vercel deploy

## P3 — Frontend
- [ ] Event list with level badges + filters (level, type, city)
- [ ] Event page: what to expect, AI summary, "Say it simply", chatbot
- [ ] First-timer tag + buddy pairing UI
- [ ] Add to calendar (.ics)
- [ ] Guides pages (3)
- [ ] Light if green: Team Board, organizer form, My steps
- Blocked by: none — unblocked since the 22:30 checkpoint

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

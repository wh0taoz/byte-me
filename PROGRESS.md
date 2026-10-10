# Progress

Last updated: 10 Oct 2026, 22:42

## P1 — AI / Pitch
- [ ] Prompt functions in src/lib/gemma.ts (eventSummary, explainSystem, simplify, suggestLevel)
- [ ] No-judgment chatbot tone + containsJudgment filter
- [ ] Kaggle notebook + synthetic dataset
- [ ] Before/after accuracy number for the pitch
- [ ] Pitch deck skeleton + demo script
- Blocked by: none (events API ready for prompt testing)

## P2 — Backend
- [x] /api/health green (Gemma + Supabase)
- [x] schema-esc.sql run in Supabase
- [x] seed-esc.sql run (15 events, 3 guides, 4 profiles, 2 going, 5 team posts)
- [x] GET /api/events works (verified: 6 beginner, 2 hackathon)
- [x] GET /api/events/[id] works (ai_summary pending)
- [x] Legacy organiser routes + unused lib files removed (dbb2d54)
- [ ] AI routes (explain, simplify, going, ics) — in progress
- [ ] Vercel deploy (00:30 checkpoint)
- [ ] Pre-generated summaries
- Blocked by: none

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

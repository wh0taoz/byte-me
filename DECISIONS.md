# Decisions Log

Format:
## [Date, time] — [Decision title]
- Decision: what we decided
- Reason: why we decided it
- Consequence: what this means for the project

## 11 Oct 2026, 01:30 — Skip Vercel deploy
- Decision: No Vercel deploy for hackathon demo.
- Reason: Cannot connect laptop to projector during pitch. Live demo impossible. Pitch is video + slides.
- Consequence: All testing on localhost. Backup video is primary demo artifact. Vercel remains future roadmap item.

## 10 Oct 2026, 23:55 — AiSummary shape changed by P1
- Decision: ai_summary uses {what_to_expect, is_this_for_me, key_terms, prior_knowledge, bring} instead of originally locked {summary, key_terms, prior_knowledge, good_for_beginners_because}.
- Reason: P1 implemented the function; simpler to adapt routes than rewrite prompts.
- Consequence: P3's summary card UI must use the new shape. AGENTS.md updated accordingly.

## 10 Oct 2026, 23:55 — English seed data for demo
- Decision: Translate all seed data (events, guides, team posts) from Serbian to English.
- Reason: All site text is in English. Demo (pitch) is in Serbian. Consistency matters for judges.
- Consequence: Seed re-run in Supabase. UI stays English.

## 10 Oct 2026, 22:31 — Feature freeze moved to Hour 04:00
- Decision: Feature freeze at 04:00, adjusted from the 06:00 in 00-TEAM-SPLIT.md.
- Reason: More buffer for seed polish, backup video and two timed rehearsals before submission.
- Consequence: Only bug fixes after 04:00; the light-feature decision (Team Board, organizer form, streak) must happen before the freeze.

## 10 Oct 2026, 22:31 — First deploy moved to Hour 00:30
- Decision: Vercel deploy at the 00:30 checkpoint instead of 01:30.
- Reason: Deploy early to catch env/build issues before the AI routes land.
- Consequence: /api/health and the events endpoints go live early; every merge to main must keep deploying.
- (Superseded 11 Oct 01:30: Vercel deploy skipped for hackathon — see the newer decision.)

## 10 Oct 2026, 21:15 — Pivot to EVERY STEP COUNTS
- Decision: Drop the organiser platform (Role Packs). Build "Every Step Counts": all tech events in one place, labeled by difficulty, with Gemma explaining everything to a beginner without judgment.
- Reason: New demo scope agreed by the team; the test for every feature is whether it reduces the fear of the first step.
- Consequence: New 5-table schema (events, guides, profiles, going, team_posts) alongside the old tables; old organiser routes retired when they break the build; scope and contracts frozen in 00-TEAM-SPLIT.md.

## 10 Oct 2026, 21:15 — Frictionless auth for beginners
- Decision: No login for the demo. A profile is a nickname + level + first-timer flag stored in localStorage and a profiles row.
- Reason: A sign-up wall is exactly the fear we are removing.
- Consequence: No auth code; profiles keyed by nickname for the demo; nothing personal stored.

## 10 Oct 2026, 21:15 — Self-hosted Gemma deferred to production
- Decision: Hosted Gemma via Google AI Studio API for the hackathon; self-hosting (Ollama, small Gemma) is the production plan for the pitch slide only.
- Reason: The hosted API is faster to ship in the time we have.
- Consequence: Pitch says "Gemma 4" (current generation); models: gemma-4-26b-a4b-it for chat/simplify, gemma-4-31b-it for summaries and level suggestions.

## 10 Oct 2026, 21:15 — Manual event data, no scraping
- Decision: Events are entered manually (seed data + organizer submit form). No scraping, no Meetup/Luma import.
- Reason: Scraping is fragile and out of demo scope.
- Consequence: Seed data is the demo content; the organizer form with Gemma level suggestion is a light feature.

## 10 Oct 2026, 16:00 — Skip feature branches
- Decision: Work directly on main, no backend/ml/ui branches.
- Reason: 3 people, 20 hours, no CI/CD. Merge overhead outweighs benefits.
- Consequence: Everyone must git pull before changes and push frequently.

## 10 Oct 2026, 16:00 — No chat feature
- Decision: Do not build user-to-user chat or messaging.
- Reason: Rebuilding chat takes days. Existing tools already win here.
- Consequence: No community/messaging UI in ESC either. The "Explain it to me" AI chatbot is a separate feature (assistant, not chat between users) and is unaffected by this decision.

## 10 Oct 2026, 16:00 — Gemma via AI Studio, not Kaggle
- Decision: Inference via Google AI Studio API. Kaggle only for evaluation.
- Reason: Kaggle notebooks are not production servers.
- Consequence: Kaggle produces before/after accuracy number for the pitch.

## 10 Oct 2026, 16:00 — Next.js 16 (from CNA latest)
- Decision: Keep Next.js 16 + React 19 + Tailwind v4 that create-next-app
  installed.
- Reason: Pack audit will determine if downgrade is needed.
- Consequence: If breaking changes found in pack, evaluate downgrade to 14.

(Add new decisions at the TOP, newest first.)

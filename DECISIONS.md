# Decisions Log

Format:
## [Date, time] — [Decision title]
- Decision: what we decided
- Reason: why we decided it
- Consequence: what this means for the project

## 10 Oct 2026, 16:00 — Skip feature branches
- Decision: Work directly on main, no backend/ml/ui branches.
- Reason: 3 people, 20 hours, no CI/CD. Merge overhead outweighs benefits.
- Consequence: Everyone must git pull before changes and push frequently.

## 10 Oct 2026, 16:00 — No chat feature
- Decision: Do not build chat. Generate Discord/WhatsApp invite links only.
- Reason: Rebuilding chat takes days. Discord and WhatsApp already win here.
- Consequence: Role Packs generate group names + invite URLs, not chat UI.

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

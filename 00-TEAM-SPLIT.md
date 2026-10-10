# Every Step Counts — hackathon split (shared file, everyone reads this)

**One-liner:** All tech events in one place, labeled by difficulty, with Gemma explaining everything to a beginner — without judgment.
**The test for every feature:** does it reduce the fear of the first step? If not, it's not in the demo.

The full strategy doc is a 90-day plan. **This file is the hackathon slice**: what we can show working in the ~13 hours left (from 21:15 Saturday).

---

## Who does what

| Person | Owns | File |
| --- | --- | --- |
| **P1 — ML + pitch** | Gemma prompts, Kaggle notebook, the pitch deck and demo script | `P1-ml-and-pitch.md` |
| **P2 — Backend** | Database, seed data, API routes, ICS export, buddy pairing, deploy | `P2-backend.md` |
| **P3 — Frontend** | All screens, beginner-friendly design, mascot/step visuals, demo polish | `P3-frontend.md` |

---

## Demo scope

### Build (must work in the demo)
1. **Event list** with difficulty level badges + filters (level, type, city) — *idea 1 + 2*
2. **Event page** with "What to expect" in plain language — *idea 3*
3. **AI summary** on each event: short summary, key terms explained, required prior knowledge — *idea 5*
4. **"Explain it to me" chatbot** — no-judgment explanations, aware of the event you're looking at — *idea 6, the signature*
5. **"Say it simply" button** — Gemma rewrites any event description more simply — *N12, cheap once the chatbot exists*
6. **First-timer tag + buddy pairing** — "I'm going for the first time" → paired with another first-timer — *N2*
7. **Add to calendar** (.ics download) — *N4, trivial*
8. **First-time guides** — 3 short pages: what is a hackathon, what to bring to a meetup, can I come if I know nothing — *N1, pure content*

### Build light (if on schedule at checkpoint 2)
9. **Team Board** for hackathons — "looking for a team / looking for a member" posts with level tags — *idea 7 v1*
10. **Organizer submit form** where Gemma *suggests* the level from the description — *also the Kaggle story*
11. **Step streak** visual on a "My steps" page — 1 step per event marked as attended, no points, no leaderboard — *N3*

### Show on a slide only (do not build)
Email digest, readiness quiz, "what's next", mentor role, community-verified levels, widget, Discord bot, monetization, Meetup/Luma import.

### Not doing (from the plan's drop list)
Social feed, own ticketing, native app, recruitment product, negative ratings, leaderboards.

---

## Tech decisions (agreed, don't re-debate)

- Keep the existing repo stack: **Next.js + Supabase + Gemma via Google AI Studio**, deployed on Vercel.
- Model: `gemma-4-26b-a4b-it` (fast) for chat and simplify; `gemma-4-31b-it` for summaries and level suggestions.
- The strategy doc says Gemma 3 4B/12B self-hosted with Ollama — that's the **production plan** for the pitch slide. For the hackathon, the hosted API is faster to ship. Gemma 4 is the current generation, so say "Gemma 4" in the pitch.
- No login for the demo. A "profile" is a nickname + level + first-timer flag stored in `localStorage` and a `profiles` row.
- **Drop the organiser-platform tables/routes** from the previous pack (roles, role_files, role-pack, restock, command). Keep: `lib/gemma.ts`, `lib/supabase*.ts`, `api/health`, `theme.css`.
- Every AI output is labeled: **"AI summary — may contain errors."**

---

## Shared data model (P2 creates it, everyone builds against it)

| Table | Key fields |
| --- | --- |
| `events` | id, title, organizer, type (hackathon / meetup / seminar / workshop / conference), level (beginner / intermediate / expert), city, starts_at, ends_at, venue, registration_url, description, what_to_expect, ai_summary (jsonb), ai_level_suggestion, created_at |
| `guides` | slug, title, body_md, emoji_or_icon, order |
| `profiles` | id, nickname, level, interests[], first_timer (bool), steps (int), created_at |
| `going` | id, event_id, profile_id, first_timer (bool), buddy_profile_id, attended (bool), created_at |
| `team_posts` | id, event_id, kind (looking_for_team / looking_for_member), nickname, level, skills[], message, contact, created_at |

`ai_summary` shape:
```json
{ "summary": "string (3 sentences max)",
  "key_terms": [{ "term": "API", "explanation": "one plain sentence" }],
  "prior_knowledge": ["Basic JavaScript", "Nothing — beginners welcome"],
  "good_for_beginners_because": "string" }
```

## API contracts

| Route | Input | Output | Owner |
| --- | --- | --- | --- |
| `GET /api/events` | `?level=&type=&city=` | `Event[]` | P2 |
| `GET /api/events/[id]` | – | `Event` (generates + caches `ai_summary` if missing) | P2 (prompt: P1) |
| `POST /api/events` | organizer form fields | `Event` + `ai_level_suggestion` | P2 (prompt: P1) |
| `POST /api/explain` | `{ messages, event_id?, level }` | `{ reply }` | P2 (prompt: P1) |
| `POST /api/simplify` | `{ text, level }` | `{ text }` | P2 (prompt: P1) |
| `POST /api/going` | `{ event_id, profile_id, first_timer }` | `{ going, buddy: { nickname } \| null }` | P2 |
| `GET /api/events/[id]/ics` | – | `.ics` file | P2 |
| `team_posts` | read/write directly with the Supabase browser client | – | P3 |

**Rule:** P1 writes prompts as functions in `src/lib/gemma.ts`; P2 calls them from routes. Change a prompt without touching a route, and vice versa.

---

## Checkpoints (times are Saturday → Sunday)

| When | Everyone should see |
| --- | --- |
| **22:30** | Schema + seed in Supabase, `/api/health` ok, P3 has the event list rendering real rows |
| **01:30** | Event page with AI summary, chatbot answering, "Say it simply" working, Kaggle notebook running |
| **04:00** | First-timer + buddy, ICS, guides done. **Decide**: Team Board / organizer form / streak — only if green |
| **06:00** | **Feature freeze.** Deployed on Vercel. Only bug fixes after this |
| **06:00–08:30** | Seed data polish, deck, backup demo video, 2 timed rehearsals |
| **Sleep** | Everyone gets at least 2–3 hours between 01:30 and 06:00 in shifts — agree who sleeps when |

Adjust the last rows to the real submission deadline: ______

## Git
- Branches: `ml`, `backend`, `frontend`. Merge to `main` at every checkpoint. `main` must always deploy.
- Small commits with clear messages. Don't commit `.env.local`.

## Demo script (2 minutes, P1 presents, P3 drives the laptop)
1. **Hook (15 s):** "Half of beginners we asked skipped an event because they didn't know if it was for them." *(use the real survey number)*
2. Open the site → filter **Beginner** → event cards with level badges.
3. Open a hackathon → **What to expect** + **AI summary**: key terms, prior knowledge.
4. Click **Say it simply** on the description.
5. Chatbot: *"sorry if this is dumb, what's an API?"* → warm, simple answer.
6. Tick **"I'm going for the first time"** → "You're paired with Luka, also a first-timer."
7. **Add to calendar.** Close with: *"Every step counts."* + the Kaggle result slide.

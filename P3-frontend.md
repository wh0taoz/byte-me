# P3 — Frontend (screens, beginner-friendly design, demo polish)

You own **what the judges see**. The product's promise is "no intimidation", so the UI itself is part of the pitch. Read `00-TEAM-SPLIT.md` first.

## Until P2's API is ready (~23:30)
Build every screen with a hard-coded mock array that matches the `Event` shape in the team file, then swap in `fetch("/api/events")`. Don't wait.

## Screens, in build order

### 1. Home / event list `/` (by 23:30)
- [ ] Hero: motto **"Every step counts"** + one line: *"Tech events labeled by level, explained without judgment."*
- [ ] Filter chips: **Level** (Beginner / Intermediate / Expert), **Type**, **City**. Beginner chip prominent.
- [ ] Event cards: title, organizer, date, city, type, **level badge** (word + colour + icon, never colour alone).
- [ ] A "New here? Start with a guide →" banner linking to guides.

### 2. Event page `/events/[id]` (by 01:00)
- [ ] Level badge, date, venue, **Register on organizer's site** button (external link, opens new tab).
- [ ] **What to expect** section in plain language, near the top.
- [ ] **AI summary** card: summary, **key terms** (tap a term → its explanation expands), **prior knowledge needed** as a checklist. Label: *"AI summary — may contain errors."* Skeleton loader while it loads.
- [ ] **Say it simply** button on the description → swaps text with the simplified version, with "Show original".
- [ ] **Add to calendar** → `GET /api/events/[id]/ics`.
- [ ] **I'm going** with a checkbox **"It's my first time"** → shows the buddy result: *"You're paired with Luka — also a first-timer. Say hi at the entrance!"*

### 3. "Explain it to me" chat (by 01:30) — the signature feature
- [ ] Floating button on every page: *"Ask anything — no question is too small."*
- [ ] Slide-over panel; on an event page it knows the event (send `event_id`).
- [ ] Suggested starter questions as chips: *"What's an API?"*, *"Do I need to know how to code?"*, *"What do people do at a hackathon?"*
- [ ] Typing indicator while waiting; friendly fallback text on error.

### 4. Guides `/guides` and `/guides/[slug]` (by 02:30)
- [ ] 3 cards → readable article pages (max ~65 characters per line, generous spacing).

### 5. Profile-lite (by 03:00)
- [ ] First visit: small modal → nickname, level, "first time at tech events?" → save to `profiles` + `localStorage`. Skippable.

### Light (only if green at 04:00)
- [ ] **Team Board** tab on hackathon pages: two columns *Looking for a team* / *Looking for members*, post form with level + skills; reads/writes `team_posts` directly with the Supabase client.
- [ ] **My steps** `/me`: a literal path of footsteps, one per attended event; milestones at 3, 10, 25. No points, no leaderboard.
- [ ] Organizer submit form `/submit` showing Gemma's suggested level with a "Use this level / change" choice.

## Design rules (the product promise)
- **Tone:** friendly, short sentences, no jargon in UI text. Buttons say what happens ("Add to my calendar", not "Export ICS").
- **Palette:** keep `theme.css`. Suggested level colours (always with the word):
  Beginner = success green `#15803D` + 🌱-style icon · Intermediate = primary `#3B4CCA` · Expert = ink `#1F2433`. Avoid red for "Expert" — it reads as danger and scares beginners.
- Warm accent `#F5A524` for the chat button and highlights (dark text on it).
- Mobile-first: test at 375 px. Tap targets ≥ 44 px.
- Empty states that encourage: *"No beginner events in Niš this week — here are online ones."*
- Never show a raw error or a spinner longer than ~2 s without text ("Gemma is reading the event…").

## Demo polish (06:00–08:30)
- [ ] Run the demo script end-to-end 3 times on the deployed URL; note anything slow.
- [ ] Record a **backup demo video** (screen recording, 2 min) — if Wi-Fi or Gemma fails on stage, play it.
- [ ] Help P1 with deck visuals: screenshots of the event page, chat, buddy match.
- [ ] Drive the laptop during the pitch while P1 talks.

## Your checklist
- [ ] 23:30 Event list (mock → real data)
- [ ] 01:00 Event page with summary, simplify, calendar, going/buddy
- [ ] 01:30 Chat panel working against `/api/explain`
- [ ] 02:30 Guides
- [ ] 03:00 Profile-lite
- [ ] 04:00 Light features if green
- [ ] 06:00 Freeze; mobile check
- [ ] 08:30 Backup video recorded, rehearsals done

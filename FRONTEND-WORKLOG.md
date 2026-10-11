# Frontend worklog — `homepage` branch

Everything below is on the `homepage` branch (branched from `main` after the ESC
pivot commits). Each section maps to one or more commits. All work was verified
in the browser and with a green production build before pushing.

## 1. Rebuild on the real backend (mock UI retired)

The first frontend pass ran on a local mock store. Once P2's backend landed
(events API, buddy pairing, ICS export, live Supabase seed), the UI was rebuilt
on the real APIs instead of mocks:

- `src/lib/api.ts` — the single file the UI talks to the backend through
  (`getEvents`, `getEvent`, `markGoing`, `getGuides`, profile helpers).
- `src/lib/types.ts` — replaced the dead organiser types with the ESC schema
  types (`EventRow`, `GuideRow`, `ProfileRow`, `GoingResult`).
- Pages: event list + filters, event detail (what to expect, AI summary block,
  register link-out, ICS download, going + first-timer buddy pairing), guides
  page with a mini markdown renderer.
- Two thin routes added in the team's style because the UI needed them:
  - `GET /api/guides` — guides list for the guides page
  - `GET|POST /api/profiles` — lightweight demo identity (no auth yet) so
    `/api/going` has a profile to point at
- `lucide-react` re-added to dependencies (it had been dropped).
- Next 16 fixes along the way: `useParams`/`usePathname` behind `<Suspense>`,
  `cacheComponents`-compatible event route (partial prerender).

## 2. Pip the AI chatbot

- `POST /api/chat` — built on the existing `gemma.ts` layer with the
  no-judgment persona ("never treat a question as too basic"), last-10-message
  context, optional event context injection on event pages. Tested live
  against Gemma.
- Floating chat widget on every page (now with the official kit avatar art)
  and a full **Ask Pip** page (`/ask-pip`): bubbles, typing indicator, quick
  questions, error handling, honest "AI — may contain mistakes" labelling.

## 3. English everywhere

- All UI copy is English; `lang="en"`; brand strings centralised in
  `src/lib/brand.ts` (name is a working title — swap there).
- `scripts/english-seed.mjs` — one-off in-place translation of the live
  Supabase demo data (15 events, 3 guides, 5 team posts, 3 profiles).
  Event IDs preserved, so links and buddy pairs kept working. Already executed.
- `supabase/seed-esc.sql` rewritten in English so future re-runs match.
  Proper nouns (Niš, Novi Sad, Garaža, venue addresses) stay as-is.

## 4. StepIn UI kit V2 migration (final visual direction)

Migrated the design kit's four screens per `GLM-PROMPT.txt`, adapted as a
full-width **web app** (team decision — no mobile app shell / bottom nav).

- Assets: `assets/` copied to `public/assets/` with original paths — six
  official Pip PNGs, 14 SVG icons, footsteps brand logo, level art PNGs.
  All earlier hand-drawn SVG mascot code deleted; the kit art is the only Pip.
- Palette (from `design-tokens.json`): navy ink `#132039`, teal actions
  `#0096A1`/`#00747D`, mint `#E5F5EE`, tactile 2px borders with 4px bottom
  edges, 20px card radius. Applied via the existing token system, so event
  detail and guides reskinned automatically.
- **Discover (`/`)** — kit hero (hero-wave Pip + speech bubble, "Find your
  first step."), light-into-dark teal gradient backdrop, search + city +
  difficulty + type filters on the live API, count `aria-live`, zero-results
  state with reset, event cards with the level-art half + basics half +
  save toggle + MORE DETAILS.
- **Saved (`/saved`)** — persisted localStorage collection, category tabs,
  count card, empty state, remove with toast. (Client-side only until a
  backend saves endpoint exists.)
- **My events (`/my-events`)** — real attendance via a new
  `GET /api/going?profile_id=` route: upcoming/past tabs, journey card,
  plan cards with date tiles, buddy status, locally persisted checklist.
- **Ask Pip (`/ask-pip`)** — full-page chat on the real `/api/chat`.
- Accessibility: one `h1` per route, `aria-pressed`/`aria-current`/`aria-live`,
  ≥44px controls, focus rings, decorative icons with empty alt.
- QA: build green; 375/390/1280px checked — no horizontal scroll; save flow,
  going data, checklist persistence and a live AI reply all tested in the
  browser.

## Fonts (drop-in, pending license)

TT Neoris (titles) + JustSans (body) are commercial TypeType fonts, so the
files are not in the repo. `@font-face` rules in `globals.css` point to
`public/fonts/` (exact filenames in its README). Drop the licensed files in
and the whole app switches over; until then it falls back to the system stack,
matching the kit's system-font direction.

## Commits on this branch

| Commit | What |
| --- | --- |
| `2859a2e` | Homepage redesign — gradient background, half-stoat cards (superseded by the kit migration) |
| `42505d6` | Event page redesign + Pip AI chatbot (`/api/chat`, floating widget) |
| `69c5894` | Stoat redrawn in the flat illustration style (superseded by official kit art) |
| `250e685` | TT Neoris + JustSans wiring, deep blue text, Pip v3 |
| `ae2b70e` | All demo seed content translated to English (script + seed SQL) |
| `b545a19` | StepIn UI kit V2 migration — the current visual direction |

## 11 Oct — merge to main + UX hole fixes (post-merge pass)

`origin/homepage` merged into main (seed conflict resolved to main's
English translation; package.json union). Then, in one pass:

- **Chat unified on `/api/explain`** — `/api/chat` (broke against P1's
  gemma.ts rewrite: `MODELS` gone) is deleted. PipChat + /ask-pip send
  `{messages, event_id?, level}`; the panel is event-aware via the URL,
  level comes from the local profile. Route date locale sr-RS → en-GB.
- **AI summary card fixed for P1's shape** — the UI read `summary` /
  `key_terms[].meaning` which the backend never writes; now renders
  what_to_expect / is_this_for_me / key_terms[].explanation /
  prior_knowledge / bring (types.ts mirrors gemma.ts's AiSummary).
- **Going flow** — POST is idempotent (reload can't duplicate or
  re-pair); detail page shows the already-going state via GET
  /api/going (now with buddy_nickname); "Remove from my plan"
  everywhere (DELETE clears the buddy link on both sides); buddy
  candidates ordered created_at asc; stale local profile self-heals
  (422 → clear + nickname form).
- **ICS** — DTSTAMP/CALSCALE, DTEND +2h default, 75-octet folding,
  escaped URL, slug filename, uuid-guard 404; UI downloads via blob so
  a failure is a toast, not a JSON page.
- **Discover** — upcoming/past split ("Finished" cards), filters
  persist in the URL, cards always show the start time, count hidden
  while loading.
- **Errors/empties** — shared friendly mapping in lib/api.ts (network /
  5xx / raw messages never reach the user), Try again buttons on every
  page, saved page no longer hangs on skeletons, my-events error ≠
  empty, guides empty state.
- **A11y/mobile** — mobile nav accessible names, chat panel dialog
  semantics + Esc + focus + aria-live + "may contain mistakes" footer,
  44px send button, bubble overflow-wrap, teal darkened to AA
  (#00787f), journey dot 1 tied to profile existence.
- **Profile** — level select on creation; localStorage keeps
  {id, nickname, level, first_timer} (legacy id-only entries still
  read); chat + simplify are level-aware; My events greets by nickname.
- **"Say it simply"** wired to /api/simplify with toggle + graceful
  fallback (verified live: pending label, fallback keeps the original).
- **"I was there"** — POST /api/going/attended (idempotent, steps+1,
  verified via API) + button on past plan cards + steps-taken line on
  the journey card.
- **Demo safety** — gemma.ts client is lazy (missing key degrades to
  fallbacks, no module-load crash); .env.example pruned; legacy
  supabase/schema.sql + seed.sql deleted.
- Saved page bookmark icon sized (`size-12` chip) — the kit SVG has no
  intrinsic dimensions, so the bare `<img>` fell back to 300x150 (c3de22d).

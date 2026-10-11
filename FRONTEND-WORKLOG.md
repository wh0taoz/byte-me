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

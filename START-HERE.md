# Organiser platform – start here

Stack: Next.js (App Router, TypeScript, Tailwind) + Supabase + Gemma via AI Studio, deployed on Vercel.
Everything below is in the order you should do it. Times are rough.

## Step 1 – Project (P2, 15 min, then everyone clones)
```bash
npx create-next-app@latest organiser --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd organiser
npm install @google/genai @supabase/supabase-js
```
Copy this pack's `src/` into the project's `src/` (merge folders), and `supabase/` to the project root.
Add the lines from `.gitignore-additions` to `.gitignore`. Commit and push. Branches: `ml`, `backend`, `ui`.

## Step 2 – Keys (P2, 15 min)
1. Copy `.env.example` → `.env.local` and fill it in. Share keys by DM, never in the repo.
2. AI Studio → Get API key → `GEMINI_API_KEY`.
3. Supabase → new project → Settings → API → URL, anon key, service role key.

## Step 3 – Database (P2, 10 min)
Supabase → SQL Editor → run `supabase/schema.sql`, then `supabase/seed.sql`.
Edit the seed emails first so they are your team's real Google accounts (needed for the Drive demo).

## Step 4 – Health check (everyone, 5 min)
`npm run dev` → open http://localhost:3000/api/health → must show `"ok": true`.
If it does, split up and work in parallel.

## Step 5 – Google sign-in with Drive access (P2, ~1 h — start early)
1. Google Cloud Console → new project → APIs & Services → enable **Google Drive API**.
2. OAuth consent screen → External → add your three emails as **test users** → add scope `.../auth/drive.file`.
3. Credentials → OAuth client ID (Web) → Authorized redirect URI = the callback URL Supabase shows in
   Authentication → Providers → Google. Paste the client ID and secret into that Supabase page and enable it.
4. Supabase → Authentication → URL Configuration → add `http://localhost:3000` and your Vercel URL.
5. Use `signInWithGoogle()` / `getGoogleToken()` from `src/lib/google-login.ts`.
6. Demo files: with `createFile()` in `src/lib/google-drive.ts`, create e.g. "Transport plan" (sheet), "Run of show" (doc),
   "Budget" (sheet), then insert rows into `role_files` with their ids, links and access (writer / reader).
   Why: the `drive.file` scope only covers files the app created, and it needs no Google app review.

## Step 6 – Deploy (P3, 15 min)
Push → vercel.com → import repo → add the same env vars → deploy → set `NEXT_PUBLIC_APP_URL` to the Vercel URL.
Open `/api/health` on the live URL.

## What's in the pack and who owns it
| File | What it does | Owner |
| --- | --- | --- |
| `supabase/schema.sql` | All tables: people, roles, role files/groups/starter tasks, grants, tasks, resources, speakers, incidents | P2 |
| `supabase/seed.sql` | Realistic demo data (event, 6 roles, 5 people, stock, sponsors, tasks, a speaker) | P2 |
| `src/lib/types.ts` | Shared types + API contracts — agree on these first | All |
| `src/lib/gemma.ts` | Gemma client + prompts (assign, welcome brief, command bar, messages, speaker level, GitHub tags) | P1 |
| `src/lib/assign.ts` | Scores and shortlists candidates in code, so Gemma never invents a person | P1 |
| `src/lib/restock.ts` | need = RSVPs × rate × days × 1.1; shortages become restock tasks | P2 |
| `src/lib/google-drive.ts` | Create Docs/Sheets, grant and revoke access (with expiry at event end) | P2 |
| `src/lib/google-login.ts` | Google sign-in with Drive scope, token getter | P2 |
| `src/lib/supabase.ts`, `supabase-admin.ts` | Browser client / server admin client | P2 |
| `src/app/api/health` | Checks Gemma + Supabase | P2 |
| `src/app/api/assign` | Gemma picks assignee + reason; falls back to top score if Gemma fails | P1 |
| `src/app/api/role-pack/apply` | One call: Drive access + groups + starter tasks + welcome brief | P2 |
| `src/app/api/role-pack/revoke` | Removes all Drive access granted through a role | P2 |
| `src/app/api/restock` | Optionally sets RSVP count, recalculates, creates restock tasks | P2 |
| `src/app/api/command` | Command bar: Gemma picks 1 of 6 actions; writes need confirmation | P1 |
| `src/app/theme.css` | Colour palette tokens + urgency badges (import in `globals.css`) | P3 |

## Screens for P3 to build (in this order)
1. `/people` – people list, add person, "Add role" button → calls `/api/role-pack/apply`, shows the brief.
2. `/tasks` – board by status; "Suggest assignee" → `/api/assign`, shows the reason + override dropdown.
   Calendar tab: same tasks by deadline (use a ready calendar component, don't build one).
3. `/resources` – one table with a type filter (stock / vendor / sponsor / budget); RSVP input → `/api/restock`.
4. Command bar (Ctrl+K) on every page → `/api/command`, confirm button when `needs_confirmation`.
5. `/me` – volunteer home: my tasks, my links, my groups, welcome brief (mascot here if time).

## Quick tests (curl, once seed data exists)
```bash
curl -X POST localhost:3000/api/restock -H "Content-Type: application/json" -d '{"rsvp_count":120}'
curl -X POST localhost:3000/api/command -H "Content-Type: application/json" -d '{"text":"who can help with catering?"}'
```

## Rules of thumb
- Gemma never writes to the database directly: it picks, your code acts.
- Every AI result shows its reason and can be overridden.
- Feature freeze ~13 h from now; after that only fixes, seed data, deck and rehearsals.

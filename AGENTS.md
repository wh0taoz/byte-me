# byte-me — AI Agent Context

## Project
Organiser platform for events. Stack: Next.js (App Router, TypeScript,
Tailwind), Supabase, Gemma via Google AI Studio, Google Drive API,
deployed on Vercel.

## The one thing we build
Role Packs: organiser adds a person, picks a role, platform instantly
grants Drive access + chat groups + starter tasks + a personal welcome
brief from Gemma.

## Data model (LOCKED — do not change without team agreement)
- people: id, name, email, github, level (beginner/intermediate/advanced),
  tags[], open_hours
- roles: id, name, description
- role_files: role_id, drive_file_id, access (reader/commenter/writer)
- role_groups: role_id, group_name, invite_url
- person_roles: person_id, role_id, granted_at, revoked_at
- tasks: id, title, deadline, urgency, tags[], estimate_h, assignee_id,
  status, ai_reason
- resources: id, type (stock/vendor/sponsor/budget), name, qty,
  per_person_rate, amount, status
- event: id, name, dates, rsvp_count, venue_notes
- speakers: id, name, topic, level, av_needs, access_needs, arrival
- incidents: id, text, routed_to_role, created_at

## API routes
- POST /api/role-pack/apply → {person_id, role_ids[]} → {success, brief}
- POST /api/role-pack/revoke → {person_id, role_id} → {success}
- POST /api/restock → {rsvp_count} → {tasks_created[]}
- POST /api/assign → {task_id} → {assignee_id, ai_reason, top_3}
- POST /api/command → {text} → {action, needs_confirmation}
- GET /api/health → {ok: true}

## Conventions
- Always "task", never "todo" or "job"
- Dates: ISO 8601
- All API routes return JSON
- Error format: {error: string, code: number}
- Every AI suggestion MUST include ai_reason field
- service_role key: backend only, NEVER in frontend

## Out of scope (do not build)
- Chat (use Discord/WhatsApp invite links)
- Mascot
- Calendar view
- Command bar UI (only if time allows at end)
- GitHub integration
- Speaker intake UI

## Rules
- Gemma never writes to database directly — it picks, our code acts
- Every AI result shows its reason and can be overridden
- Feature freeze at Hour 13

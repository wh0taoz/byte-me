-- Every Step Counts — new schema (5 tables). Supabase → SQL Editor → paste → Run.
-- Adds the ESC tables alongside the old organiser tables (old ones stay untouched).
-- Hackathon mode: RLS on with open policies. Tighten before any real launch.

create extension if not exists "pgcrypto";

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organizer text not null,
  type text not null check (type in ('hackathon','meetup','seminar','workshop','conference')),
  level text not null check (level in ('beginner','intermediate','expert')),
  city text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  registration_url text,
  description text not null,
  what_to_expect text[],
  ai_summary jsonb,
  ai_level_suggestion text,
  created_at timestamptz default now()
);
create index if not exists idx_events_starts_at on events(starts_at);
create index if not exists idx_events_level on events(level);

create table if not exists guides (
  slug text primary key,
  title text not null,
  body_md text not null,
  emoji text,
  "order" int default 0
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  level text check (level in ('beginner','intermediate','expert')),
  interests text[] default '{}',
  first_timer boolean default false,
  steps int default 0,
  created_at timestamptz default now()
);

create table if not exists going (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  first_timer boolean default false,
  buddy_profile_id uuid references profiles(id),
  attended boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_going_event on going(event_id);

create table if not exists team_posts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  kind text check (kind in ('looking_for_team','looking_for_member')),
  nickname text not null,
  level text,
  skills text[] default '{}',
  message text,
  contact text,
  created_at timestamptz default now()
);

-- RLS demo policies
do $$
declare t text;
begin
  foreach t in array array['events','guides','profiles','going','team_posts']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "demo_all" on %I', t);
    execute format('create policy "demo_all" on %I for all using (true) with check (true)', t);
  end loop;
end $$;

-- Realtime (wrapped so re-running the file doesn't fail on "already member")
do $$
begin
  alter publication supabase_realtime add table team_posts;
exception when duplicate_object then null;
end $$;

-- Grants for service_role
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all functions in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;

-- Organiser platform schema. Supabase → SQL Editor → paste → Run.
-- Hackathon mode: RLS on with open policies so the anon key works. Tighten before any real launch.

create extension if not exists "pgcrypto";

create table if not exists event (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_at timestamptz,
  ends_at timestamptz,          -- used as the expiry for granted access
  days int default 1,
  rsvp_count int default 0,
  venue_notes text
);

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,             -- must be a Google account email for Drive sharing
  github text,
  level text not null default 'beginner' check (level in ('beginner','intermediate','advanced')),
  tags text[] default '{}',
  available_hours numeric default 8,
  mascot_xp int default 0,
  created_at timestamptz default now()
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,      -- e.g. 'Transport lead'
  description text,
  default_tags text[] default '{}'
);

create table if not exists role_files (            -- which Google files a role gets
  id uuid primary key default gen_random_uuid(),
  role_id uuid references roles(id) on delete cascade,
  drive_file_id text not null,
  file_name text,
  file_url text,
  access text not null check (access in ('reader','commenter','writer'))
);

create table if not exists role_groups (           -- chat groups a role belongs to
  id uuid primary key default gen_random_uuid(),
  role_id uuid references roles(id) on delete cascade,
  group_name text not null,                        -- e.g. 'Team leads'
  invite_url text                                  -- Discord / WhatsApp link
);

create table if not exists role_starter_tasks (
  id uuid primary key default gen_random_uuid(),
  role_id uuid references roles(id) on delete cascade,
  title text not null,
  tags text[] default '{}',
  urgency text default 'medium' check (urgency in ('low','medium','high')),
  estimate_h numeric default 1
);

create table if not exists person_roles (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references people(id) on delete cascade,
  role_id uuid references roles(id) on delete cascade,
  welcome_brief text,
  granted_at timestamptz default now(),
  revoked_at timestamptz
);

create table if not exists file_grants (           -- needed to revoke Drive access later
  id uuid primary key default gen_random_uuid(),
  person_role_id uuid references person_roles(id) on delete cascade,
  role_file_id uuid references role_files(id) on delete cascade,
  drive_permission_id text not null,
  revoked_at timestamptz
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tags text[] default '{}',
  urgency text default 'medium' check (urgency in ('low','medium','high')),
  deadline timestamptz,
  estimate_h numeric default 1,
  status text default 'todo' check (status in ('todo','in_progress','blocked','done')),
  assignee_id uuid references people(id) on delete set null,
  ai_reason text,
  source text default 'manual',                    -- manual | role_pack | restock | assistant
  created_at timestamptz default now()
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('stock','vendor','sponsor','budget')),
  name text not null,
  qty numeric,                                     -- stock on hand
  unit text,                                       -- 'bottles', 'packs'
  per_person_per_day numeric,                      -- stock consumption rate
  amount numeric,                                  -- money for budget/sponsor/vendor rows
  contact text,
  status text,                                     -- e.g. 'confirmed', 'pending', 'paid'
  notes text
);

create table if not exists speakers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  topic text,
  abstract text,
  level text check (level in ('beginner','intermediate','advanced')),
  av_needs text,
  access_needs text,
  arrival timestamptz
);

create table if not exists incidents (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  role_id uuid references roles(id),
  status text default 'open',
  created_at timestamptz default now()
);

-- Workload view used by assignment
create or replace view person_load as
select p.id as person_id,
       count(t.id) filter (where t.status <> 'done') as open_tasks,
       coalesce(sum(t.estimate_h) filter (where t.status <> 'done'), 0) as open_hours
from people p left join tasks t on t.assignee_id = p.id
group by p.id;

alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table resources;

do $$
declare t text;
begin
  foreach t in array array['event','people','roles','role_files','role_groups','role_starter_tasks',
                           'person_roles','file_grants','tasks','resources','speakers','incidents']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "demo_all" on %I', t);
    execute format('create policy "demo_all" on %I for all using (true) with check (true)', t);
  end loop;
end $$;

-- ============================================================
-- service_role grants
-- Supabase SQL Editor does not auto-grant service_role on tables
-- created manually. This block ensures the app (which uses the
-- service_role key on the backend) can read/write all tables.
-- ============================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

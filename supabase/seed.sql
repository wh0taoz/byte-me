-- Demo data. Run after schema.sql. Replace emails with your team's real Google accounts
-- so Drive sharing works in the demo. Add role_files after creating the Drive files (see START-HERE).

insert into event (name, starts_at, ends_at, days, rsvp_count, venue_notes) values
 ('Spring Hack 2027', now() + interval '30 days', now() + interval '32 days', 2, 80,
  'Main hall ground floor, step-free entrance; room B on 1st floor has a lift');

insert into roles (name, description, default_tags) values
 ('Lead organiser', 'Owns the whole event, budget and sponsors', '{sponsors,budget,planning}'),
 ('Team lead', 'Leads one area and its volunteers', '{planning,people}'),
 ('Transport lead', 'Shuttles, deliveries, pick-ups', '{logistics,driving}'),
 ('Food & supplies', 'Catering, water, snacks, restocking', '{catering,logistics}'),
 ('Tech & AV', 'Wi-Fi, projectors, mics, streaming', '{AV,networking}'),
 ('Volunteer', 'General help on the day', '{helping}');

insert into role_groups (role_id, group_name, invite_url)
select id, g, null from roles, unnest(array['All organisers']) g;
insert into role_groups (role_id, group_name)
select id, 'Team leads' from roles where name in ('Lead organiser','Team lead','Transport lead','Food & supplies','Tech & AV');
insert into role_groups (role_id, group_name)
select id, 'Admins' from roles where name = 'Lead organiser';
insert into role_groups (role_id, group_name)
select id, 'Transport' from roles where name = 'Transport lead';

insert into role_starter_tasks (role_id, title, tags, urgency, estimate_h)
select id, t.title, t.tags, t.urgency, t.est from roles r
join (values
 ('Transport lead','Confirm shuttle schedule with bus company','{logistics,driving}','high',1),
 ('Transport lead','Plan pick-up route for speakers','{logistics}','medium',1),
 ('Food & supplies','Confirm catering order for day 1','{catering}','high',1),
 ('Tech & AV','Test projectors in all rooms','{AV}','medium',2),
 ('Volunteer','Read the run-of-show document','{helping}','low',0.5)
) as t(role, title, tags, urgency, est) on r.name = t.role;

insert into people (name, email, github, level, tags, available_hours) values
 ('Ana Petrović',   'ana@example.com',    null, 'intermediate', '{logistics,driving,catering}', 10),
 ('Marko Jovanović','marko@example.com',  'marko-dev', 'advanced', '{AV,networking,frontend}', 6),
 ('Jelena Ilić',    'jelena@example.com', null, 'beginner', '{helping,design,social media}', 12),
 ('Stefan Nikolić', 'stefan@example.com', 'snikolic', 'advanced', '{sponsors,budget,planning}', 4),
 ('Mila Kovač',     'mila@example.com',   null, 'intermediate', '{catering,accessibility,people}', 8);

insert into resources (type, name, qty, unit, per_person_per_day, status) values
 ('stock','Water bottles 0.5 l', 150, 'bottles', 2, null),
 ('stock','Snack packs', 120, 'packs', 1.5, null),
 ('stock','Coffee capsules', 200, 'capsules', 2, null),
 ('stock','Name badges', 90, 'badges', null, null);
insert into resources (type, name, amount, contact, status) values
 ('sponsor','Local tech company A', 1500, 'partners@example.com', 'confirmed'),
 ('sponsor','Cloud credits partner', 0, 'events@example.com', 'pending'),
 ('vendor','Catering company', 1200, 'orders@example.com', 'pending'),
 ('budget','Venue', 800, null, 'paid'),
 ('budget','Prizes', 600, null, 'planned');

insert into tasks (title, tags, urgency, deadline, estimate_h) values
 ('Book a second shuttle for Saturday morning', '{logistics,driving}', 'high', now() + interval '3 days', 1),
 ('Print room signs and Wi-Fi cards', '{design,helping}', 'medium', now() + interval '5 days', 2),
 ('Send sponsor logo deadline reminder', '{sponsors}', 'medium', now() + interval '2 days', 0.5),
 ('Check step-free route to room B', '{accessibility}', 'high', now() + interval '4 days', 1),
 ('Set up livestream for opening talk', '{AV,networking}', 'high', now() + interval '6 days', 3);

insert into speakers (name, topic, abstract, av_needs, access_needs, arrival) values
 ('Dr. Ivana Marić', 'Vector databases in practice',
  'How embeddings, ANN indexes and hybrid search work in production systems.',
  'HDMI, clicker, lapel mic', 'None', now() + interval '30 days 9 hours');

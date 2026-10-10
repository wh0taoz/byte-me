-- Every Step Counts — demo seed (English). Re-runnable: truncate + re-insert, paste & run any time.
-- All dates are within 6 weeks of 2026-10-10. Level mix: 6 beginner / 6 intermediate / 3 expert.

truncate events, guides, profiles, going, team_posts restart identity cascade;

-- ============================================================
-- 15 EVENTS
-- ============================================================
insert into events (title, organizer, type, level, city, starts_at, ends_at, venue, registration_url, description, what_to_expect) values

-- 1. Wed 14 Oct, beginner workshop, Belgrade
('Git and GitHub for complete beginners', 'HUB 201', 'workshop', 'beginner', 'Belgrade',
 '2026-10-14 18:00+02', '2026-10-14 21:00+02', 'HUB 201, Kralja Petra 20',
 'https://hub201.rs/git-za-pocetnike',
 'In three hours we walk through the basic git commands — clone, commit, branch and merge — and resolve the kind of conflicts that happen in every team. By the end of the evening your code lives on GitHub, with a pull request you opened yourself. Bring a laptop and a bit of curiosity; we''ve prepared everything else.',
 array['A short intro with no code, then commands step by step',
       'Bring a laptop — we work on a real project',
       'No experience needed, mentors walk between the tables',
       'You leave with your first repository on GitHub']),

-- 2. Sat 17 Oct, beginner workshop, Belgrade
('ReDesign for Her: UX from the first sketch', 'ReDesign zajednica', 'workshop', 'beginner', 'Belgrade',
 '2026-10-17 10:00+02', '2026-10-17 14:00+02', 'Startit centar, Kraljice Natalije 32',
 'https://redesign.rs/for-her-2026',
 'In a relaxed atmosphere we go through the whole UX process — user research, personas, wireframes and a prototype in Figma. Then we test the prototypes with people from other tables and iterate on the feedback. No design experience needed; curiosity is.',
 array['We work in pairs, and teams are formed on the spot',
       'Bring a laptop or tablet with a free Figma account',
       'There are no wrong answers — sketching is allowed and encouraged',
       'Expect a friendly crowd and a pressure-free workshop']),

-- 3. Tue 20 Oct, intermediate meetup, Belgrade
('Startit AI Hub: A RAG pipeline from scratch', 'Startit', 'meetup', 'intermediate', 'Belgrade',
 '2026-10-20 18:30+02', '2026-10-20 21:00+02', 'Startit centar, Kraljice Natalije 32',
 'https://startit.rs/ai-hub-oktobar-2026',
 'A meetup dedicated to the RAG pipeline: chunking, embeddings and vector databases. We''ll show how documents get sliced, turned into embeddings and stored in Pgvector, and how the LLM calls the database to answer user questions. We finish with a discussion about hallucinations and how to measure answer quality.',
 array['Two 30-minute technical talks, then discussion',
       'Helpful but not required: Python and basic SQL',
       'We stay for informal chatting over drinks after the meetup',
       'Recording and slides arrive by email after the event']),

-- 4. Thu 22 Oct, expert seminar, Belgrade
('Yettel Tech Talk: 5G core in the cloud', 'Yettel Serbia', 'seminar', 'expert', 'Belgrade',
 '2026-10-22 18:30+02', '2026-10-22 20:30+02', 'Yettel poslovna zgrada, Bulevar Zorana Đinđića',
 'https://yettel.rs/tech-talk-oktobar-2026',
 'What the 5G core looks like when it moves to Kubernetes: service mesh, stateful sets and zero-downtime upgrades of the radio network. We also touch the observability stack — OpenTelemetry, distributed tracing and how we keep a 99.999 percent SLA. The talk is given by the chief architect of the core network team.',
 array['One deep one-hour talk, then questions',
       'Aimed at engineers already working in cloud or telecom',
       'A rare chance to hear what the backend of a telecom looks like from the inside',
       'Refreshments and conversation with engineers after the talk']),

-- 5. Fri 23 → Sun 25 Oct, beginner hackathon, Belgrade
('FONIS Hackathon 2026', 'FONIS', 'hackathon', 'beginner', 'Belgrade',
 '2026-10-23 16:00+02', '2026-10-25 16:00+02', 'FON, Jove Ilića 10',
 'https://fonis.rs/hakaton-2026',
 'FONIS Hackathon: 48 hours, teams of up to four and topics from the world of AI applications. Mentors help from the first idea to the presentation — how to define the problem, what an MVP is and how to tell the story to the jury. Coffee and food are provided for all 48 hours.',
 array['Register alone or with a crew — we also form teams on the spot',
       'Bring a laptop and charger, food and drinks are on us',
       'No experience needed — mentors are there from Friday to Sunday',
       'Sunday 5pm: demo day and prizes for the top three teams']),

-- 6. Sat 24 Oct, intermediate workshop, Novi Sad
('Crafthub workshop: CI/CD with GitHub Actions', 'Crafthub', 'workshop', 'intermediate', 'Novi Sad',
 '2026-10-24 11:00+02', '2026-10-24 16:00+02', 'Startit centar Novi Sad, Veljka Petrovića 2',
 'https://crafthub.rs/ci-cd-radionica',
 'A hands-on workshop: a CI/CD pipeline with GitHub Actions — from push to production. We write the workflow YAML step by step: build, test, containerizing into a Docker image and deploying to a staging environment. At the end everyone has their own automated pipeline that works.',
 array['You work on your own machine, step by step with the instructor',
       'Required: a GitHub account and basic terminal comfort',
       'The group is small, twenty seats, so everyone gets to the end',
       'Coffee together at the start — meeting before code']),

-- 7. Wed 28 Oct, intermediate meetup, Belgrade
('Data Science Serbia #58: Model serving in production', 'Data Science Serbia', 'meetup', 'intermediate', 'Belgrade',
 '2026-10-28 19:00+02', '2026-10-28 21:30+02', 'ICT Hub, Kralja Milana 10',
 'https://dss.rs/meetup-58',
 'Why a model isn''t deployed like an ordinary API, what feature drift is and how to monitor it in production. In the second part: a vector database benchmark — Pgvector, Qdrant and Weaviate — on Serbian-language queries. Expect a lively discussion about evaluating results.',
 array['Two 25-minute talks with a break in between',
       'The level is intermediate — no slides full of formulas, but there is code',
       'Come early for a good seat, the room fills up fast',
       'We continue the conversation at the pub across the street, off the record']),

-- 8. Thu 29 Oct, beginner meetup, Niš
('Space Station Niš: First steps in web development', 'Space Station Niš', 'meetup', 'beginner', 'Niš',
 '2026-10-29 18:00+02', '2026-10-29 20:30+02', 'Inovacioni centar Niš, Univerzitet u Nišu',
 'https://spacestationnis.rs/meetup-7',
 'A relaxed evening about how the internet actually works — what happens when you type an address, what frontend and backend are. On simple examples we assemble a first web page from HTML and CSS. The goal of the evening: you leave with a clearer picture and your first page on the internet.',
 array['A talk with no jargon, questions welcome at any moment',
       'Bring a laptop if you want to follow along — but you don''t have to',
       'You can also just watch and take notes',
       'Entry is free, registration is only needed for seat count']),

-- 9. Sat 31 Oct, beginner workshop, Online
('Online intro to artificial intelligence', 'AI Beginners Srbija', 'workshop', 'beginner', 'Online',
 '2026-10-31 10:00+02', '2026-10-31 13:00+02', 'Google Meet (link dolazi mejlom)',
 'https://aibeginners.rs/online-uvod-2026',
 'What artificial intelligence is, and what a large language model is — without math. Through examples we show what models do well, where they hallucinate and how to write a good prompt. The workshop is free and made entirely for people touching the topic for the first time.',
 array['You join from home — the link arrives by email a day before',
       'No code and no math, only examples and conversation',
       'Questions go in the chat, we answer all of them',
       'The recording is shared with everyone registered after the workshop']),

-- 10. Wed 4 Nov, intermediate seminar, Belgrade
('BEST Course: Agile and Scrum in practice', 'BEST Belgrade', 'seminar', 'intermediate', 'Belgrade',
 '2026-11-04 18:00+02', '2026-11-04 20:00+02', 'Elektrotehnički fakultet, Bulevar kralja Aleksandra 73',
 'https://bestbeograd.org.rs/course-jesen-2026',
 'Through a simulation of a real sprint we hand out roles — product owner, scrum master and the development team — and run it from planning to retrospective. We talk about the backlog, estimation and daily meetings, but also about where agile breaks in practice. We finish by discussing when waterfall is actually the better choice.',
 array['An interactive session — we work in groups of six',
       'No management knowledge needed, everything gets explained',
       'You get a certificate of attendance at the end',
       'Registration closes the day before, seats are limited']),

-- 11. Sat 7 → Sun 8 Nov, beginner hackathon, Novi Sad (main demo hackathon)
('Garaža Frontier Hackathon', 'Garaža', 'hackathon', 'beginner', 'Novi Sad',
 '2026-11-07 09:00+02', '2026-11-08 18:00+02', 'Garaža, Zmaj Jovina 12',
 'https://garaza.rs/frontier-hackathon-2026',
 'Frontier Hackathon: 33 hours, an open theme and teams of two to five. The focus is on first steps — how to pick an idea, what an MVP is, how to build a pitch and what the jury actually looks at. Mentors from Novi Sad IT companies circle the whole weekend, so nobody stays stuck.',
 array['Register alone — we form teams on Saturday morning',
       'Bring a laptop and charger, don''t worry about food and coffee',
       'Experience doesn''t matter: half the participants are at their first hackathon',
       'Sunday 5pm: demo day and prizes for the top three teams']),

-- 12. Tue 10 Nov, intermediate meetup, Belgrade
('Nordeus Tech Meetup: Game architecture in production', 'Nordeus', 'meetup', 'intermediate', 'Belgrade',
 '2026-11-10 18:00+02', '2026-11-10 21:00+02', 'Nordeus, Bulevar Vojvođanske brigade',
 'https://nordeus.com/events/tech-meetup-novembar-2026',
 'What happens when a million players tap at once: game servers, matchmaking and live ops events. We talk about balancing a game economy without ruining the fun, and what the pipeline from idea to live feature looks like. Bonus topic: what a day of a game programmer looks like in Serbia''s biggest game studio.',
 array['Two shorter talks from the Nordeus engineering team',
       'A studio tour after the talk for the interested',
       'Registration is at the entrance, bring an ID — security asks for it',
       'Drinks and pizza after the program, with conversation with the engineers']),

-- 13. Thu 12 Nov, intermediate workshop, Belgrade
('Microsoft Developer Workshop: .NET 10 and GitHub Copilot', 'Microsoft Serbia', 'workshop', 'intermediate', 'Belgrade',
 '2026-11-12 17:00+02', '2026-11-12 20:00+02', 'Microsoft Srbija, Ulica Španskih boraca 3',
 'https://aka.ms/rs-dev-workshop-2026',
 'We''ll build a small web API in .NET 10, write tests and let GitHub Copilot write our boilerplate — then judge what''s acceptable and what needs a rework. The theme of the evening: what AI can do instead of us, and what we still have to do ourselves. We work in pairs, so everyone has a partner for code review.',
 array['A live workshop in the Microsoft office',
       'Basic knowledge of C# or a similar language is needed',
       'Bring a laptop with Visual Studio or VS Code set up',
       'Forty seats, first-come-first-served registration']),

-- 14. Sat 14 Nov, expert conference, Belgrade
('DevFest Belgrade 2026', 'GDG Belgrade', 'conference', 'expert', 'Belgrade',
 '2026-11-14 09:00+02', '2026-11-14 18:00+02', 'Dom omladine Beograda, Makedonska 22',
 'https://gdgbelgrade.dev/devfest-2026',
 'One day, five parallel tracks and over thirty talks — from Kotlin multiplatform through WebGPU to cloud cost optimization. The keynote is given by a principal engineer from Munich about the next generation of on-device models. Between talks: demo booths, lightning talks and street food in the courtyard.',
 array['Over thirty talks across five halls — pick what interests you',
       'The keynote is at 10am, then tracks across the halls',
       'The ticket covers lunch, coffee and the after-party',
       'Slides and recordings of all talks are available after the conference']),

-- 15. Sat 21 Nov, expert workshop, Belgrade
('EESTEC Advanced Workshop: Embedded Rust', 'EESTEC Belgrade', 'workshop', 'expert', 'Belgrade',
 '2026-11-21 10:00+02', '2026-11-21 17:00+02', 'ETF, Bulevar kralja Aleksandra 73',
 'https://eestec-beograd.rs/advanced-workshop-2026',
 'We spend the whole day writing no_std Rust for ESP32 boards, reading sensors over I2C and fighting the borrow checker on hardware that doesn''t forgive. At the end every team has a small device that measures something and shows it on a display. The workshop is for people who already program confidently and want to step down from apps to the metal.',
 array['An advanced workshop — confident knowledge of some programming language is required',
       'Boards and sensors are provided, just bring a laptop',
       'We work in teams of three with mentors from the department',
       'Lunch and breaks are included in the workshop']);

-- ============================================================
-- 3 GUIDES (plain language)
-- ============================================================
insert into guides (slug, title, body_md, emoji, "order") values

('what-is-a-hackathon', 'What a hackathon is and what it''s like', E'A hackathon is an event where a bunch of people gather, split into teams and build something from scratch in 24 to 48 hours — an app, a game, a website or a prototype. Sounds intimidating? We know. Let''s bust some myths.\n\nFirst: you don''t have to know how to program to come. Many teams need someone for design, for the presentation, for testing, or just someone who asks good questions. At every hackathon there''s at least one team with a first-time member — usually half of them are.\n\nWhat does the day look like? The first morning is for meeting people and forming teams — if you come alone, don''t worry, others came alone too. Then the topics are announced, teams pick an idea and the work starts. Mentors walk between the teams and help when things get stuck. Some work through the night, some sleep at home — both are normal.\n\nThe last afternoon is for demos: each team shows what they built in a few minutes. The jury doesn''t expect a finished product, they expect a story — which problem you solved and how. If the app falls apart mid-demo, it happens to the best teams too; people laugh and carry on.\n\nYou never forget your first hackathon. Come, see how it feels, and you''ve already made one more step than last month.', '🏆', 1),

('what-to-bring', 'What to bring to your first meetup', E'Good news: you need almost nothing for your first meetup. Bad news: that''s exactly why people overpack. Here''s the short list that covers 95 percent of situations.\n\nBring: a laptop if the announcement says you''ll work on computers (check the what-to-expect section on the event page), a charger and a bottle of water. For hackathons add a power strip if you have one — there are never enough outlets. Keep the QR code or registration confirmation on your phone; don''t print anything.\n\nPaper and a pen sound old-fashioned, but for taking notes during talks they still work better than a phone. If you bring a laptop, bring headphones too — you know yourself.\n\nWhat you don''t need: special clothes (jeans and a t-shirt are perfectly fine), business cards (nobody asks for them) or knowledge about the topic — that''s what the third guide is about.\n\nAnd most importantly: we''ve all lived through those first awkward minutes when you don''t know anyone. They pass after the first conversation, and at meetups almost everyone comes alone.', '🎒', 2),

('can-i-come', 'Can I come if I know nothing about the topic?', E'Short answer: yes. Longer answer: yes, and here''s why.\n\nAlmost every meetup, workshop or hackathon in Serbia counts on first-time visitors. Organizers write it in the announcements, and speakers adapt their intros for exactly that reason. If you don''t understand something, there''s a good chance half the room doesn''t either — they just don''t dare ask. You ask.\n\nWhat if the talk turns out too hard? That happens and it''s fine. Sit, listen as long as you can, and take away one thing that''s clear to you. Nobody expects you to understand everything — often not even the speaker.\n\nIf the fear of people is bigger than the fear of the topic: come five minutes early and introduce yourself to the organizer. It''s the easiest first conversation in the world, and their job is to introduce you to someone else new. At every event there are at least three people for whom this is also the first time.\n\nThe math is simple: if you take home one new thing you learned and one new acquaintance, the event was a success. And if you come just to see what it''s like — that''s a step too. Every step counts.', '🤔', 3);

-- ============================================================
-- 4 PROFILES (Ana i Luka are first-timers for the buddy demo)
-- ============================================================
insert into profiles (nickname, level, interests, first_timer, steps) values
('Ana',   'beginner',     array['frontend','design'],             true,  0),
('Luka',  'beginner',     array['backend','AI'],                  true,  0),
('Marko', 'intermediate', array['python','data','sql'],           false, 5),
('Jovana','expert',       array['devops','cloud','mentoring'],    false, 20);

-- ============================================================
-- 5 TEAM POSTS (all on the Garaža Frontier Hackathon)
-- ============================================================
insert into team_posts (event_id, kind, nickname, level, skills, message, contact) values
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_team', 'Mina',   'beginner',     array['figma','UX design'],            'First hackathon, I work in Figma. Looking for a team that doesn''t mind I''m a beginner — ready for both coffee and learning along the way.', '@mina_uix'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_team', 'Luka',   'beginner',     array['python','AI basics'],           'I''m learning Python and trying to figure out how AI tools work. Going to my first hackathon, looking for a patient team.', 'luka@example.com'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_member','Petar',  'intermediate', array['react','node.js','typescript'], 'We have a team of two (React and Node) and we''re looking for a third for frontend. Beginners welcome — we''ll explain everything.', 'petar@dev.rs'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_member','Marko',  'intermediate', array['python','pandas','sql'],        'Looking for someone for data wrangling. Pandas experience is a plus but not a requirement — the main thing is that you want to take part.', 'marko@data.rs'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_team', 'Jelena', 'expert',       array['kubernetes','llm','python'],    'Engineer with eight years of experience, this time I''m in it for fun and mentoring. If your team needs someone who has seen production — reach out.', 'jelena@cloud.rs');

-- ============================================================
-- GOING (for buddy demo)
-- ============================================================
insert into going (event_id, profile_id, first_timer, buddy_profile_id) values
((select id from events where title = 'Garaža Frontier Hackathon'),
 (select id from profiles where nickname = 'Ana'), true, null),
((select id from events where title = 'Garaža Frontier Hackathon'),
 (select id from profiles where nickname = 'Luka'), true, null);

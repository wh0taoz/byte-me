-- Every Step Counts — demo seed. Re-runnable: truncate + re-insert, paste & run any time.
-- All dates are within 6 weeks of 2026-10-10. Level mix: 6 beginner / 6 intermediate / 3 expert.

truncate events, guides, profiles, going, team_posts restart identity cascade;

-- ============================================================
-- 15 EVENTS
-- ============================================================
insert into events (title, organizer, type, level, city, starts_at, ends_at, venue, registration_url, description, what_to_expect) values

-- 1. Wed 14 Oct, beginner workshop, Belgrade
('Git and GitHub for Complete Beginners', 'HUB 201', 'workshop', 'beginner', 'Belgrade',
 '2026-10-14 18:00+02', '2026-10-14 21:00+02', 'HUB 201, Kralja Petra 20',
 'https://hub201.rs/git-za-pocetnike',
 'Over three hours we walk through the core git commands — clone, commit, branch and merge — and resolve the kind of conflicts that happen in every team. By the end of the evening your code lives on GitHub, with a pull request you opened yourself. Bring a laptop and some curiosity; we have prepared everything else.',
 array['A short intro without code, then commands step by step',
       'Bring a laptop — we work on a real project',
       'No experience needed, mentors walk around the tables',
       'You leave with your first repository on GitHub']),

-- 2. Sat 17 Oct, beginner workshop, Belgrade
('ReDesign for Her: UX from the First Sketch', 'ReDesign zajednica', 'workshop', 'beginner', 'Belgrade',
 '2026-10-17 10:00+02', '2026-10-17 14:00+02', 'Startit Center, Kraljice Natalije 32',
 'https://redesign.rs/for-her-2026',
 'In a relaxed atmosphere we go through the whole UX process — user research, personas, wireframes and a prototype in Figma. After that we test the prototypes with teams from other tables and iterate based on feedback. Design experience is not needed; curiosity is.',
 array['You work in pairs, and teams are formed on the spot',
       'Bring a laptop or tablet with a free Figma account',
       'There are no wrong answers — sketching is allowed and encouraged',
       'Expect a friendly crowd and a workshop without pressure']),

-- 3. Tue 20 Oct, intermediate meetup, Belgrade
('Startit AI Hub: RAG Pipeline from Scratch', 'Startit', 'meetup', 'intermediate', 'Belgrade',
 '2026-10-20 18:30+02', '2026-10-20 21:00+02', 'Startit Center, Kraljice Natalije 32',
 'https://startit.rs/ai-hub-oktobar-2026',
 'A meetup dedicated to the RAG pipeline: chunking, embeddings and vector databases. We will show how documents are split, turned into embeddings and stored in Pgvector, and how an LLM queries the database to answer user questions. We close with a discussion about hallucinations and how to measure answer quality.',
 array['Two 30-minute technical talks, then a discussion',
       'Helpful but not required: Python and basic SQL',
       'After the meetup we stay for informal chats over drinks',
       'Recording and slides arrive by email after the event']),

-- 4. Thu 22 Oct, expert seminar, Belgrade
('Yettel Tech Talk: 5G Core in the Cloud', 'Yettel Srbija', 'seminar', 'expert', 'Belgrade',
 '2026-10-22 18:30+02', '2026-10-22 20:30+02', 'Yettel office building, Bulevar Zorana Đinđića',
 'https://yettel.rs/tech-talk-oktobar-2026',
 'What the 5G core looks like once it moves into Kubernetes: service mesh, stateful sets and zero-downtime upgrades of the radio network. We also touch the observability stack — OpenTelemetry, distributed tracing and how we protect a 99.999 percent SLA. The talk is given by the chief architect of the core network team.',
 array['One deep one-hour talk, then questions',
       'Aimed at engineers already working in cloud or telecom',
       'A rare chance to hear what a telecom backend looks like from the inside',
       'Refreshments and conversation with the engineers after the talk']),

-- 5. Fri 23 → Sun 25 Oct, beginner hackathon, Belgrade
('FONIS Hackathon 2026', 'FONIS', 'hackathon', 'beginner', 'Belgrade',
 '2026-10-23 16:00+02', '2026-10-25 16:00+02', 'FON, Jove Ilića 10',
 'https://fonis.rs/hakaton-2026',
 'The FONIS Hackathon: 48 hours, teams of up to four and topics from the world of AI applications. Mentors help from the first idea to the presentation — how to define the problem, what an MVP is and how to tell the story to the jury. Coffee and food are provided for all 48 hours.',
 array['Sign up alone or with a crew — we also form teams on the spot',
       'Bring a laptop and charger, food and drinks are on us',
       'No experience needed — mentors are there from Friday to Sunday',
       'Sunday is demo day: every team shows what they built']),

-- 6. Sat 24 Oct, intermediate workshop, Novi Sad
('Crafthub Workshop: CI/CD with GitHub Actions', 'Crafthub', 'workshop', 'intermediate', 'Novi Sad',
 '2026-10-24 11:00+02', '2026-10-24 16:00+02', 'Startit Center Novi Sad, Veljka Petrovića 2',
 'https://crafthub.rs/ci-cd-radionica',
 'A hands-on workshop: a CI/CD pipeline with GitHub Actions — from push to production. We write the workflow YAML step by step: build, test, containerization into a Docker image and deploy to a staging environment. At the end everyone has their own working automated pipeline.',
 array['You work on your own computer, step by step with the instructor',
       'Required: a GitHub account and basic comfort in the terminal',
       'The group is small, twenty seats, so everyone reaches the end',
       'Coffee together at the start — meeting each other before the code']),

-- 7. Wed 28 Oct, intermediate meetup, Belgrade
('Data Science Serbia #58: Model Serving in Production', 'Data Science Serbia', 'meetup', 'intermediate', 'Belgrade',
 '2026-10-28 19:00+02', '2026-10-28 21:30+02', 'ICT Hub, Kralja Milana 10',
 'https://dss.rs/meetup-58',
 'Why a model is not deployed like an ordinary API, what feature drift is and how to monitor it in production. In the second part of the meetup: a benchmark of vector databases — Pgvector, Qdrant and Weaviate — on queries in Serbian. A lively discussion about evaluating the results is expected.',
 array['Two 25-minute talks with a break in between',
       'The level is intermediate — no slides full of formulas, but there is code',
       'Come early for a better seat, the room fills up fast',
       'Afterwards we continue the conversation in the pub across the street, off the record']),

-- 8. Thu 29 Oct, beginner meetup, Niš
('Space Station Niš: First Steps in Web Development', 'Space Station Niš', 'meetup', 'beginner', 'Niš',
 '2026-10-29 18:00+02', '2026-10-29 20:30+02', 'Innovation Center Niš, University of Niš',
 'https://spacestationnis.rs/meetup-7',
 'A relaxed evening about how the internet actually works — what happens when you type an address, what is frontend and what is backend. On simple examples we put together a first web page from HTML and CSS. The goal of the evening: you leave with a clearer picture and your first page on the internet.',
 array['A talk without technical jargon, questions welcome at any moment',
       'Bring a laptop if you want to follow the examples — but you can come without one',
       'You can also just watch and take notes',
       'Entry is free, registration is only needed to count the seats']),

-- 9. Sat 31 Oct, beginner workshop, Online
('Online Introduction to Artificial Intelligence', 'AI Beginners Srbija', 'workshop', 'beginner', 'Online',
 '2026-10-31 10:00+02', '2026-10-31 13:00+02', 'Google Meet (link arrives by email)',
 'https://aibeginners.rs/online-uvod-2026',
 'What artificial intelligence is, and what a large language model is — without math. Through examples we show what the model does well, where it hallucinates and how to write a good prompt. The workshop is free and made for people touching the topic for the first time.',
 array['You join from home — the link arrives by email the day before',
       'No code and no math, only examples and conversation',
       'Questions go in the chat, we answer all of them',
       'The recording is shared with everyone who signed up after the workshop']),

-- 10. Wed 4 Nov, intermediate seminar, Belgrade
('BEST Course: Agile and Scrum in Practice', 'BEST Beograd', 'seminar', 'intermediate', 'Belgrade',
 '2026-11-04 18:00+02', '2026-11-04 20:00+02', 'Faculty of Electrical Engineering (ETF), Bulevar kralja Aleksandra 73',
 'https://bestbeograd.org.rs/course-jesen-2026',
 'Through a simulation of a real sprint we assign roles — product owner, scrum master and development team — and run it from planning to retrospective. We talk about the backlog, estimation and Daily meetings, but also about where agile breaks in practice. We close with a discussion of when waterfall is actually the better choice.',
 array['An interactive session — we work in groups of six',
       'No management knowledge needed, everything is explained',
       'You get a certificate of attendance at the end',
       'Registration closes the day before, seats are limited']),

-- 11. Sat 7 → Sun 8 Nov, beginner hackathon, Novi Sad (main demo hackathon)
('Garaža Frontier Hackathon', 'Garaža', 'hackathon', 'beginner', 'Novi Sad',
 '2026-11-07 09:00+02', '2026-11-08 18:00+02', 'Garaža, Zmaj Jovina 12',
 'https://garaza.rs/frontier-hackathon-2026',
 'The Frontier Hackathon: 33 hours, an open theme and teams of two to five. The focus is on first steps — how to pick an idea, what an MVP is, how to build a pitch and what the jury actually looks at. Mentors from Novi Sad IT companies circle the whole weekend, so nobody stays stuck.',
 array['Sign up alone — we form teams on Saturday morning',
       'Bring a laptop and charger, do not worry about food and coffee',
       'Experience does not matter: half of the participants are at their first hackathon',
       'Sunday at 5 pm: demo day and prizes for the three best teams']),

-- 12. Tue 10 Nov, intermediate meetup, Belgrade
('Nordeus Tech Meetup: Game Architecture in Production', 'Nordeus', 'meetup', 'intermediate', 'Belgrade',
 '2026-11-10 18:00+02', '2026-11-10 21:00+02', 'Nordeus, Bulevar Vojvođanske brigade',
 'https://nordeus.com/events/tech-meetup-novembar-2026',
 'What happens when a million players tap at the same time: game servers, matchmaking and live ops events. We talk about balancing a game economy without ruining the fun, and what the pipeline from idea to a live feature looks like. Bonus topic: what a day of a game programmer looks like in the biggest Serbian game studio.',
 array['Two shorter talks from the Nordeus engineering team',
       'A studio tour after the talks for anyone interested',
       'Registration is at the entrance, bring an ID — security asks for it',
       'Drinks and pizza after the program, with conversation with the engineers']),

-- 13. Thu 12 Nov, intermediate workshop, Belgrade
('Microsoft Developer Workshop: .NET 10 and GitHub Copilot', 'Microsoft Srbija', 'workshop', 'intermediate', 'Belgrade',
 '2026-11-12 17:00+02', '2026-11-12 20:00+02', 'Microsoft Srbija, Ulica Španskih boraca 3',
 'https://aka.ms/rs-dev-workshop-2026',
 'We will build a small web API in .NET 10, write tests and let GitHub Copilot write our boilerplate — and then judge what is acceptable and what needs a rework. The theme of the evening: what AI can do instead of us, and what we still have to do ourselves. We work in pairs, so everyone has a partner for code review.',
 array['A live workshop in the Microsoft office',
       'Basic knowledge of C# or a similar language is expected',
       'Bring a laptop with Visual Studio or VS Code set up',
       'Forty seats, registration is first come first served']),

-- 14. Sat 14 Nov, expert conference, Belgrade
('DevFest Belgrade 2026', 'GDG Beograd', 'conference', 'expert', 'Belgrade',
 '2026-11-14 09:00+02', '2026-11-14 18:00+02', 'Dom omladine Beograda, Makedonska 22',
 'https://gdgbelgrade.dev/devfest-2026',
 'One day, five parallel tracks and more than thirty talks — from Kotlin multiplatform through WebGPU to cloud cost optimization. The keynote is given by a principal engineer from Munich about the next generation of on-device models. Between talks: demo booths, lightning talks and street food in the yard.',
 array['More than thirty talks in five rooms — you pick what interests you',
       'The keynote is at 10 am, then tracks across the rooms',
       'The ticket covers lunch, coffee and the after-party',
       'Slides and recordings of all talks are available after the conference']),

-- 15. Sat 21 Nov, expert workshop, Belgrade
('EESTEC Advanced Workshop: Embedded Rust', 'EESTEC Beograd', 'workshop', 'expert', 'Belgrade',
 '2026-11-21 10:00+02', '2026-11-21 17:00+02', 'ETF, Bulevar kralja Aleksandra 73',
 'https://eestec-beograd.rs/advanced-workshop-2026',
 'We spend the whole day writing no_std Rust for ESP32 boards, reading sensors over the I2C protocol and fighting the borrow checker on hardware that shows no mercy. At the end every team has a small device that measures something and shows it on a display. The workshop is for people who already program confidently and want to step down from applications to the metal.',
 array['An advanced workshop — confident knowledge of some programming language is required',
       'Boards and sensors are provided, bring only a laptop',
       'We work in teams of three with mentors from the faculty',
       'Lunch and breaks are included in the workshop price']);

-- ============================================================
-- 3 GUIDES (English, plain language)
-- ============================================================
insert into guides (slug, title, body_md, emoji, "order") values

('sta-je-hakaton', 'What a Hackathon Is and What It Looks Like', E'A hackathon is an event where a group of people gathers, splits into teams and, in 24 to 48 hours, builds something from scratch — an app, a game, a website or a prototype. Sounds intimidating? We know. So let us break down the myths.\n\nFirst: you do not have to know how to program to come. Many teams need someone for design, for the presentation, for testing, or simply someone who asks good questions. At every hackathon there is at least one team with a first-time member — most often half of the participants are.\n\nWhat does the day look like? The first morning is for meeting people and forming teams — if you come alone, do not worry, others came alone too. Then the themes are announced, teams pick an idea and the work starts. Mentors walk between the teams and help when things get stuck. Some work through the night, some sleep at home — both are normal.\n\nThe last afternoon is for the demo: each team shows what they built in a few minutes. The jury does not expect a finished product, it expects a story — which problem you solved and how. If the app falls apart in the middle of a demo, it happens to the best teams too; people laugh and carry on.\n\nYour first hackathon is not something you forget. Come, see how it feels, and you have already made a bigger step than last month.', '🏆', 1),

('sta-ponijeti', 'What to Bring to Your First Meetup', E'Good news: for your first meetup you need almost nothing. Bad news: that is exactly why people overpack. Here is a short list that covers 95 percent of situations.\n\nBring: a laptop if the announcement says you will work on computers (check the what-to-expect section on the event page), a charger and a bottle of water. For hackathons add a power strip if you have one — there are never enough outlets. Keep the QR code or registration confirmation on your phone; do not print anything.\n\nPaper and a pen sound old-fashioned, but for notes during a talk they still work better than a phone. If you bring a laptop, pack your headphones too — you know yourself.\n\nWhat you do not need: special clothes (jeans and a t-shirt are perfectly fine), business cards (nobody asks for them) or knowledge about the topic — that is what the third guide is about.\n\nAnd the most important part: all of us once had those first uncomfortable minutes of not knowing anyone. They pass after the first conversation, and at meetups almost everyone comes alone.', '🎒', 2),

('smem-li-doci', 'Can I Come if I Know Nothing about the Topic?', E'Short answer: yes. Longer answer: yes, and here is why.\n\nAlmost every meetup, workshop or hackathon in Serbia counts on people coming for the first time. Organizers write it in the announcements, and speakers adjust their intro for exactly that reason. If you do not understand something, there is a good chance half the room does not either — they just do not dare to ask. You ask.\n\nWhat if the talk turns out to be too hard? That happens, and it is fine. Sit, listen as long as you can, and take away one thing that is clear to you. Nobody expects you to understand everything — often even the speaker does not count on that.\n\nIf the fear of people is bigger than the fear of the topic: come five minutes early and introduce yourself to the organizer. It is the easiest first conversation in the world, and their job is to connect you with another newcomer. At every event there are at least three people for whom this is also the first time.\n\nThe math is simple: if you take home one new thing you learned and one new acquaintance, the event was a success. And if you come only to see what it looks like — that is a step too. Every step counts.', '🤔', 3);

-- ============================================================
-- 4 PROFILES (Ana and Luka are first-timers for the buddy demo)
-- ============================================================
insert into profiles (nickname, level, interests, first_timer, steps) values
('Ana',   'beginner',     array['frontend','design'],           true,  0),
('Luka',  'beginner',     array['backend','AI'],                true,  0),
('Marko', 'intermediate', array['python','data','sql'],         false, 5),
('Jovana','expert',       array['devops','cloud','mentoring'],  false, 20);

-- ============================================================
-- 5 TEAM POSTS (all on the Garaža Frontier Hackathon)
-- ============================================================
insert into team_posts (event_id, kind, nickname, level, skills, message, contact) values
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_team', 'Mina',   'beginner',     array['figma','UX design'],           'First hackathon, I work in Figma. Looking for a team that does not mind I am a beginner — ready for coffee and for learning along the way.', '@mina_uix'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_team', 'Luka',   'beginner',     array['python','AI basics'],          'Learning Python and trying to figure out how AI tools work. Going to my first hackathon, looking for a patient team.', 'luka@example.com'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_member','Petar',  'intermediate', array['react','node.js','typescript'],'We have a team of two (React and Node) and are looking for a third for the frontend. Beginners welcome — we will explain everything.', 'petar@dev.rs'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_member','Marko',  'intermediate', array['python','pandas','sql'],      'Looking for someone for data work. Experience with the Pandas library is a plus but not a requirement — what matters is that you want to take part.', 'marko@data.rs'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_team', 'Jelena', 'expert',       array['kubernetes','llm','python'],   'An engineer with eight years of experience, this time going for fun and mentoring. If your team needs someone who has seen production — get in touch.', 'jelena@cloud.rs');

-- ============================================================
-- GOING (for buddy demo)
-- ============================================================
insert into going (event_id, profile_id, first_timer, buddy_profile_id) values
((select id from events where title = 'Garaža Frontier Hackathon'),
 (select id from profiles where nickname = 'Ana'), true, null),
((select id from events where title = 'Garaža Frontier Hackathon'),
 (select id from profiles where nickname = 'Luka'), true, null);

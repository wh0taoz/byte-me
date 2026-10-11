-- Every Step Counts — demo seed. Re-runnable: truncate + re-insert, paste & run any time.
-- All dates are within 7 weeks of 2026-10-10. Level mix: 11 beginner / 14 intermediate / 10 expert.

truncate events, guides, profiles, going, team_posts restart identity cascade;

-- ============================================================
-- 35 EVENTS
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
 '2026-10-28 19:00+01', '2026-10-28 21:30+01', 'ICT Hub, Kralja Milana 10',
 'https://dss.rs/meetup-58',
 'Why a model is not deployed like an ordinary API, what feature drift is and how to monitor it in production. In the second part of the meetup: a benchmark of vector databases — Pgvector, Qdrant and Weaviate — on queries in Serbian. A lively discussion about evaluating the results is expected.',
 array['Two 25-minute talks with a break in between',
       'The level is intermediate — no slides full of formulas, but there is code',
       'Come early for a better seat, the room fills up fast',
       'Afterwards we continue the conversation in the pub across the street, off the record']),

-- 8. Thu 29 Oct, beginner meetup, Niš
('Space Station Niš: First Steps in Web Development', 'Space Station Niš', 'meetup', 'beginner', 'Niš',
 '2026-10-29 18:00+01', '2026-10-29 20:30+01', 'Innovation Center Niš, University of Niš',
 'https://spacestationnis.rs/meetup-7',
 'A relaxed evening about how the internet actually works — what happens when you type an address, what is frontend and what is backend. On simple examples we put together a first web page from HTML and CSS. The goal of the evening: you leave with a clearer picture and your first page on the internet.',
 array['A talk without technical jargon, questions welcome at any moment',
       'Bring a laptop if you want to follow the examples — but you can come without one',
       'You can also just watch and take notes',
       'Entry is free, registration is only needed to count the seats']),

-- 9. Sat 31 Oct, beginner workshop, Online
('Online Introduction to Artificial Intelligence', 'AI Beginners Srbija', 'workshop', 'beginner', 'Online',
 '2026-10-31 10:00+01', '2026-10-31 13:00+01', 'Google Meet (link arrives by email)',
 'https://aibeginners.rs/online-uvod-2026',
 'What artificial intelligence is, and what a large language model is — without math. Through examples we show what the model does well, where it hallucinates and how to write a good prompt. The workshop is free and made for people touching the topic for the first time.',
 array['You join from home — the link arrives by email the day before',
       'No code and no math, only examples and conversation',
       'Questions go in the chat, we answer all of them',
       'The recording is shared with everyone who signed up after the workshop']),

-- 10. Wed 4 Nov, intermediate seminar, Belgrade
('BEST Course: Agile and Scrum in Practice', 'BEST Beograd', 'seminar', 'intermediate', 'Belgrade',
 '2026-11-04 18:00+01', '2026-11-04 20:00+01', 'Faculty of Electrical Engineering (ETF), Bulevar kralja Aleksandra 73',
 'https://bestbeograd.org.rs/course-jesen-2026',
 'Through a simulation of a real sprint we assign roles — product owner, scrum master and development team — and run it from planning to retrospective. We talk about the backlog, estimation and Daily meetings, but also about where agile breaks in practice. We close with a discussion of when waterfall is actually the better choice.',
 array['An interactive session — we work in groups of six',
       'No management knowledge needed, everything is explained',
       'You get a certificate of attendance at the end',
       'Registration closes the day before, seats are limited']),

-- 11. Sat 7 → Sun 8 Nov, beginner hackathon, Novi Sad (main demo hackathon)
('Garaža Frontier Hackathon', 'Garaža', 'hackathon', 'beginner', 'Novi Sad',
 '2026-11-07 09:00+01', '2026-11-08 18:00+01', 'Garaža, Zmaj Jovina 12',
 'https://garaza.rs/frontier-hackathon-2026',
 'The Frontier Hackathon: 33 hours, an open theme and teams of two to five. The focus is on first steps — how to pick an idea, what an MVP is, how to build a pitch and what the jury actually looks at. Mentors from Novi Sad IT companies circle the whole weekend, so nobody stays stuck.',
 array['Sign up alone — we form teams on Saturday morning',
       'Bring a laptop and charger, do not worry about food and coffee',
       'Experience does not matter: half of the participants are at their first hackathon',
       'Sunday at 5 pm: demo day and prizes for the three best teams']),

-- 12. Tue 10 Nov, intermediate meetup, Belgrade
('Nordeus Tech Meetup: Game Architecture in Production', 'Nordeus', 'meetup', 'intermediate', 'Belgrade',
 '2026-11-10 18:00+01', '2026-11-10 21:00+01', 'Nordeus, Bulevar Vojvođanske brigade',
 'https://nordeus.com/events/tech-meetup-novembar-2026',
 'What happens when a million players tap at the same time: game servers, matchmaking and live ops events. We talk about balancing a game economy without ruining the fun, and what the pipeline from idea to a live feature looks like. Bonus topic: what a day of a game programmer looks like in the biggest Serbian game studio.',
 array['Two shorter talks from the Nordeus engineering team',
       'A studio tour after the talks for anyone interested',
       'Registration is at the entrance, bring an ID — security asks for it',
       'Drinks and pizza after the program, with conversation with the engineers']),

-- 13. Thu 12 Nov, intermediate workshop, Belgrade
('Microsoft Developer Workshop: .NET 10 and GitHub Copilot', 'Microsoft Srbija', 'workshop', 'intermediate', 'Belgrade',
 '2026-11-12 17:00+01', '2026-11-12 20:00+01', 'Microsoft Srbija, Ulica Španskih boraca 3',
 'https://aka.ms/rs-dev-workshop-2026',
 'We will build a small web API in .NET 10, write tests and let GitHub Copilot write our boilerplate — and then judge what is acceptable and what needs a rework. The theme of the evening: what AI can do instead of us, and what we still have to do ourselves. We work in pairs, so everyone has a partner for code review.',
 array['A live workshop in the Microsoft office',
       'Basic knowledge of C# or a similar language is expected',
       'Bring a laptop with Visual Studio or VS Code set up',
       'Forty seats, registration is first come first served']),

-- 14. Sat 14 Nov, expert conference, Belgrade
('DevFest Belgrade 2026', 'GDG Beograd', 'conference', 'expert', 'Belgrade',
 '2026-11-14 09:00+01', '2026-11-14 18:00+01', 'Dom omladine Beograda, Makedonska 22',
 'https://gdgbelgrade.dev/devfest-2026',
 'One day, five parallel tracks and more than thirty talks — from Kotlin multiplatform through WebGPU to cloud cost optimization. The keynote is given by a principal engineer from Munich about the next generation of on-device models. Between talks: demo booths, lightning talks and street food in the yard.',
 array['More than thirty talks in five rooms — you pick what interests you',
       'The keynote is at 10 am, then tracks across the rooms',
       'The ticket covers lunch, coffee and the after-party',
       'Slides and recordings of all talks are available after the conference']),

-- 15. Sat 21 Nov, expert workshop, Belgrade
('EESTEC Advanced Workshop: Embedded Rust', 'EESTEC Beograd', 'workshop', 'expert', 'Belgrade',
 '2026-11-21 10:00+01', '2026-11-21 17:00+01', 'ETF, Bulevar kralja Aleksandra 73',
 'https://eestec-beograd.rs/advanced-workshop-2026',
 'We spend the whole day writing no_std Rust for ESP32 boards, reading sensors over the I2C protocol and fighting the borrow checker on hardware that shows no mercy. At the end every team has a small device that measures something and shows it on a display. The workshop is for people who already program confidently and want to step down from applications to the metal.',
 array['An advanced workshop — confident knowledge of some programming language is required',
       'Boards and sensors are provided, bring only a laptop',
       'We work in teams of three with mentors from the faculty',
       'Lunch and breaks are included in the workshop price']),

-- 16. Thu 5 → Fri 6 Nov, expert conference, Belgrade
('Heapcon 2026', 'Heapspace', 'conference', 'expert', 'Belgrade',
 '2026-11-05 09:00+01', '2026-11-06 18:30+01', 'Kolarac Endowment, Studentski trg 11',
 'https://heapcon.rs/2026',
 'Heapcon is the annual conference of the Heapspace community for developers who ship software: two tracks on backend performance, distributed systems and developer experience. Talks go deep into profiling flame graphs, garbage collector tuning, event sourcing and the tradeoffs of eventual consistency. The hallway track is part of the program, so expect sharp arguments about programming languages until late.',
 array['Two days of talks in two tracks, no workshops',
       'Talks assume you build software for a living',
       'Short lightning talks between the main ones',
       'Tickets sell out, decide early']),

-- 17. Wed 4 → Thu 5 Nov, intermediate conference, Belgrade
('BIZIT 2026', 'BIZIT', 'conference', 'intermediate', 'Belgrade',
 '2026-11-04 09:00+01', '2026-11-05 16:00+01', 'Belexpo Centar, Bulevar Vojvode Mišića 18',
 'https://bizit.rs/2026',
 'BIZIT gathers the business and IT sides of companies: digital transformation, ERP implementations and product management in large organizations. Presentations cover integration platforms, process mining and change management when a new system replaces twenty years of spreadsheets. Case studies come from banks, telecoms and public administration.',
 array['Two days of case studies from regional companies',
       'Talks sit between business and technology, no code on slides',
       'Panels with people who decide on IT budgets',
       'A good place to meet managers and companies']),

-- 18. Tue 24 → Thu 26 Nov, expert conference, Belgrade
('TELFOR 2026', 'ETF Belgrade', 'conference', 'expert', 'Belgrade',
 '2026-11-24 09:00+01', '2026-11-26 16:00+01', 'ETF, Bulevar kralja Aleksandra 73',
 'https://telfor.rs/2026',
 'TELFOR is the traditional telecommunications forum: three days of papers on radio access networks, optical transport, signal processing and spectrum policy. Sessions run in English and Serbian, and every paper is reviewed before it reaches the program. The exhibition floor shows test and measurement equipment from operator networks.',
 array['Scientific program, each paper gets twenty minutes',
       'Presentations in English and Serbian',
       'Students have their own session and a jury',
       'Registration is cheaper for students and IEEE members']),

-- 19. Sun 25 Oct, beginner meetup, Belgrade
('Python Belgrade Monthly Meetup', 'Python Belgrade', 'meetup', 'beginner', 'Belgrade',
 '2026-10-25 18:00+01', '2026-10-25 21:00+01', 'ICT Hub, Kralja Milana 10',
 'https://pythonbelgrade.rs/meetup-oktobar-2026',
 'An evening with two talks: a gentle tour of async and await in Python and when they actually help, then building a command line tool in Typer and publishing it to PyPI. Between talks there is time for questions, lightning announcements and the traditional pub continuation. All levels are welcome.',
 array['Two talks, the first one friendly to complete beginners',
       'No Python experience needed to follow the story',
       'The second half is open conversation',
       'We continue in the pub next door afterwards']),

-- 20. Tue 27 Oct, beginner meetup, Belgrade
('JS Belgrade Monthly Meetup', 'JS Belgrade', 'meetup', 'beginner', 'Belgrade',
 '2026-10-27 18:30+01', '2026-10-27 21:30+01', 'HUB 201, Kralja Petra 20',
 'https://jsbelgrade.rs/meetup-oktobar-2026',
 'Two talks about the modern web platform: what the V8 engine does between your source file and the CPU, and how React server components change where your code runs. We close with a live session on finding memory leaks in browser DevTools. Questions from beginners are explicitly welcome.',
 array['Two talks with a break, then open discussion',
       'Recordings land on the YouTube channel afterwards',
       'Bring a laptop if you want to follow the demo',
       'Free entry, registration only counts the seats']),

-- 21. Fri 30 Oct, beginner meetup, Niš
('NišJS Meetup', 'NišJS', 'meetup', 'beginner', 'Niš',
 '2026-10-30 18:00+01', '2026-10-30 20:30+01', 'Innovation Center Niš, University of Niš',
 'https://nisjs.rs/meetup-oktobar-2026',
 'A meetup of the Niš JavaScript community: this month a talk about how bundlers work — parse, transform, minify — and why the node_modules folder grows so large. The second part is a show and tell of small side projects from the community. The atmosphere is informal.',
 array['One talk, then anyone can show what they are building',
       'Half of the audience is at their first meetup',
       'Free entry, registration just counts the seats',
       'We go for a drink together afterwards']),

-- 22. Fri 6 Nov, intermediate meetup, Niš
('NisJUG Java User Group', 'NisJUG', 'meetup', 'intermediate', 'Niš',
 '2026-11-06 18:00+01', '2026-11-06 20:30+01', 'Faculty of Electronic Engineering Niš, Aleksandra Medvedeva 14',
 'https://nisjug.rs/meetup-novembar-2026',
 'The Niš Java User Group meets at the faculty of electronic engineering: this session covers JVM garbage collectors after the generational ZGC change, plus a practical part on profiling a Spring Boot service under load. Expect live flame graphs and long arguments about heap sizes.',
 array['A technical talk, then hands-on profiling on provided laptops',
       'Best if you already write Java or a similar language',
       'Students from the faculty get the front seats',
       'The speaker stays for questions after the session']),

-- 23. Tue 3 Nov, intermediate meetup, Belgrade
('Kubernetes Belgrade Meetup', 'Kubernetes Belgrade', 'meetup', 'intermediate', 'Belgrade',
 '2026-11-03 18:30+01', '2026-11-03 21:30+01', 'Endava, Ulica Kneza Miloša 33',
 'https://kubernetesbelgrade.rs/meetup-novembar-2026',
 'This month: GitOps with Argo CD — how a git commit becomes a deployment, rollbacks included. The second talk covers pod autoscaling under real traffic and why the horizontal pod autoscaler needs custom metrics. A short hands-on slot lets everyone deploy a demo app to a local cluster.',
 array['Two talks plus a short hands-on demo',
       'Basic Docker knowledge helps, the rest is explained',
       'Bring a laptop if you want to deploy along',
       'Pizza and drinks during the break']),

-- 24. Wed 11 Nov, intermediate meetup, Belgrade
('DevOps Meetup Belgrade', 'DevOps Belgrade', 'meetup', 'intermediate', 'Belgrade',
 '2026-11-11 18:00+01', '2026-11-11 21:00+01', 'Vega IT, Bulevar Zorana Đinđića 80',
 'https://devopsbelgrade.rs/meetup-novembar-2026',
 'An evening about the unglamorous parts of the pipeline: secrets management with Vault, tracing with OpenTelemetry and post-mortems after incidents. The main talk walks through a real production outage and what the blameless retrospective changed afterwards. We close with a tooling show and tell.',
 array['One main talk, one short one, then discussion',
       'For people who run systems, or plan to',
       'Engineers present their own setups, no sales talks',
       'Questions during the talks are fine']),

-- 25. Thu 19 Nov, intermediate meetup, Belgrade
('Game Dev Meetup by SGA', 'SGA', 'meetup', 'intermediate', 'Belgrade',
 '2026-11-19 18:00+01', '2026-11-19 21:00+01', 'Startit Center, Kraljice Natalije 32',
 'https://sga.rs/meetup-novembar-2026',
 'The Serbian Games Association meetup: a talk about procedural content generation in Unity — noise functions, tile based generation and keeping the result fun to play. The second slot is a portfolio review where artists and designers get honest feedback. Studios from Belgrade usually come to scout.',
 array['A technical talk, then portfolio review in small groups',
       'For artists, designers and programmers alike',
       'Local studios come to look for people',
       'Registration helps us count the pizza']),

-- 26. Sat 14 → Sun 15 Nov, intermediate hackathon, Belgrade
('FON Hackathon: Web4 Challenge', 'FON', 'hackathon', 'intermediate', 'Belgrade',
 '2026-11-14 10:00+01', '2026-11-15 18:00+01', 'FON, Jove Ilića 10',
 'https://fon.rs/hakaton-web4-2026',
 'The Web4 Challenge at FON: a weekend around decentralized identity, verifiable credentials and what a semantic web application looks like in practice. Teams get API credits from sponsors and mentors who have shipped products in this space. The jury values a working demo over a whitepaper.',
 array['Teams of three to five, formed on Saturday morning',
       'Bring a laptop, mentors handle the rest',
       'The opening session explains the Web4 basics',
       'Sunday afternoon is demo day with sponsor prizes']),

-- 27. Sun 15 Nov, expert conference, Belgrade
('Bubble Cup Finals 2026', 'Microsoft Development Center Serbia', 'conference', 'expert', 'Belgrade',
 '2026-11-15 09:00+01', '2026-11-15 16:00+01', 'Ušće Business Center, Bulevar Mihajla Pupina 6',
 'https://bubblecup.com/finals-2026',
 'The finals of the Bubble Cup competitive programming tournament: the best teams from the region solve problems live on stage, with commentary. After the contest an engineer from the organizing team explains the intended solutions and the trick behind the hardest problem. The atmosphere is a sports final for algorithms.',
 array['Live competitive programming finals with commentary',
       'The problems are explained after the contest',
       'You can solve along on your own laptop',
       'For lovers of algorithms, heavy math on the screen']),

-- 28. Thu 12 Nov, expert conference, Niš
('Forum of Advanced Technologies (FNT)', 'FNT', 'conference', 'expert', 'Niš',
 '2026-11-12 09:00+01', '2026-11-12 17:00+01', 'Science Technology Park Niš',
 'https://fntnis.rs/2026',
 'FNT gathers the advanced manufacturing and deep tech scene of southern Serbia: industrial automation, photonics, PCB design and embedded control systems. Exhibitors range from university labs to suppliers for automotive production lines. The conference program connects research groups with factories looking for automation.',
 array['Exhibition floor plus a full day of talks',
       'Talks aim at engineers and researchers',
       'Students enter free with a student card',
       'Meetings between laboratories and companies all day']),

-- 29. Wed 18 Nov, intermediate meetup, Novi Sad
('NS Tech Connect', 'NS Tech', 'meetup', 'intermediate', 'Novi Sad',
 '2026-11-18 18:30+01', '2026-11-18 21:30+01', 'Startit Center Novi Sad, Veljka Petrovića 2',
 'https://nstech.rs/connect-2026',
 'The Novi Sad meetup for people between disciplines: this edition pairs a talk on search relevance engineering with one on onboarding design for developer tools. The format is short talks and long breaks, because the point is the conversations in between. Recruiters are politely asked to listen, not to pitch.',
 array['Two short talks, long breaks in between',
       'A mixed crowd of developers, designers and product people',
       'Come alone, the format starts new conversations',
       'Free with registration, drinks covered by sponsors']),

-- 30. Sun 8 → Tue 10 Nov, expert conference, Novi Sad
('IS 26 Conference', 'ZNIS', 'conference', 'expert', 'Novi Sad',
 '2026-11-08 09:00+01', '2026-11-10 16:00+01', 'Fakultet tehničkih nauka (FTN), Trg Dositeja Obradovića 6',
 'https://znis.rs/is-26',
 'IS 26 is the international conference on information society technologies: three days of refereed papers on data engineering, software quality and human-computer interaction. Sessions run in parallel tracks, each paper gets a discussant, and the best papers go to a journal special issue. The proceedings are indexed, so citations matter here.',
 array['Academic conference, three days of parallel tracks',
       'Presentations in English, each followed by questions',
       'Registration includes the printed proceedings',
       'Students can volunteer for free entry']),

-- 31. Sun 8 → Tue 10 Nov, beginner workshop, Kragujevac
('ParkUP! Student Startup Camp', 'ParkUP', 'workshop', 'beginner', 'Kragujevac',
 '2026-11-08 10:00+01', '2026-11-10 18:00+01', 'Fakultet inženjerskih nauka (FINK), Sestre Janjić 6',
 'https://parkup.rs/2026',
 'ParkUP! is a three-day camp where student teams turn rough ideas into pitched startups: customer discovery, the lean canvas and a demo that has to work on the last day. Mentors from Belgrade and Kragujevac startups rotate between the teams. No business experience is expected.',
 array['A camp, not a lecture, you work on your own idea',
       'Teams of two to four, formed on the first morning',
       'No experience needed, mentors explain every step',
       'The last day is pitch day in front of a friendly jury']),

-- 32. Wed 28 Oct, beginner meetup, Novi Sad
('LUGoNS Linux User Group', 'LUGoNS', 'meetup', 'beginner', 'Novi Sad',
 '2026-10-28 18:00+01', '2026-10-28 20:30+01', 'LUGoNS hackerspace, Bulevar Oslobođenja 92',
 'https://lugons.org/meetup-oktobar-2026',
 'The Novi Sad Linux user group meets monthly: this time a hands-on session on installing Arch Linux the manual way — partitioning, chroot and a window manager that does nothing until you configure it. Bring a laptop, or just watch someone else fix their bootloader. All questions get answers.',
 array['A hands-on session, you can follow on your own laptop',
       'Absolute beginners welcome, we start from zero',
       'Free entry, no registration needed',
       'The group is small, so everyone gets attention']),

-- 33. Fri 20 → Sat 21 Nov, expert conference, Subotica
('MLC — Machine Learning Conference', 'MLC', 'conference', 'expert', 'Subotica',
 '2026-11-20 09:00+01', '2026-11-21 17:00+01', 'Open University Subotica, Segedinski put 21',
 'https://mlc.rs/2026',
 'MLC brings the machine learning community to Subotica: invited talks on diffusion models, quantization of large language models and evaluation under distribution shift. The second day is hands-on, with a guided lab on fine-tuning a small model on local hardware. Papers and demos fill the poster session in between.',
 array['Invited talks the first day, a hands-on lab the second',
       'The lab has computers, you can come without a laptop',
       'Aimed at people already working with machine learning',
       'Student tickets are half price']),

-- 34. Sun 22 Nov, expert conference, Niš
('TechIntelligence 2026', 'TechIntelligence', 'conference', 'expert', 'Niš',
 '2026-11-22 09:00+01', '2026-11-22 17:00+01', 'Science Technology Park Niš',
 'https://techintelligence.rs/2026',
 'A one-day conference on data platforms and applied machine learning: streaming with Kafka, feature stores and real-time fraud detection case studies from regional banks. The closing panel argues whether retrieval-augmented generation is a product or a feature. Talks are dense and assume a data background.',
 array['One day, one track, eight talks',
       'Talks assume you work with data or machine learning',
       'A long lunch break with exhibitor booths',
       'Certificates of attendance for students']),

-- 35. Mon 16 → Sun 22 Nov, intermediate conference, Belgrade
('Belgrade Blockchain Week 2026', 'Blockchain Srbija', 'conference', 'intermediate', 'Belgrade',
 '2026-11-16 18:00+01', '2026-11-22 20:00+01', 'Various venues across Belgrade — see the schedule',
 'https://blockchainweek.rs/2026',
 'A week of events across Belgrade about distributed ledgers: workshops on writing and auditing smart contracts, panels on regulation under MiCA, and a hackathon weekend that closes the program. Venues change daily, as companies and hubs each host one evening. The full schedule lives on the website.',
 array['A different event every evening, all over the city',
       'The weekend hackathon closes the week',
       'Each evening needs its own registration on the website',
       'A mixed crowd, from the curious to professional auditors']);

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

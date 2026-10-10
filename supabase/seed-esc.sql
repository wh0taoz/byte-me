-- Every Step Counts — demo seed. Re-runnable: truncate + re-insert, paste & run any time.
-- All dates are within 6 weeks of 2026-10-10. Level mix: 6 beginner / 6 intermediate / 3 expert.

truncate events, guides, profiles, going, team_posts restart identity cascade;

-- ============================================================
-- 15 EVENTS
-- ============================================================
insert into events (title, organizer, type, level, city, starts_at, ends_at, venue, registration_url, description, what_to_expect) values

-- 1. Wed 14 Oct, beginner workshop, Beograd
('Git i GitHub za potpune početnike', 'HUB 201', 'workshop', 'beginner', 'Beograd',
 '2026-10-14 18:00+02', '2026-10-14 21:00+02', 'HUB 201, Kralja Petra 20',
 'https://hub201.rs/git-za-pocetnike',
 'Kroz tri sata prolazimo kroz osnovne git komande — clone, commit, branch i merge — i rešavamo konflikte kakvi se dešavaju u svakom timu. Na kraju večeri tvoj kod živi na GitHub-u, sa pull request-om koji si sam otvorio. Ponesi laptop i malo radoznalosti, sve ostalo smo pripremili.',
 array['Kratak uvod bez koda, pa komande korak po korak',
       'Ponesi laptop — radićemo na pravom projektu',
       'Nije potrebno nikakvo iskustvo, mentori prolaze oko stolova',
       'Odlaziš sa svojim prvim repozitorijumom na GitHub-u']),

-- 2. Sat 17 Oct, beginner workshop, Beograd
('ReDesign for Her: UX od prve skice', 'ReDesign zajednica', 'workshop', 'beginner', 'Beograd',
 '2026-10-17 10:00+02', '2026-10-17 14:00+02', 'Startit centar, Kraljice Natalije 32',
 'https://redesign.rs/for-her-2026',
 'U vedroj atmosferi prolazimo kroz ceo UX proces — user research, persona, wireframe i prototip u Figmi. Nakon toga testiramo prototipe na ekipi sa drugih stolova i iteriramo na osnovu povratnih informacija. Dizajnersko iskustvo nije potrebno, radoznalost jeste.',
 array['Radi se u parovima, a timovi se prave na licu mesta',
       'Ponesi laptop ili tablet sa besplatnim Figma nalogom',
       'Nema pogrešnih odgovora — skiciranje je dozvoljeno i poželjno',
       'Očekuj prijatnu ekipu i radionicu bez pritiska']),

-- 3. Tue 20 Oct, intermediate meetup, Beograd
('Startit AI Hub: RAG pipeline od nule', 'Startit', 'meetup', 'intermediate', 'Beograd',
 '2026-10-20 18:30+02', '2026-10-20 21:00+02', 'Startit centar, Kraljice Natalije 32',
 'https://startit.rs/ai-hub-oktobar-2026',
 'Meetup posvećen RAG pipeline-u: chunking, embeddingi i vektorske baze. Pokazaćemo kako se dokumenti seckaju, pretvaraju u embeddinge i čuvaju u Pgvector-u, i kako LLM poziva bazu da odgovori na pitanja korisnika. Na kraju diskutujemo o halucinacijama i kako meriti kvalitet odgovora.',
 array['Dva tehnička izlaganja po 30 minuta, pa diskusija',
       'Koristan, ali ne obavezan osnov: Python i osnovni SQL',
       'Posle meetupa ostajemo na neformalnom ćaskanju uz piće',
       'Snimak i slajdovi stižu mejlom posle događaja']),

-- 4. Thu 22 Oct, expert seminar, Beograd
('Yettel Tech Talk: 5G core u oblaku', 'Yettel Srbija', 'seminar', 'expert', 'Beograd',
 '2026-10-22 18:30+02', '2026-10-22 20:30+02', 'Yettel poslovna zgrada, Bulevar Zorana Đinđića',
 'https://yettel.rs/tech-talk-oktobar-2026',
 'Kako izgleda 5G core kada se preseli u Kubernetes: service mesh, stateful set-ovi i zero-downtime nadogradnje radio mreže. Dotaknućemo i observability stack — OpenTelemetry, distributed tracing i kako čuvamo SLA od 99.999 posto. Predavanje drži glavni arhitekta tima za core mrežu.',
 array['Jedno duboko predavanje od sat vremena, pa pitanja',
       'Namenski za inženjere koji već rade u oblaku ili telekomunikacijama',
       'Retka prilika da čuješ kako backend telekoma izgleda iznutra',
       'Osveženje i razgovor sa inženjerima posle talka']),

-- 5. Fri 23 → Sun 25 Oct, beginner hackathon, Beograd
('FONIS Hakaton 2026', 'FONIS', 'hackathon', 'beginner', 'Beograd',
 '2026-10-23 16:00+02', '2026-10-25 16:00+02', 'FON, Jove Ilića 10',
 'https://fonis.rs/hakaton-2026',
 'FONIS Hakaton: 48 sati, timovi do četiri člana i teme iz sveta AI aplikacija. Mentori pomažu od prve ideje do prezentacije — kako definisati problem, šta je MVP i kako ispričati priču žiriju. Kafa i hrana su obezbeđene svih 48 sati.',
 array['Prijavljuješ se sam ili sa ekipom — timove formiramo i na licu mesta',
       'Ponesi laptop i punjač, hranu i piće obezbeđujemo mi',
       'Iskustvo nije potrebno — mentori su tu od petka do nedelje',
       'Nedelja je demo dan: svaki tim pokazuje šta je napravio']),

-- 6. Sat 24 Oct, intermediate workshop, Novi Sad
('Crafthub radionica: CI/CD sa GitHub Actions', 'Crafthub', 'workshop', 'intermediate', 'Novi Sad',
 '2026-10-24 11:00+02', '2026-10-24 16:00+02', 'Startit centar Novi Sad, Veljka Petrovića 2',
 'https://crafthub.rs/ci-cd-radionica',
 'Hands-on radionica: CI/CD pipeline sa GitHub Actions — od push-a do produkcije. Pišemo workflow YAML korak po korak: build, test, containerizacija u Docker image i deploy na staging okruženje. Na kraju svako ima svoj automatski pipeline koji radi.',
 array['Radi se na sopstvenom računaru, korak po korak sa predavačem',
       'Potrebno: GitHub nalog i osnovno snalaženje u terminalu',
       'Grupa je mala, dvadeset mesta, da svi stignemo do kraja',
       'Zajednička kafa na početku — upoznavanje pre koda']),

-- 7. Wed 28 Oct, intermediate meetup, Beograd
('Data Science Serbia #58: Model serving u produkciji', 'Data Science Serbia', 'meetup', 'intermediate', 'Beograd',
 '2026-10-28 19:00+02', '2026-10-28 21:30+02', 'ICT Hub, Kralja Milana 10',
 'https://dss.rs/meetup-58',
 'Zašto se model ne deploy-uje kao običan API, šta je feature drift i kako ga monitoriti u produkciji. U drugom delu meetup-a: benchmark vektorskih baza — Pgvector, Qdrant i Weaviate — na upitima na srpskom jeziku. Očekuje se živa diskusija o evaluaciji rezultata.',
 array['Dva izlaganja po 25 minuta sa pauzom između',
       'Nivo je srednji — nema tablica sa formulama, ali ima koda',
       'Dođi ranije za bolje mesto, sala se brzo popuni',
       'Posle nastavljamo razgovor u kafani preko puta, van programa']),

-- 8. Thu 29 Oct, beginner meetup, Niš
('Space Station Niš: Prvi koraci u web razvoju', 'Space Station Niš', 'meetup', 'beginner', 'Niš',
 '2026-10-29 18:00+02', '2026-10-29 20:30+02', 'Inovacioni centar Niš, Univerzitet u Nišu',
 'https://spacestationnis.rs/meetup-7',
 'Opuštena večer o tome kako internet uopšte radi — šta se desi kada otkucaš adresu, šta je frontend, a šta backend. Na jednostavnim primerima sklapamo prvu web stranicu od HTML-a i CSS-a. Cilj večeri: da izađeš sa jasnijom slikom i svojom prvom stranicom na internetu.',
 array['Izlaganje bez stručnih reči, pitanja u svakom trenutku',
       'Ponesi laptop ako hoćeš da pratiš primere — ali može i bez',
       'Možeš i samo da gledaš i pišeš beleške',
       'Ulaz je slobodan, prijava je potrebna samo zbog mesta']),

-- 9. Sat 31 Oct, beginner workshop, Online
('Online uvod u veštačku inteligenciju', 'AI Beginners Srbija', 'workshop', 'beginner', 'Online',
 '2026-10-31 10:00+02', '2026-10-31 13:00+02', 'Google Meet (link dolazi mejlom)',
 'https://aibeginners.rs/online-uvod-2026',
 'Šta je veštačka inteligencija, a šta large language model — bez matematike. Kroz primere pokazujemo šta model radi dobro, gde halucinira i kako se piše dobar prompt. Radionica je besplatna i potpuno namenjena ljudima koji prvi put dodiruju temu.',
 array['Učestvuješ od kuće — link dobijaš mejlom dan ranije',
       'Nema koda i nema matematike, samo primeri i razgovor',
       'Pitanja se pišu u chat, odgovaramo na sva',
       'Snimak se deli svim prijavljenima posle radionice']),

-- 10. Wed 4 Nov, intermediate seminar, Beograd
('BEST Course: Agile i Scrum u praksi', 'BEST Beograd', 'seminar', 'intermediate', 'Beograd',
 '2026-11-04 18:00+02', '2026-11-04 20:00+02', 'Elektrotehnički fakultet, Bulevar kralja Aleksandra 73',
 'https://bestbeograd.org.rs/course-jesen-2026',
 'Kroz simulaciju pravog sprinta dodeljujemo role — product owner, scrum master i development tim — i vodimo ga od planiranja do retrospektive. Govorimo o backlog-u, estimaciji i Daily sastancima, ali i o tome gde agile puca u praksi. Na kraju diskutujemo kada je waterfall zapravo bolji izbor.',
 array['Interaktivna sesija — radićemo u grupama po šestoro',
       'Znanje o menadžmentu nije potrebno, sve se objasni',
       'Dobijaš sertifikat o pohađanju na kraju',
       'Prijave se zatvaraju dan ranije, mesta su ograničena']),

-- 11. Sat 7 → Sun 8 Nov, beginner hackathon, Novi Sad (main demo hackathon)
('Garaža Frontier Hackathon', 'Garaža', 'hackathon', 'beginner', 'Novi Sad',
 '2026-11-07 09:00+02', '2026-11-08 18:00+02', 'Garaža, Zmaj Jovina 12',
 'https://garaza.rs/frontier-hackathon-2026',
 'Frontier Hackathon: 33 sata, open theme i timovi od dva do pet članova. Fokus je na prvim koracima — kako se bira ideja, šta je MVP, kako se pravi pitch i šta žiri zapravo gleda. Mentori iz novosadskih IT kompanija kruže ceo vikend, pa niko ne ostaje zaglavljen.',
 array['Prijavi se sam — subotom ujutru formiramo timove',
       'Ponesi laptop i punjač, za hranu i kafu se ne brini',
       'Iskustvo nije bitno: pola učesnika je na prvom hakatonu',
       'Nedelja u 17č: demo dan i nagrade za tri najbolja tima']),

-- 12. Tue 10 Nov, intermediate meetup, Beograd
('Nordeus Tech Meetup: Arhitektura igre u produkciji', 'Nordeus', 'meetup', 'intermediate', 'Beograd',
 '2026-11-10 18:00+02', '2026-11-10 21:00+02', 'Nordeus, Bulevar Vojvođanske brigade',
 'https://nordeus.com/events/tech-meetup-novembar-2026',
 'Šta se dešava kada milion igrača klikne istovremeno: game serveri, matchmaking i live ops eventovi. Pričamo kako se balansira ekonomija igre bez da se pokvari zabava, i kako izgleda pipeline od ideje do live featura. Bonus tema: kakav je dan game programera u najvećem srpskom game studiju.',
 array['Dva kraća izlaganja iz inženjerskog tima Nordeusa',
       'Obilazak studija posle talka za zainteresovane',
       'Prijava je na ulazu, nosi ličnu kartu — traži je obezbeđenje',
       'Piće i pizza posle programa, uz razgovor sa inženjerima']),

-- 13. Thu 12 Nov, intermediate workshop, Beograd
('Microsoft Developer Workshop: .NET 10 i GitHub Copilot', 'Microsoft Srbija', 'workshop', 'intermediate', 'Beograd',
 '2026-11-12 17:00+02', '2026-11-12 20:00+02', 'Microsoft Srbija, Ulica Španskih boraca 3',
 'https://aka.ms/rs-dev-workshop-2026',
 'Gradićemo mali web API u .NET 10, pisati testove i puštati GitHub Copilot da nam piše boilerplate — a onda procenjivati šta je prihvatljivo, a šta treba preraditi. Tema večeri: šta AI može da uradi umesto nas, a za šta i dalje moramo mi. Radimo u parovima, pa će svako imati druga za kod review.',
 array['Radionica uživo u Microsoft kancelariji',
       'Potrebno je osnovno znanje C# ili nekog sličnog jezika',
       'Ponesi laptop sa Visual Studio ili VS Code okruženjem',
       'Četrdeset mesta, prijave po principu ko prvi']),

-- 14. Sat 14 Nov, expert conference, Beograd
('DevFest Belgrade 2026', 'GDG Beograd', 'conference', 'expert', 'Beograd',
 '2026-11-14 09:00+02', '2026-11-14 18:00+02', 'Dom omladine Beograda, Makedonska 22',
 'https://gdgbelgrade.dev/devfest-2026',
 'Jedan dan, pet paralelnih trackova i preko trideset predavanja — od Kotlin multiplatform preko WebGPU do optimizacije troškova u oblaku. Keynote drži glavni inženjer iz Minhena o sledećoj generaciji on-device modela. Između izlaganja: demo štandovi, lightning talkovi i ulična hrana u dvorištu.',
 array['Preko trideset predavanja u pet sala — biraš šta ti je zanimljivo',
       'Keynote je u 10č, zatim trackovi po salama',
       'Ulaznica pokriva ručak, kafu i after-party',
       'Slajdovi i snimci svih predavanja dostupni su posle konferencije']),

-- 15. Sat 21 Nov, expert workshop, Beograd
('EESTEC Advanced Workshop: Embedded Rust', 'EESTEC Beograd', 'workshop', 'expert', 'Beograd',
 '2026-11-21 10:00+02', '2026-11-21 17:00+02', 'ETF, Bulevar kralja Aleksandra 73',
 'https://eestec-beograd.rs/advanced-workshop-2026',
 'Ceo dan pišemo no_std Rust za ESP32 pločice, čitamo senzore preko I2C protokola i borimo se sa borrow checker-om na hardveru koji ne prašta. Na kraju svaki tim ima mali uređaj koji nešto meri i prikazuje na displeju. Radionica je za one koji već sigurno programiraju i žele da siđu sa aplikacija na metal.',
 array['Napredna radionica — potrebno je sigurno znanje nekog programskog jezika',
       'Pločice i senzori su obezbeđeni, ponesi samo laptop',
       'Radi se u timovima po troje uz mentore sa katedre',
       'Ručak i pauze su u ceni radionice']);

-- ============================================================
-- 3 GUIDES (Serbian, plain language)
-- ============================================================
insert into guides (slug, title, body_md, emoji, "order") values

('sta-je-hakaton', 'Šta je hakaton i kako izgleda', E'Hakaton je događaj na kome se skupi više ljudi, podeli u timove i za 24 do 48 sati napravi nešto od nule — aplikaciju, igru, sajt ili prototip. Zvuči zastrašujuće? Znam. Ali hajde da razbijemo mitove.\n\nPrvo: ne moraš da znaš da programiraš da bi došao. Mnogim timovima treba neko za dizajn, za prezentaciju, za testiranje ili samo neko ko postavlja dobra pitanja. Na svakom hakatonu postoji bar jedan tim sa članom na prvom hakatonu — najčešće ih je pola.\n\nKako izgleda dan? Prvo jutro je za upoznavanje i formiranje timova — ako dođeš sam, ne brineš, tu su i drugi sami. Onda se objave teme, timovi biraju ideju i počinje rad. Mentori šetaju između timova i pomažu kad zapne. Neko radi celu noć, neko spava kod kuće — oba su normalna.\n\nPoslednje popodne je za demo: svaki tim u par minuta pokazuje šta je napravio. Žiri ne očekuje gotov proizvod, očekuje priču — koji problem ste rešili i kako. Ako se aplikacija raspadne na pola demoa, dešava se i najboljima, timovi se smeju i nastavljaju.\n\nPrvi hakaton se ne zaboravlja. Dođi, vidi kako ti je, i već si napravio korak više nego prošlog meseca.', '🏆', 1),

('sta-ponijeti', 'Šta ponijeti na prvi meetup', E'Dobra vest: za prvi meetup ne treba ti skoro ništa. Loša vest: baš zato ljudi preteruju. Evo kratke liste koja pokriva 95 posto situacija.\n\nPonesi: laptop ako najava kaže da se radi na računarima (proveri sekciju šta očekivati na stranici događaja), punjač i flašu vode. Za hakatone dodaj i produžni kabl ako ga imaš — utičnica nikad nije dovoljno. QR kod ili potvrdu prijave drži u telefonu, ne štampaj ništa.\n\nPapir i olovka zvuče staromodno, ali za beleške tokom predavanja i dalje rade bolje od telefona. Ako nosiš laptop, ponesi i slušalice — znaš ti sebe.\n\nŠta ne treba: posebna odeća (farmerke i majica su sasvim u redu), vizitke (niko ih ne traži) i znanje o temi — o tome pišemo u trećem vodiču.\n\nI najvažnije: svi smo mi nekada bili ti prvi neprijatni minuti kada ne znaš nikoga. Prođu posle prvog razgovora, a na meetupima skoro svako dolazi samo.', '🎒', 2),

('smem-li-doci', 'Da li smem doći ako ne znam ništa o temi', E'Kratak odgovor: da. Duži odgovor: da, i evo zašto.\n\nSkoro svaki meetup, radionica ili hakaton u Srbiji računa na ljude koji prvi put dolaze. Organizatori to pišu u najavama, a predavači uvod prilagođavaju baš zato. Ako nešto ne razumeš, velika je šansa da ni pola sale ne razume — samo se ne usude da pitaju. Pitaj ti.\n\nŠta ako predavanje bude preteško? To se dešava i to je u redu. Sedi, slušaj koliko možeš i iznesi jednu stvar koja ti je jasna. Niko od tebe ne očekuje da sve razumeš — često ni predavač ne računa na to.\n\nAko je strah od ljudi veći od straha od teme: dođi pet minuta ranije i predstavi se organizatoru. To je najlakši prvi razgovor na svetu, a njihov posao je da te upoznaju sa još nekim novim. Na svakom događaju ima bar troje ljudi kojima je ovo takođe prvi put.\n\nMatematika je prosta: ako od kuće odneseš jednu novu stvar koju si naučio i jednog novog poznanika, događaj je bio uspešan. A ako dođeš samo da vidiš kako izgleda — i to je korak. Svaki korak se računa.', '🤔', 3);

-- ============================================================
-- 4 PROFILES (Ana i Luka are first-timers for the buddy demo)
-- ============================================================
insert into profiles (nickname, level, interests, first_timer, steps) values
('Ana',   'beginner',     array['frontend','dizajn'],            true,  0),
('Luka',  'beginner',     array['backend','AI'],                 true,  0),
('Marko', 'intermediate', array['python','data','sql'],          false, 5),
('Jovana','expert',       array['devops','cloud','mentorstvo'],  false, 20);

-- ============================================================
-- 5 TEAM POSTS (all on the Garaža Frontier Hackathon)
-- ============================================================
insert into team_posts (event_id, kind, nickname, level, skills, message, contact) values
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_team', 'Mina',   'beginner',     array['figma','UX dizajn'],          'Prvi hakaton, radim u Figmi. Tražim tim koji ne mari što sam početnica — spremna sam i na kafu i na učenje uz pomoć.', '@mina_uix'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_team', 'Luka',   'beginner',     array['python','osnove AI'],         'Učim Python i pokušavam da ukapiram kako rade AI alati. Idem na prvi hakaton, tražim strpljiv tim.', 'luka@example.com'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_member','Petar',  'intermediate', array['react','node.js','typescript'],'Imamo tim od dva (React i Node) i tražimo trećeg za frontend. Početnici dobrodošli — sve ćemo objasniti.', 'petar@dev.rs'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_member','Marko',  'intermediate', array['python','pandas','sql'],      'Tražimo nekog za obradu podataka. Iskustvo sa Pandas bibliotekom je plus, ali nije uslov — glavno da želiš da učestvuješ.', 'marko@data.rs'),
((select id from events where title = 'Garaža Frontier Hackathon'), 'looking_for_team', 'Jelena', 'expert',       array['kubernetes','llm','python'],   'Inženjerka sa osam godina iskustva, ovog puta idem zbog zabave i mentorstva. Ako vašem timu treba neko ko je video produkciju — javite se.', 'jelena@cloud.rs');

-- ============================================================
-- GOING (for buddy demo)
-- ============================================================
insert into going (event_id, profile_id, first_timer, buddy_profile_id) values
((select id from events where title = 'Garaža Frontier Hackathon'),
 (select id from profiles where nickname = 'Ana'), true, null),
((select id from events where title = 'Garaža Frontier Hackathon'),
 (select id from profiles where nickname = 'Luka'), true, null);

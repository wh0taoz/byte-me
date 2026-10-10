// One-off: translate the demo seed content to English IN PLACE (keeps event
// ids, so existing links and buddy pairs keep working).
// Run: node --env-file=.env.local scripts/english-seed.mjs
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const EVENTS = [
  {
    match: "Git i GitHub za potpune početnike",
    patch: {
      title: "Git and GitHub for complete beginners",
      city: "Belgrade",
      description:
        "In three hours we walk through the basic git commands — clone, commit, branch and merge — and resolve the kind of conflicts that happen in every team. By the end of the evening your code lives on GitHub, with a pull request you opened yourself. Bring a laptop and a bit of curiosity; we've prepared everything else.",
      what_to_expect: [
        "A short intro with no code, then commands step by step",
        "Bring a laptop — we work on a real project",
        "No experience needed, mentors walk between the tables",
        "You leave with your first repository on GitHub",
      ],
    },
  },
  {
    match: "ReDesign for Her: UX od prve skice",
    patch: {
      title: "ReDesign for Her: UX from the first sketch",
      city: "Belgrade",
      description:
        "In a relaxed atmosphere we go through the whole UX process — user research, personas, wireframes and a prototype in Figma. Then we test the prototypes with people from other tables and iterate on the feedback. No design experience needed; curiosity is.",
      what_to_expect: [
        "We work in pairs, and teams are formed on the spot",
        "Bring a laptop or tablet with a free Figma account",
        "There are no wrong answers — sketching is allowed and encouraged",
        "Expect a friendly crowd and a pressure-free workshop",
      ],
    },
  },
  {
    match: "Startit AI Hub: RAG pipeline od nule",
    patch: {
      title: "Startit AI Hub: A RAG pipeline from scratch",
      city: "Belgrade",
      description:
        "A meetup dedicated to the RAG pipeline: chunking, embeddings and vector databases. We'll show how documents get sliced, turned into embeddings and stored in Pgvector, and how the LLM calls the database to answer user questions. We finish with a discussion about hallucinations and how to measure answer quality.",
      what_to_expect: [
        "Two 30-minute technical talks, then discussion",
        "Helpful but not required: Python and basic SQL",
        "We stay for informal chatting over drinks after the meetup",
        "Recording and slides arrive by email after the event",
      ],
    },
  },
  {
    match: "Yettel Tech Talk: 5G core u oblaku",
    patch: {
      title: "Yettel Tech Talk: 5G core in the cloud",
      organizer: "Yettel Serbia",
      city: "Belgrade",
      description:
        "What the 5G core looks like when it moves to Kubernetes: service mesh, stateful sets and zero-downtime upgrades of the radio network. We also touch the observability stack — OpenTelemetry, distributed tracing and how we keep a 99.999 percent SLA. The talk is given by the chief architect of the core network team.",
      what_to_expect: [
        "One deep one-hour talk, then questions",
        "Aimed at engineers already working in cloud or telecom",
        "A rare chance to hear what the backend of a telecom looks like from the inside",
        "Refreshments and conversation with engineers after the talk",
      ],
    },
  },
  {
    match: "FONIS Hakaton 2026",
    patch: {
      title: "FONIS Hackathon 2026",
      city: "Belgrade",
      description:
        "FONIS Hackathon: 48 hours, teams of up to four and topics from the world of AI applications. Mentors help from the first idea to the presentation — how to define the problem, what an MVP is and how to tell the story to the jury. Coffee and food are provided for all 48 hours.",
      what_to_expect: [
        "Register alone or with a crew — we also form teams on the spot",
        "Bring a laptop and charger, food and drinks are on us",
        "No experience needed — mentors are there from Friday to Sunday",
        "Sunday 5pm: demo day and prizes for the top three teams",
      ],
    },
  },
  {
    match: "Crafthub radionica: CI/CD sa GitHub Actions",
    patch: {
      title: "Crafthub workshop: CI/CD with GitHub Actions",
      city: "Novi Sad",
      description:
        "A hands-on workshop: a CI/CD pipeline with GitHub Actions — from push to production. We write the workflow YAML step by step: build, test, containerizing into a Docker image and deploying to a staging environment. At the end everyone has their own automated pipeline that works.",
      what_to_expect: [
        "You work on your own machine, step by step with the instructor",
        "Required: a GitHub account and basic terminal comfort",
        "The group is small, twenty seats, so everyone gets to the end",
        "Coffee together at the start — meeting before code",
      ],
    },
  },
  {
    match: "Data Science Serbia #58: Model serving u produkciji",
    patch: {
      title: "Data Science Serbia #58: Model serving in production",
      city: "Belgrade",
      description:
        "Why a model isn't deployed like an ordinary API, what feature drift is and how to monitor it in production. In the second part: a vector database benchmark — Pgvector, Qdrant and Weaviate — on Serbian-language queries. Expect a lively discussion about evaluating results.",
      what_to_expect: [
        "Two 25-minute talks with a break in between",
        "The level is intermediate — no slides full of formulas, but there is code",
        "Come early for a good seat, the room fills up fast",
        "We continue the conversation at the pub across the street, off the record",
      ],
    },
  },
  {
    match: "Space Station Niš: Prvi koraci u web razvoju",
    patch: {
      title: "Space Station Niš: First steps in web development",
      city: "Niš",
      description:
        "A relaxed evening about how the internet actually works — what happens when you type an address, what frontend and backend are. On simple examples we assemble a first web page from HTML and CSS. The goal of the evening: you leave with a clearer picture and your first page on the internet.",
      what_to_expect: [
        "A talk with no jargon, questions welcome at any moment",
        "Bring a laptop if you want to follow along — but you don't have to",
        "You can also just watch and take notes",
        "Entry is free, registration is only needed for seat count",
      ],
    },
  },
  {
    match: "Online uvod u veštačku inteligenciju",
    patch: {
      title: "Online intro to artificial intelligence",
      description:
        "What artificial intelligence is, and what a large language model is — without math. Through examples we show what models do well, where they hallucinate and how to write a good prompt. The workshop is free and made entirely for people touching the topic for the first time.",
      what_to_expect: [
        "You join from home — the link arrives by email a day before",
        "No code and no math, only examples and conversation",
        "Questions go in the chat, we answer all of them",
        "The recording is shared with everyone registered after the workshop",
      ],
    },
  },
  {
    match: "BEST Course: Agile i Scrum u praksi",
    patch: {
      title: "BEST Course: Agile and Scrum in practice",
      organizer: "BEST Belgrade",
      city: "Belgrade",
      description:
        "Through a simulation of a real sprint we hand out roles — product owner, scrum master and the development team — and run it from planning to retrospective. We talk about the backlog, estimation and daily meetings, but also about where agile breaks in practice. We finish by discussing when waterfall is actually the better choice.",
      what_to_expect: [
        "An interactive session — we work in groups of six",
        "No management knowledge needed, everything gets explained",
        "You get a certificate of attendance at the end",
        "Registration closes the day before, seats are limited",
      ],
    },
  },
  {
    match: "Garaža Frontier Hackathon",
    patch: {
      city: "Novi Sad",
      description:
        "Frontier Hackathon: 33 hours, an open theme and teams of two to five. The focus is on first steps — how to pick an idea, what an MVP is, how to build a pitch and what the jury actually looks at. Mentors from Novi Sad IT companies circle the whole weekend, so nobody stays stuck.",
      what_to_expect: [
        "Register alone — we form teams on Saturday morning",
        "Bring a laptop and charger, don't worry about food and coffee",
        "Experience doesn't matter: half the participants are at their first hackathon",
        "Sunday 5pm: demo day and prizes for the top three teams",
      ],
    },
  },
  {
    match: "Nordeus Tech Meetup: Arhitektura igre u produkciji",
    patch: {
      title: "Nordeus Tech Meetup: Game architecture in production",
      city: "Belgrade",
      description:
        "What happens when a million players tap at once: game servers, matchmaking and live ops events. We talk about balancing a game economy without ruining the fun, and what the pipeline from idea to live feature looks like. Bonus topic: what a day of a game programmer looks like in Serbia's biggest game studio.",
      what_to_expect: [
        "Two shorter talks from the Nordeus engineering team",
        "A studio tour after the talk for the interested",
        "Registration is at the entrance, bring an ID — security asks for it",
        "Drinks and pizza after the program, with conversation with the engineers",
      ],
    },
  },
  {
    match: "Microsoft Developer Workshop: .NET 10 i GitHub Copilot",
    patch: {
      title: "Microsoft Developer Workshop: .NET 10 and GitHub Copilot",
      organizer: "Microsoft Serbia",
      city: "Belgrade",
      description:
        "We'll build a small web API in .NET 10, write tests and let GitHub Copilot write our boilerplate — then judge what's acceptable and what needs a rework. The theme of the evening: what AI can do instead of us, and what we still have to do ourselves. We work in pairs, so everyone has a partner for code review.",
      what_to_expect: [
        "A live workshop in the Microsoft office",
        "Basic knowledge of C# or a similar language is needed",
        "Bring a laptop with Visual Studio or VS Code set up",
        "Forty seats, first-come-first-served registration",
      ],
    },
  },
  {
    match: "DevFest Belgrade 2026",
    patch: {
      organizer: "GDG Belgrade",
      city: "Belgrade",
      description:
        "One day, five parallel tracks and over thirty talks — from Kotlin multiplatform through WebGPU to cloud cost optimization. The keynote is given by a principal engineer from Munich about the next generation of on-device models. Between talks: demo booths, lightning talks and street food in the courtyard.",
      what_to_expect: [
        "Over thirty talks across five halls — pick what interests you",
        "The keynote is at 10am, then tracks across the halls",
        "The ticket covers lunch, coffee and the after-party",
        "Slides and recordings of all talks are available after the conference",
      ],
    },
  },
  {
    match: "EESTEC Advanced Workshop: Embedded Rust",
    patch: {
      organizer: "EESTEC Belgrade",
      city: "Belgrade",
      description:
        "We spend the whole day writing no_std Rust for ESP32 boards, reading sensors over I2C and fighting the borrow checker on hardware that doesn't forgive. At the end every team has a small device that measures something and shows it on a display. The workshop is for people who already program confidently and want to step down from apps to the metal.",
      what_to_expect: [
        "An advanced workshop — confident knowledge of some programming language is required",
        "Boards and sensors are provided, just bring a laptop",
        "We work in teams of three with mentors from the department",
        "Lunch and breaks are included in the workshop",
      ],
    },
  },
];

const GUIDES = [
  {
    match: "sta-je-hakaton",
    patch: {
      slug: "what-is-a-hackathon",
      title: "What a hackathon is and what it's like",
      body_md:
        "A hackathon is an event where a bunch of people gather, split into teams and build something from scratch in 24 to 48 hours — an app, a game, a website or a prototype. Sounds intimidating? We know. Let's bust some myths.\n\nFirst: you don't have to know how to program to come. Many teams need someone for design, for the presentation, for testing, or just someone who asks good questions. At every hackathon there's at least one team with a first-time member — usually half of them are.\n\nWhat does the day look like? The first morning is for meeting people and forming teams — if you come alone, don't worry, others came alone too. Then the topics are announced, teams pick an idea and the work starts. Mentors walk between the teams and help when things get stuck. Some work through the night, some sleep at home — both are normal.\n\nThe last afternoon is for demos: each team shows what they built in a few minutes. The jury doesn't expect a finished product, they expect a story — which problem you solved and how. If the app falls apart mid-demo, it happens to the best teams too; people laugh and carry on.\n\nYou never forget your first hackathon. Come, see how it feels, and you've already made one more step than last month.",
    },
  },
  {
    match: "sta-ponijeti",
    patch: {
      slug: "what-to-bring",
      title: "What to bring to your first meetup",
      body_md:
        "Good news: you need almost nothing for your first meetup. Bad news: that's exactly why people overpack. Here's the short list that covers 95 percent of situations.\n\nBring: a laptop if the announcement says you'll work on computers (check the what-to-expect section on the event page), a charger and a bottle of water. For hackathons add a power strip if you have one — there are never enough outlets. Keep the QR code or registration confirmation on your phone; don't print anything.\n\nPaper and a pen sound old-fashioned, but for taking notes during talks they still work better than a phone. If you bring a laptop, bring headphones too — you know yourself.\n\nWhat you don't need: special clothes (jeans and a t-shirt are perfectly fine), business cards (nobody asks for them) or knowledge about the topic — that's what the third guide is about.\n\nAnd most importantly: we've all lived through those first awkward minutes when you don't know anyone. They pass after the first conversation, and at meetups almost everyone comes alone.",
    },
  },
  {
    match: "smem-li-doci",
    patch: {
      slug: "can-i-come",
      title: "Can I come if I know nothing about the topic?",
      body_md:
        "Short answer: yes. Longer answer: yes, and here's why.\n\nAlmost every meetup, workshop or hackathon in Serbia counts on first-time visitors. Organizers write it in the announcements, and speakers adapt their intros for exactly that reason. If you don't understand something, there's a good chance half the room doesn't either — they just don't dare ask. You ask.\n\nWhat if the talk turns out too hard? That happens and it's fine. Sit, listen as long as you can, and take away one thing that's clear to you. Nobody expects you to understand everything — often not even the speaker.\n\nIf the fear of people is bigger than the fear of the topic: come five minutes early and introduce yourself to the organizer. It's the easiest first conversation in the world, and their job is to introduce you to someone else new. At every event there are at least three people for whom this is also the first time.\n\nThe math is simple: if you take home one new thing you learned and one new acquaintance, the event was a success. And if you come just to see what it's like — that's a step too. Every step counts.",
    },
  },
];

const TEAM_POSTS = [
  { nickname: "Mina", patch: { skills: ["figma", "UX design"], message: "First hackathon, I work in Figma. Looking for a team that doesn't mind I'm a beginner — ready for both coffee and learning along the way." } },
  { nickname: "Luka", patch: { skills: ["python", "AI basics"], message: "I'm learning Python and trying to figure out how AI tools work. Going to my first hackathon, looking for a patient team." } },
  { nickname: "Petar", patch: { message: "We have a team of two (React and Node) and we're looking for a third for frontend. Beginners welcome — we'll explain everything." } },
  { nickname: "Marko", patch: { message: "Looking for someone for data wrangling. Pandas experience is a plus but not a requirement — the main thing is that you want to take part." } },
  { nickname: "Jelena", patch: { message: "Engineer with eight years of experience, this time I'm in it for fun and mentoring. If your team needs someone who has seen production — reach out." } },
];

const PROFILES = [
  { nickname: "Ana", patch: { interests: ["frontend", "design"] } },
  { nickname: "Luka", patch: { interests: ["backend", "AI"] } },
  { nickname: "Jovana", patch: { interests: ["devops", "cloud", "mentoring"] } },
];

async function main() {
  const { data: events, error } = await sb.from("events").select("id, title");
  if (error) throw error;
  const idByTitle = new Map(events.map((e) => [e.title, e.id]));

  let updated = 0;
  for (const { match, patch } of EVENTS) {
    const id = idByTitle.get(match);
    if (!id) {
      console.warn(`!! no event titled "${match}" — skipped`);
      continue;
    }
    const { error } = await sb.from("events").update(patch).eq("id", id);
    if (error) throw new Error(`${match}: ${error.message}`);
    updated++;
  }
  console.log(`events updated: ${updated}/${EVENTS.length}`);

  for (const { match, patch } of GUIDES) {
    const { error } = await sb.from("guides").update(patch).eq("slug", match);
    if (error) throw new Error(`guide ${match}: ${error.message}`);
  }
  console.log(`guides updated: ${GUIDES.length}`);

  for (const { nickname, patch } of TEAM_POSTS) {
    const { error } = await sb.from("team_posts").update(patch).eq("nickname", nickname);
    if (error) throw new Error(`team post ${nickname}: ${error.message}`);
  }
  console.log(`team posts updated: ${TEAM_POSTS.length}`);

  for (const { nickname, patch } of PROFILES) {
    const { error } = await sb.from("profiles").update(patch).eq("nickname", nickname);
    if (error) throw new Error(`profile ${nickname}: ${error.message}`);
  }
  console.log(`profiles updated: ${PROFILES.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

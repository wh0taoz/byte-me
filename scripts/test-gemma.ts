// scripts/test-gemma.ts — quick manual test of the Gemma prompts (not part of the app)
// Run from the project root:  npx tsx --env-file=.env.local scripts/test-gemma.ts
import {
  answerWithoutJudgment, judgmentWords, suggestLevel, eventSummary, simplify, extractTags,
  suggestMentor, type Participant, type Mentor,
} from "../src/lib/gemma";

const line = (title: string) => console.log(`\n${"=".repeat(70)}\n${title}\n${"=".repeat(70)}`);

async function main() {
  // 1. The five checklist questions for the no-judgment chat
  const questions: [string, "beginner" | "expert"][] = [
    ["sorry if this is dumb, what's an API?", "beginner"],
    ["what does git push do", "beginner"],
    ["is a hackathon only for programmers?", "beginner"],
    ["šta je backend?", "beginner"],
    ["how does LoRA reduce memory during fine-tuning?", "expert"],
  ];
  for (const [q, level] of questions) {
    line(`CHAT (${level}): ${q}`);
    const a = await answerWithoutJudgment(q, level);
    console.log(a);
    const w = judgmentWords(a);
    console.log(w.length ? `⚠️  judgment words: ${w.join(", ")}` : "✅ no judgment words");
  }

  // 2. Level suggestion on a deliberately misleading description
  const desc = "An in-depth, hands-on look at advanced AI tools, explained in plain language. " +
    "Never written a line of code? Perfect, this is for you. Pizza afterwards!";
  line("SUGGEST LEVEL (should be beginner)");
  console.log(await suggestLevel("AI Night", desc));

  // 3. Event summary
  line("EVENT SUMMARY");
  console.log(JSON.stringify(await eventSummary({ title: "AI Night", type: "Meetup", description: desc }), null, 2));

  // 4. Say it simply
  line("SIMPLIFY");
  console.log(await simplify("Participants should deploy their containerised backend to a managed Kubernetes cluster via CI/CD."));

  // 5. Mentor matching: tags from free text, then a match
  const about = "First hackathon ever, a bit scared. I want to build the website for our idea and use GitHub properly. " +
    "My teammate is handling the design, so I don't need help with that.";
  line("EXTRACT TAGS (expect frontend, git — not ui_ux)");
  const needs = await extractTags(about);
  console.log(needs);

  const participant: Participant = { id: "p1", name: "Mila", level: "first_timer", about, needs, slots: ["Sat afternoon"] };
  const mentors: Mentor[] = [
    { id: "m1", name: "Ana", level: "expert", skills: ["frontend", "git", "ui_ux"], beginner_friendly: false,
      current_mentees: 3, max_mentees: 4, slots: ["Sat afternoon"] },
    { id: "m2", name: "Luka", level: "advanced", skills: ["frontend", "git", "backend"], beginner_friendly: true,
      current_mentees: 1, max_mentees: 4, slots: ["Sat afternoon", "Sat night"] },
    { id: "m3", name: "Sara", level: "intermediate", skills: ["data_science", "python"], beginner_friendly: true,
      current_mentees: 0, max_mentees: 3, slots: ["Sat afternoon"] },
  ];
  line("SUGGEST MENTOR (expect m2 Luka: same skills, beginner-friendly, less busy)");
  console.log(await suggestMentor(participant, mentors));
}

main().catch((e) => { console.error(e); process.exit(1); });
// src/lib/gemma.ts — every Gemma call in the app goes through here.
// Server-only: import from route handlers / server actions, never from client components.
// npm i @google/genai   ·   env: GEMINI_API_KEY (Vercel → Settings → Environment Variables)
// Prompts marked "from Kaggle" are copied verbatim from our notebooks:
//   mentor matching: <notebook link>   ·   levels + no-judgment: <notebook link>

import { GoogleGenAI } from "@google/genai";

// Lazy init: a missing GEMINI_API_KEY must not crash module load (that would
// take down every importing route before its try/catch could show a fallback).
let ai: GoogleGenAI | null = null;
function client(): GoogleGenAI {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

export const GEMMA_FAST = "gemma-4-26b-a4b-it";   // chat, tagging, matching, simplify
export const GEMMA_QUALITY = "gemma-4-31b-it";    // summaries, levels, intros, guides

// =====================================================================
// Core helpers: ask() for text, askJSON() for structured output
// =====================================================================
let supportsSystem = true;
let supportsJson = true;

interface AskOptions { model?: string; temperature?: number; maxTokens?: number }

async function generate(system: string, user: string, json: boolean, opts: AskOptions = {}): Promise<string> {
  const { model = GEMMA_FAST, temperature = json ? 0 : 0.4, maxTokens = 2048 } = opts;
  const g = client(); // throws fast when unconfigured, before any retries
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await g.models.generateContent({
        model,
        contents: supportsSystem ? user : `${system}\n\n${user}`,
        config: {
          // cap stops rare runaway generations; retries add a little randomness so a stuck answer isn't repeated
          temperature: attempt === 0 ? temperature : Math.max(temperature, 0.3),
          maxOutputTokens: maxTokens,
          ...(supportsSystem ? { systemInstruction: system } : {}),
          ...(json && supportsJson ? { responseMimeType: "application/json" } : {}),
        },
      });
      return res.text ?? "";
    } catch (e) {
      const msg = String(e);
      console.warn(`[gemma] ${model} attempt ${attempt + 1}/4 failed:`, msg.slice(0, 200)); // 429? 5xx? 400?
      if (msg.includes("400") && json && supportsJson) { supportsJson = false; continue; }
      if (msg.includes("400") && supportsSystem) { supportsSystem = false; continue; }
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt)); // 429 / 5xx backoff
    }
  }
  return "";
}

/** Plain-text answer. Throws if Gemma is unreachable after retries. */
export function ask(system: string, user: string, opts?: AskOptions): Promise<string> {
  return generate(system, user, false, opts);
}

/** Structured answer. Returns null if Gemma fails or the JSON can't be parsed. */
export async function askJSON<T>(system: string, user: string, opts?: AskOptions): Promise<T | null> {
  let raw = "";
  try {
    raw = await generate(system, user, true, opts);
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) { console.warn("[gemma] askJSON: no JSON in reply:", raw.slice(0, 200)); return null; }
    return JSON.parse(m[0]) as T;
  } catch (e) {
    console.error("[gemma] askJSON failed:", String(e).slice(0, 300), raw ? `| reply: ${raw.slice(0, 200)}` : "");
    return null;
  }
}

// =====================================================================
// No-judgment quality gate
// =====================================================================
const EN_JUDGMENT = /\b(simply|just|obviously|easy|basic|everyone knows|of course)\b/gi;
const SR_JUDGMENT = /(?<![\p{L}])(jednostavno|očigledno|lako|osnovn\p{L}*|svi znaju|naravno)(?![\p{L}])/giu;

/** Judgment words found in a reply (empty array = clean). */
export function judgmentWords(text: string): string[] {
  const found = [...(text.match(EN_JUDGMENT) ?? []), ...(text.match(SR_JUDGMENT) ?? [])];
  return [...new Set(found.map((w) => w.toLowerCase()))];
}
export const containsJudgment = (text: string) => judgmentWords(text).length > 0;

/** Rewrite request used when a reply slips through with judgment words (send as the next user turn, or use answerWithoutJudgment). */
export const rewriteRequest = (question: string, words: string[]) =>
  `${question}\n\n(Your previous answer used these words: ${words.join(", ")}. ` +
  "Rewrite the answer without them and without implying the question is easy.)";

/** Drops the judgment words that can be removed without changing the meaning:
 *  "Git is just a tool" → "Git is a tool", "Of course, git…" → "Git…". No Gemma call.
 *  "easy", "basic" and the Serbian words can't be dropped safely; those still go through a rewrite. */
export function stripRemovable(text: string): string {
  return text
    .replace(/\bsimply put\b/gi, (m) => (m[0] === "S" ? "In other words" : "in other words"))
    // "not just X" means "not only X" — dropping "just" would flip the meaning
    .replace(/(\bnot|n't) (?:just|simply)\b/gi, "$1 only")
    // sentence start: "Just ask." → "Ask."
    .replace(/(^|[.!?]\s+)(?:just|simply|obviously|of course),?\s+(\p{L})/gimu,
      (_m, start: string, c: string) => start + c.toUpperCase())
    // mid-sentence: "Git is just a tool" → "Git is a tool"
    .replace(/\s*\b(?:just|simply|obviously|of course)\b,?/gi, "")
    .replace(/[ \t]{2,}/g, " ");
}

// =====================================================================
// Checklist functions
// =====================================================================
export type Level = "beginner" | "intermediate" | "expert";
export const LEVELS: Level[] = ["beginner", "intermediate", "expert"];

export interface EventInput {
  title: string;
  type?: string;            // hackathon / meetup / workshop / talk
  description: string;
  level?: Level;
  date?: string;
  location?: string;
  agenda?: string;
}

// ---------- eventSummary → GET /api/events/[id] ----------
// If the team file defines a different ai_summary shape, change this interface and the JSON line in the prompt.
export interface AiSummary {
  what_to_expect: string;                              // 2–3 plain sentences
  is_this_for_me: string;                              // who it's for, 1–2 sentences
  key_terms: { term: string; explanation: string }[]; // 3–6 terms from the description
  prior_knowledge: string[];                           // empty array = none needed
  bring: string[];                                     // what to bring; empty if not mentioned
}

const SUMMARY_SYSTEM = `You help beginners decide whether a tech event is for them.
Read the event and write a short, friendly summary in plain language. Never call anything easy, basic or obvious.
Use only facts from the event; if something isn't stated, leave it out (use an empty list) rather than guessing.
Write in the same language as the event description.
Return JSON only:
{"what_to_expect": "<2-3 short sentences>", "is_this_for_me": "<1-2 sentences: who it's for and what you need to know>",
 "key_terms": [{"term": "<word from the event>", "explanation": "<one plain sentence>"}],
 "prior_knowledge": ["<thing you should know beforehand>"], "bring": ["<thing to bring>"]}
Give 3 to 6 key_terms, picking the words a beginner is most likely not to know.`;

export async function eventSummary(event: EventInput): Promise<AiSummary | null> {
  const s = await askJSON<AiSummary>(SUMMARY_SYSTEM, JSON.stringify(event), { model: GEMMA_QUALITY });
  if (!s || typeof s.what_to_expect !== "string") return null;
  return {
    what_to_expect: s.what_to_expect,
    is_this_for_me: s.is_this_for_me ?? "",
    key_terms: Array.isArray(s.key_terms) ? s.key_terms.filter((k) => k?.term && k?.explanation).slice(0, 6) : [],
    prior_knowledge: Array.isArray(s.prior_knowledge) ? s.prior_knowledge : [],
    bring: Array.isArray(s.bring) ? s.bring : [],
  };
}

// ---------- suggestLevel → POST /api/events (from Kaggle: LEVEL_SYSTEM) ----------
export const LEVEL_SYSTEM = `You label how difficult a tech event is for attendees: beginner, intermediate or expert.
Judge by who the event is FOR and what attendees must already know, not by how technical the topic sounds or how friendly the tone is.
- beginner: no prior experience needed; everything is explained or set up for you.
- intermediate: assumes basic programming or some hands-on experience with the topic.
- expert: assumes deep, professional experience; basics are skipped.
Words like "intro", "advanced" or "beginner" can be misleading. Read the prerequisites.
Return JSON only: {"level": "beginner|intermediate|expert", "reason": "<one short sentence>"}`;

/** Accepts "Beginner", " expert ", "advanced" (→ expert) etc. */
export function normalizeLevel(value: unknown): Level | null {
  const s = String(value ?? "").toLowerCase();
  const m = s.includes("|") ? null : s.match(/beginner|intermediate|expert|advanced/); // "a|b|c" = template echoed, not a choice
  if (!m) return null;
  return m[0] === "advanced" ? "expert" : (m[0] as Level);
}

/** Suggestion only: the organiser confirms or changes it in the form. Returns null only if Gemma is unreachable. */
export async function suggestLevel(title: string, description: string): Promise<{ level: Level; reason: string } | null> {
  const out = await askJSON<{ level?: unknown; reason?: string }>(
    LEVEL_SYSTEM, JSON.stringify({ title, description }), { model: GEMMA_QUALITY });
  const level = normalizeLevel(out?.level);
  if (!level) {
    if (out) console.warn("[gemma] suggestLevel: unexpected output", out);
    return null;
  }
  return { level, reason: typeof out?.reason === "string" ? out.reason : "" };
}

// ---------- explainSystem → POST /api/explain (from Kaggle: explain_system) ----------
/** Returns the system prompt for the "explain without judgment" chat. */
export function explainSystem(level: Level, eventContext?: string): string {
  const levelRule = {
    beginner: "The person is a beginner: use no jargon, and explain any technical word you must use.",
    intermediate: "The person knows the basics: you can use common technical terms.",
    expert: "The person is an expert: be precise and technical, and do not over-simplify.",
  }[level];
  const ctx = eventContext
    ? `\n- They are looking at this event: ${eventContext}. Connect your answer to it in one sentence, without inventing details that are not given.`
    : "";
  return `You are the guide on "Every Step Counts", a platform that helps people go to tech events, often for the first time.
${levelRule}
How to answer:
- Begin with a short, natural thank-you or encouragement for the question, then answer.
- Never say or imply that a question is basic, obvious or easy. Never use these words: simply, just, obviously, easy, basic, of course, everyone knows.
- Explain in 2-4 short sentences, then give one everyday analogy, then one tiny example.
- If the person apologises for asking, reassure them in one short phrase, with no lecture.${ctx}
- If you are not sure, say so. Never invent details about events.
- Write plain text: no LaTeX or math notation (write "1024 x 1024", not formulas).
- Reply in the same language as the question. If the question is in Serbian, answer in Serbian (Latin script) and use the informal "ti" throughout.`;
}

/** Non-streaming answer with the quality gate built in.
 *  1. Words that can be dropped ("just", "simply", "of course"…) are removed locally — no second call.
 *  2. Anything else ("easy", "basic", Serbian words) gets one rewrite.
 *  3. If the rewrite fails or still has judgment words, the user gets the cleaned first answer.
 *  Only a failed FIRST call throws — the quality gate can never turn a real answer into an error. */
export async function answerWithoutJudgment(question: string, level: Level, eventContext?: string): Promise<string> {
  const system = explainSystem(level, eventContext);
  const t0 = Date.now();
  const first = await ask(system, question);
  const firstWords = judgmentWords(first);
  console.log(`[gemma] explain: first ${Date.now() - t0}ms, ${first.length} chars, judgment [${firstWords.join(", ")}]`);
  if (!firstWords.length) return first;

  const cleaned = stripRemovable(first).trim() || first;
  const words = judgmentWords(cleaned);
  if (!words.length) return cleaned;

  try {
    const t1 = Date.now();
    const second = stripRemovable(await ask(system, rewriteRequest(question, words))).trim();
    console.log(`[gemma] explain: rewrite ${Date.now() - t1}ms, ${second.length} chars, judgment [${judgmentWords(second).join(", ")}]`);
    if (second && !containsJudgment(second)) return second;
  } catch (e) {
    console.error("[gemma] explain: rewrite failed, keeping first answer:", String(e).slice(0, 300));
  }
  console.warn(`[gemma] explain: returning first answer with [${words.join(", ")}]`);
  return cleaned;
}

// ---------- simplify → POST /api/simplify ("say it simply" button) ----------
export async function simplify(text: string, level: Level = "beginner"): Promise<string> {
  const system = `Rewrite the text so a ${level} can understand it.
Keep the meaning and all facts (names, dates, places, links); do not add new facts.
Use short sentences and everyday words; explain any technical term in a few words the first time it appears.
Never use these words: simply, just, obviously, easy, basic, of course, everyone knows.
Keep the same language as the text. Return only the rewritten text.`;
  const out = await ask(system, text);
  if (containsJudgment(out)) {
    return (await ask(system, `${text}\n\n(Do not use these words: ${judgmentWords(out).join(", ")}.)`)) || out;
  }
  return out;
}

// ---------- guideDraft (optional, for P3's guide pages) ----------
export async function guideDraft(topic: string): Promise<string> {
  const system = `Write a short guide for people going to a tech event for the first time, in warm, plain English.
Markdown: a title, 3-5 short sections with ## headings, a short "You've got this" ending. 300-450 words.
Answer the questions a nervous first-timer actually has. Never call anything easy, basic or obvious; never use "just" or "simply".
Do not invent specific events, dates, prices or organisations.`;
  return ask(system, topic, { model: GEMMA_QUALITY, temperature: 0.6, maxTokens: 4096 });
}

// =====================================================================
// Mentor matching
// =====================================================================
export const TAGS = [
  "frontend", "backend", "mobile", "ui_ux", "data_science", "ml_ai", "cloud_devops", "git",
  "databases", "security", "pitching", "python", "hardware_iot", "game_dev",
] as const;
export type Tag = (typeof TAGS)[number];

export type ParticipantLevel = "first_timer" | "beginner" | "intermediate";
export type MentorLevel = "intermediate" | "advanced" | "expert";

export interface Participant {
  id: string;
  name: string;
  level: ParticipantLevel;
  about: string;          // free text: "this is my first hackathon, I want to..."
  needs: Tag[];           // from extractTags(), editable by the participant
  slots: string[];        // e.g. ["Sat morning", "Sat afternoon"]
}
export interface Mentor {
  id: string;
  name: string;
  level: MentorLevel;
  skills: Tag[];
  beginner_friendly: boolean;
  current_mentees: number; // live count from Supabase
  max_mentees: number;
  slots: string[];
}

// ---------- free text → tags (from Kaggle: TAG_PROMPT) ----------
export const TAG_SYSTEM = `You read short messages from hackathon participants and tag what they need help with.
Use ONLY these tags: ${TAGS.join(", ")}.
Include every tag the person needs help with and nothing else. Ignore how nervous or experienced they are.
Return JSON only: {"results": [{"id": "<id>", "tags": ["<tag>", ...]}]}`;

/** Show the result as editable chips so the participant can fix it before matching. */
export async function extractTags(about: string): Promise<Tag[]> {
  const out = await askJSON<{ results: { id: string; tags: string[] }[] }>(
    TAG_SYSTEM, JSON.stringify([{ id: "p", text: about }]));
  const tags = out?.results?.[0]?.tags ?? [];
  return [...new Set(tags.filter((t): t is Tag => (TAGS as readonly string[]).includes(t)))];
}

// ---------- pick the mentor (from Kaggle: POLICY_PROMPT) ----------
export const MATCH_SYSTEM = `You match hackathon participants with mentors. Choose ONLY from the candidate list.
Weigh all of these together:
1. Skills matter most: the mentor's skills should cover what the participant needs help with.
2. First-timers: strongly prefer mentors marked beginner_friendly.
3. Experience gap: intermediate participants learn more from advanced or expert mentors than from intermediate ones.
4. Fairness: prefer mentors with fewer current_mentees relative to max_mentees, so popular mentors don't get overloaded.
Return JSON only: {"mentor_id": "<id>", "backups": ["<second best id>", "<third best id>"], "reason": "<one friendly sentence to the participant, max 20 words, no jargon>"}`;

const overlap = (p: Participant, m: Mentor) =>
  p.needs.length ? p.needs.filter((t) => m.skills.includes(t)).length / p.needs.length : 0;

/** Same rule as the notebook: drop full / unavailable mentors, keep the 8 best skill matches (ties: lighter load). */
export function shortlist(p: Participant, mentors: Mentor[], k = 8): Mentor[] {
  return mentors
    .filter((m) => m.current_mentees < m.max_mentees && m.slots.some((s) => p.slots.includes(s)))
    .sort((a, b) =>
      overlap(p, b) - overlap(p, a) ||
      a.current_mentees / a.max_mentees - b.current_mentees / b.max_mentees ||
      a.id.localeCompare(b.id))
    .slice(0, k);
}

export interface MentorSuggestion {
  mentorId: string;
  backups: string[];
  reason: string;
  source: "gemma" | "fallback";
}

export async function suggestMentor(p: Participant, mentors: Mentor[]): Promise<MentorSuggestion | null> {
  const cands = shortlist(p, mentors);
  if (!cands.length) return null; // UI: "all mentors are busy right now — we'll notify you"
  const ids = new Set(cands.map((c) => c.id));
  const out = await askJSON<{ mentor_id: string; backups?: string[]; reason?: string }>(MATCH_SYSTEM, JSON.stringify({
    participant: { level: p.level, needs: p.needs, message: p.about },
    candidates: cands.map((m) => ({
      mentor_id: m.id, name: m.name, level: m.level, skills: m.skills,
      beginner_friendly: m.beginner_friendly, current_mentees: m.current_mentees, max_mentees: m.max_mentees,
    })),
  }));
  if (out && ids.has(out.mentor_id)) {
    return {
      mentorId: out.mentor_id,
      backups: (out.backups ?? []).filter((b) => ids.has(b) && b !== out.mentor_id).slice(0, 2),
      reason: out.reason ?? "",
      source: "gemma",
    };
  }
  const top = cands[0]; // never leave a participant without a suggestion
  return {
    mentorId: top.id, backups: cands.slice(1, 3).map((c) => c.id),
    reason: `${top.name} knows ${p.needs.filter((t) => top.skills.includes(t)).join(", ") || "related topics"}.`,
    source: "fallback",
  };
}

/** Matching many participants (e.g. at event start): one at a time, first-timers first, updating loads. */
export async function matchEvent(participants: Participant[], mentors: Mentor[]) {
  const pool = mentors.map((m) => ({ ...m }));
  const order: ParticipantLevel[] = ["first_timer", "beginner", "intermediate"];
  const results: { participantId: string; suggestion: MentorSuggestion | null }[] = [];
  for (const p of [...participants].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level))) {
    const s = await suggestMentor(p, pool);
    if (s) pool.find((m) => m.id === s.mentorId)!.current_mentees += 1;
    results.push({ participantId: p.id, suggestion: s });
  }
  return results;
}

// ---------- friendly intro message (no judgment) ----------
export async function matchIntro(p: Participant, m: Mentor, eventName: string): Promise<string> {
  const system = `Write a short, warm intro message that introduces a hackathon participant to their mentor.
Max 70 words, plain text, addressed to both by first name. Say what the participant wants help with and why this mentor fits.
If the participant is a first-timer, make them feel welcome and say that every question is a good question.
Never use these words: simply, just, obviously, easy, basic, of course, everyone knows.
Use only the facts given; do not invent times, places or details.`;
  return ask(system, JSON.stringify({
    event: eventName,
    participant: { name: p.name, level: p.level, needs: p.needs, message: p.about },
    mentor: { name: m.name, level: m.level, skills: m.skills },
  }), { model: GEMMA_QUALITY, temperature: 0.5 });
}
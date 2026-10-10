// Server-side only. Import from API routes, never from client components.
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const MODELS = {
  fast: process.env.GEMMA_MODEL_FAST ?? "gemma-4-26b-a4b-it",
  quality: process.env.GEMMA_MODEL_QUALITY ?? "gemma-4-31b-it",
};

/** Plain text completion. Instructions go in the prompt itself. */
export async function ask(prompt: string, model = MODELS.fast): Promise<string> {
  const res = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { temperature: 0.3 },
  });
  return res.text ?? "";
}

/** JSON completion – asks for JSON and parses it defensively. */
export async function askJSON<T>(prompt: string, model = MODELS.fast): Promise<T> {
  const raw = await ask(
    `${prompt}\n\nRespond with ONLY valid JSON. No markdown, no code fences, no commentary.`,
    model
  );
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.search(/[\[{]/);
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}

// ---- Prompts (P1 owns and tunes these; copy the best Kaggle-tested version back here) ----

export const prompts = {
  /** Gemma picks from a shortlist computed in code, so it can never invent a person. */
  assignTask: (task: object, candidates: object[]) =>
    `You assign event-organising tasks to volunteers.
Pick the best person for the task from the candidates ONLY.
Weigh: matching tags (most important), experience level vs task difficulty and urgency,
current workload (open_tasks, open_hours) vs available_hours. Prefer giving beginners
low-risk tasks; give high-urgency tasks to experienced people with free capacity.
Return JSON: {"person_id": string, "reason": string (max 20 words, mention the deciding factors),
"alternatives": [{"person_id": string, "reason": string}] (max 2)}
Task: ${JSON.stringify(task)}
Candidates: ${JSON.stringify(candidates)}`,

  welcomeBrief: (name: string, level: string, role: string, description: string,
                 files: string[], groups: string[], tasks: string[]) =>
    `Write a short, warm welcome brief (max 120 words) for ${name}, a ${level} volunteer who just
got the role "${role}" (${description}) at an event.
Structure: one welcome sentence; "Your job" in one sentence; "Your links": ${files.join(", ") || "none"};
"Your groups": ${groups.join(", ") || "none"}; "Start with": ${tasks.join("; ") || "nothing yet"}.
For a beginner, add one sentence explaining any organiser jargon used. Plain text, no markdown headings.`,

  /** Command bar: map free text to ONE fixed action. The app executes it, never Gemma. */
  command: (text: string, today: string) =>
    `You are the assistant for an event organising app. Today is ${today}.
Map the request to exactly ONE action:
- find_person {tags: string[], when?: string}
- create_task {title: string, tags: string[], urgency: "low"|"medium"|"high", deadline?: ISO string}
- assign_task {task_title: string}
- check_stock {item?: string}
- summarise_today {}
- draft_message {role: string, topic: string}
If nothing fits, use {"action":"none","args":{},"reply":"<one helpful sentence>"}.
Return JSON: {"action": string, "args": object, "reply": string (one sentence describing what you will do)}
Request: """${text}"""`,

  draftMessage: (role: string, topic: string) =>
    `Draft a short, friendly message (max 80 words) from the lead organiser to everyone with the
role "${role}" about: ${topic}. Clear action and deadline if implied. Plain text.`,

  speakerLevel: (abstract: string) =>
    `Classify this talk's audience level and list up to 5 terms a beginner might not know,
each with a one-line plain explanation.
Return JSON: {"level": "beginner"|"intermediate"|"advanced", "glossary": [{"term": string, "explanation": string}]}
Abstract: """${abstract}"""`,

  githubTags: (profileSummary: string) =>
    `From this GitHub profile summary, infer up to 6 skill tags and an experience level.
Return JSON: {"tags": string[], "level": "beginner"|"intermediate"|"advanced"}
Profile: """${profileSummary}"""`,
};

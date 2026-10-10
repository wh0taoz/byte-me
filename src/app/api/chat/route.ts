// POST /api/chat — Pip the stoat chatbot. No-judgment persona per the plan:
// never treat a question as too basic, answer simply, encourage the asker.
// The model only writes text; the app decides what to do with it.
import { NextResponse } from "next/server";
import { MODELS, ask } from "@/lib/gemma";

const PERSONA = `You are Pip, a friendly winter stoat and the mascot of "Every Step Counts" — a platform that helps people, especially complete beginners, attend tech events without fear.
Rules:
- NEVER judge and NEVER treat a question as too basic. Every question is welcome and rewarded.
- Answer in 1-4 short sentences, warm and simple English. No jargon; if a technical term is needed, explain it in the same sentence.
- If you don't know something (for example details not in the context), say so honestly and suggest asking the event organizers.
- Assume the person might be about to attend their very first tech event ever. Be encouraging.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[]; context?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: 400 }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-10);

  if (!messages.length) {
    return NextResponse.json({ error: "messages are required", code: 400 }, { status: 400 });
  }

  const transcript = messages
    .map((m) => (m.role === "user" ? `User: ${m.content}` : `Pip: ${m.content}`))
    .join("\n");

  const context = body.context ? `\nContext — the user is looking at this event right now:\n${body.context}\n` : "";

  const prompt = `${PERSONA}${context}
Conversation so far:
${transcript}
Pip:`;

  try {
    const reply = await ask(prompt, MODELS.fast);
    return NextResponse.json({ reply: reply.trim() });
  } catch (e) {
    return NextResponse.json(
      { error: `Gemma call failed: ${(e as Error).message}`, code: 502 },
      { status: 502 },
    );
  }
}

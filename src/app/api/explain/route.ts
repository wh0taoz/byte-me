// POST /api/explain — "Explain it to me" chat. The prompt and the judgment
// retry live in answerWithoutJudgment() — this route only feeds it.
import { NextResponse } from "next/server";
import { answerWithoutJudgment, LEVELS, type Level } from "@/lib/gemma";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const maxDuration = 30;

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[]; event_id?: string; level?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: 400 }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.filter((m) => m && typeof m.content === "string" && m.content.trim())
    : [];
  if (messages.length === 0) {
    return NextResponse.json(
      { error: "messages array with at least one message is required", code: 400 },
      { status: 400 }
    );
  }

  const level: Level = (LEVELS as string[]).includes(body.level ?? "")
    ? (body.level as Level)
    : "beginner";

  let eventContext: string | undefined;
  if (body.event_id) {
    const { data: event } = await supabaseAdmin
      .from("events")
      .select("title,type,level,city,starts_at,description")
      .eq("id", body.event_id)
      .maybeSingle();
    if (event) {
      eventContext =
        `${event.title} (${event.type}, ${event.level} level, ${event.city}, ` +
        `${new Date(event.starts_at).toLocaleDateString("en-GB")}) — ` +
        `${String(event.description ?? "").slice(0, 400)}`;
    }
  }

  // Gemma takes a single turn: last 10 messages as context, answer the newest.
  const recent = messages.slice(-10);
  const history = recent.slice(0, -1);
  const question = history.length
    ? `Conversation so far:\n${history
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n")}\n\nLatest message (answer this one): ${recent[recent.length - 1].content}`
    : recent[recent.length - 1].content;

  try {
    const reply = await answerWithoutJudgment(question, level, eventContext);
    if (!reply) throw new Error("empty reply");
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({
      reply: "I couldn't reach the AI right now. Try again in a moment.",
      fallback: true,
    });
  }
}

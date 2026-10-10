// POST /api/simplify — "Say it simply". The prompt and the judgment retry
// live in simplify() in gemma.ts.
import { NextResponse } from "next/server";
import { simplify, LEVELS, type Level } from "@/lib/gemma";

export const maxDuration = 30;

const MAX_CHARS = 3000;

export async function POST(req: Request) {
  let body: { text?: string; level?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: 400 }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "text is required", code: 400 }, { status: 400 });
  }

  const level: Level = (LEVELS as string[]).includes(body.level ?? "")
    ? (body.level as Level)
    : "beginner";

  const clipped = text.slice(0, MAX_CHARS);

  try {
    const out = await simplify(clipped, level);
    if (!out) throw new Error("empty reply");
    return NextResponse.json({ text: out });
  } catch {
    return NextResponse.json({ text: clipped, fallback: true });
  }
}

// GET  /api/profiles — list demo profiles.
// POST /api/profiles — create a lightweight demo profile (nickname identity,
// no auth yet). Needed so /api/going (buddy pairing) has a profile to point at.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const LEVELS = ["beginner", "intermediate", "expert"] as const;

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, nickname, level, first_timer, steps")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  let body: { nickname?: string; level?: string; first_timer?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: 400 }, { status: 400 });
  }

  const nickname = body.nickname?.trim();
  if (!nickname) {
    return NextResponse.json({ error: "nickname is required", code: 400 }, { status: 400 });
  }
  if (body.level && !LEVELS.includes(body.level as (typeof LEVELS)[number])) {
    return NextResponse.json({ error: `Invalid level: ${body.level}`, code: 400 }, { status: 400 });
  }

  const insert: Record<string, unknown> = { nickname };
  if (body.level) insert.level = body.level;
  if (typeof body.first_timer === "boolean") insert.first_timer = body.first_timer;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .insert(insert)
    .select("id, nickname, level, first_timer, steps")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 });
  }
  return NextResponse.json(data);
}

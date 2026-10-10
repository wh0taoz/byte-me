// GET /api/health — open this first after deploying. Checks Gemma + Supabase in one go.
import { NextResponse } from "next/server";
import { ask, GEMMA_FAST } from "@/lib/gemma";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const result: Record<string, unknown> = { ok: true };

  try {
    const reply = await ask("You are a health check. Reply with exactly: pong", "ping");
    result.gemma = { ok: true, model: GEMMA_FAST, reply: reply.trim() };
  } catch (e) {
    result.ok = false;
    result.gemma = { ok: false, error: e instanceof Error ? e.message : JSON.stringify(e) };
  }

  try {
    const { error } = await supabaseAdmin.from("events").select("id").limit(1);
    if (error) throw error;
    result.supabase = { ok: true };
  } catch (e) {
    result.ok = false;
    result.supabase = { ok: false, error: e instanceof Error ? e.message : JSON.stringify(e) };
    console.log("[health] supabase error:", e);
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

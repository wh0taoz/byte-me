// GET /api/events/[id] — single event. ai_summary may be null; generation + caching comes with the AI pass.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Event not found", code: 404 }, { status: 404 });
  }
  return NextResponse.json(data);
}

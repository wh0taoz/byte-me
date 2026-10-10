// POST /api/restock { rsvp_count? } → recompute shortages for current RSVPs and create restock tasks
import { NextResponse } from "next/server";
import { computeShortages, createRestockTasks } from "@/lib/restock";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (typeof body.rsvp_count === "number") {
    const { data: ev } = await supabaseAdmin.from("event").select("id").limit(1).single();
    if (ev) await supabaseAdmin.from("event").update({ rsvp_count: body.rsvp_count }).eq("id", ev.id);
  }
  const shortages = await computeShortages();
  const tasks_created = await createRestockTasks(shortages);
  return NextResponse.json({ shortages, tasks_created });
}

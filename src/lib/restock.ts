// Headcount-driven restock: needed = rsvp × rate × days. Shortages become tasks.
import { supabaseAdmin } from "./supabase-admin";

export interface Shortage { resource_id: string; name: string; have: number; need: number; missing: number; unit: string | null; }

export async function computeShortages(): Promise<Shortage[]> {
  const { data: ev } = await supabaseAdmin.from("event").select("rsvp_count, days").limit(1).single();
  const { data: stock } = await supabaseAdmin
    .from("resources").select("*").eq("type", "stock").not("per_person_per_day", "is", null);

  const rsvp = ev?.rsvp_count ?? 0;
  const days = ev?.days ?? 1;
  return (stock ?? [])
    .map((r) => {
      const need = Math.ceil(rsvp * r.per_person_per_day * days * 1.1); // 10% buffer
      const have = Number(r.qty ?? 0);
      return { resource_id: r.id, name: r.name, have, need, missing: Math.max(0, need - have), unit: r.unit };
    })
    .filter((s) => s.missing > 0);
}

/** Creates one restock task per shortage, unless an open one already exists. */
export async function createRestockTasks(shortages: Shortage[]): Promise<number> {
  let created = 0;
  for (const s of shortages) {
    const title = `Restock ${s.name}: order ${s.missing} ${s.unit ?? ""}`.trim();
    const { data: existing } = await supabaseAdmin
      .from("tasks").select("id").eq("source", "restock").neq("status", "done").ilike("title", `Restock ${s.name}%`);
    if (existing?.length) {
      await supabaseAdmin.from("tasks").update({ title }).eq("id", existing[0].id);
      continue;
    }
    await supabaseAdmin.from("tasks").insert({
      title, tags: ["logistics", "catering"], urgency: s.missing > s.have ? "high" : "medium",
      estimate_h: 1, source: "restock",
      description: `Have ${s.have}, need ${s.need} for current RSVPs (incl. 10% buffer).`,
    });
    created++;
  }
  return created;
}

// POST /api/assign { task_id, save?: boolean } → Gemma's pick + reason (+ 2 alternatives)
import { NextResponse } from "next/server";
import { askJSON, prompts } from "@/lib/gemma";
import { shortlist } from "@/lib/assign";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Pick = { person_id: string; reason: string; alternatives?: { person_id: string; reason: string }[] };

export async function POST(req: Request) {
  const { task_id, save = true } = await req.json();
  const { data: task, error } = await supabaseAdmin.from("tasks").select("*").eq("id", task_id).single();
  if (error || !task) return NextResponse.json({ error: "task not found" }, { status: 404 });

  const candidates = await shortlist(task);
  const slim = candidates.map(({ id, name, level, tags, open_tasks, open_hours, available_hours }) =>
    ({ person_id: id, name, level, tags, open_tasks, open_hours, available_hours }));

  let pick: Pick;
  try {
    pick = await askJSON<Pick>(prompts.assignTask(
      { title: task.title, tags: task.tags, urgency: task.urgency, deadline: task.deadline, estimate_h: task.estimate_h },
      slim
    ));
    if (!candidates.some((c) => c.id === pick.person_id)) throw new Error("not in shortlist");
  } catch {
    // Fallback keeps the demo alive if Gemma returns something unusable.
    const top = candidates[0];
    pick = { person_id: top.id, reason: `Best tag match with free capacity (${top.tags.join(", ")}).`, alternatives: [] };
  }

  if (save) {
    await supabaseAdmin.from("tasks").update({ assignee_id: pick.person_id, ai_reason: pick.reason }).eq("id", task_id);
  }
  return NextResponse.json(pick);
}

// POST /api/command
//   { text }                        → { proposal: { action, args, reply } }   (nothing changes yet)
//   { confirm: true, proposal }     → { result }                               (runs the action)
// Gemma only chooses the action; this code executes it. Reads run without confirmation.
import { NextResponse } from "next/server";
import { ask, askJSON, prompts } from "@/lib/gemma";
import { shortlist } from "@/lib/assign";
import { computeShortages } from "@/lib/restock";
import { supabaseAdmin as db } from "@/lib/supabase-admin";

type Proposal = { action: string; args: Record<string, any>; reply: string };
const WRITES = new Set(["create_task", "assign_task"]);

async function run(p: Proposal) {
  switch (p.action) {
    case "find_person": {
      const fake = { tags: p.args.tags ?? [], urgency: "medium", estimate_h: 1 } as any;
      const list = await shortlist(fake, 3);
      return list.map((c) => ({ name: c.name, tags: c.tags, open_tasks: c.open_tasks }));
    }
    case "create_task": {
      const { data } = await db.from("tasks").insert({
        title: p.args.title, tags: p.args.tags ?? [], urgency: p.args.urgency ?? "medium",
        deadline: p.args.deadline ?? null, source: "assistant",
      }).select().single();
      return data;
    }
    case "assign_task": {
      const { data: t } = await db.from("tasks").select("id").ilike("title", `%${p.args.task_title}%`).limit(1).single();
      if (!t) return { error: "task not found" };
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/assign`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: t.id }),
      });
      return res.json();
    }
    case "check_stock": {
      const shortages = await computeShortages();
      const item = (p.args.item ?? "").toLowerCase();
      return item ? shortages.filter((s) => s.name.toLowerCase().includes(item)) : shortages;
    }
    case "summarise_today": {
      const { data } = await db.from("tasks").select("title, urgency, status, deadline").neq("status", "done")
        .order("deadline", { ascending: true }).limit(15);
      return ask(`Summarise today's priorities for the organiser in 4 short bullet points:\n${JSON.stringify(data)}`);
    }
    case "draft_message":
      return ask(prompts.draftMessage(p.args.role, p.args.topic));
    default:
      return { message: p.reply };
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  if (body.confirm && body.proposal) {
    return NextResponse.json({ result: await run(body.proposal) });
  }
  const proposal = await askJSON<Proposal>(prompts.command(body.text, new Date().toISOString()));
  if (!WRITES.has(proposal.action)) {
    return NextResponse.json({ proposal, result: await run(proposal) }); // reads: answer immediately
  }
  return NextResponse.json({ proposal, needs_confirmation: true });
}

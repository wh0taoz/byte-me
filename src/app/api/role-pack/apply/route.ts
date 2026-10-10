// POST /api/role-pack/apply { person_id, role_id, google_token }
// One action: Drive access per role file, chat groups, starter tasks, Gemma welcome brief.
import { NextResponse } from "next/server";
import { ask, prompts } from "@/lib/gemma";
import { grantAccess } from "@/lib/google-drive";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const { person_id, role_id, google_token } = await req.json();
  const db = supabaseAdmin;

  const [{ data: person }, { data: role }, { data: files }, { data: groups }, { data: starters }, { data: ev }] =
    await Promise.all([
      db.from("people").select("*").eq("id", person_id).single(),
      db.from("roles").select("*").eq("id", role_id).single(),
      db.from("role_files").select("*").eq("role_id", role_id),
      db.from("role_groups").select("*").eq("role_id", role_id),
      db.from("role_starter_tasks").select("*").eq("role_id", role_id),
      db.from("event").select("ends_at").limit(1).single(),
    ]);
  if (!person || !role) return NextResponse.json({ error: "person or role not found" }, { status: 404 });

  const { data: pr } = await db.from("person_roles")
    .insert({ person_id, role_id }).select().single();

  // 1. Drive access, one file at a time (concurrent changes on one file can fail)
  const granted: { name: string | null; url: string | null; access: string }[] = [];
  const errors: string[] = [];
  for (const f of files ?? []) {
    try {
      if (!google_token || !person.email) throw new Error("no Google token or email");
      const permId = await grantAccess(google_token, f.drive_file_id, person.email, f.access, ev?.ends_at);
      await db.from("file_grants").insert({ person_role_id: pr!.id, role_file_id: f.id, drive_permission_id: permId });
      granted.push({ name: f.file_name, url: f.file_url, access: f.access });
    } catch (e) {
      errors.push(`${f.file_name}: ${String(e)}`);
    }
  }

  // 2. Starter tasks, assigned straight to this person
  const tasks = (starters ?? []).map((s) => ({
    title: s.title, tags: s.tags, urgency: s.urgency, estimate_h: s.estimate_h,
    assignee_id: person_id, source: "role_pack", ai_reason: `Starter task for ${role.name}`,
  }));
  if (tasks.length) await db.from("tasks").insert(tasks);

  // 3. Gemma welcome brief
  let brief = "";
  try {
    brief = await ask(prompts.welcomeBrief(
      person.name, person.level, role.name, role.description ?? "",
      granted.map((g) => `${g.name} (${g.access === "writer" ? "can edit" : "can view"})`),
      (groups ?? []).map((g) => g.group_name),
      tasks.map((t) => t.title)
    ));
    await db.from("person_roles").update({ welcome_brief: brief }).eq("id", pr!.id);
  } catch {
    brief = `Welcome, ${person.name}! You're now ${role.name}.`;
  }

  return NextResponse.json({ person_role_id: pr!.id, brief, files: granted, groups, tasks, errors });
}

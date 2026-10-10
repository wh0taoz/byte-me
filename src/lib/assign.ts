// Shortlist candidates in code (fast, deterministic), then let Gemma choose and explain.
import { supabaseAdmin } from "./supabase-admin";
import type { Candidate, Person, Task } from "./types";

const LEVEL = { beginner: 0, intermediate: 1, advanced: 2 } as const;

export function scoreCandidate(task: Task, p: Person & { open_tasks: number; open_hours: number }): number {
  const overlap = task.tags.filter((t) => p.tags.includes(t)).length;
  const freeHours = p.available_hours - p.open_hours;
  const needsExperience = task.urgency === "high" ? 1 : 0;
  return (
    overlap * 3 +                                   // tags matter most
    Math.min(LEVEL[p.level], 2) * needsExperience + // urgent → favour experience
    (freeHours >= task.estimate_h ? 1 : -2) -       // can they fit it?
    p.open_tasks * 0.5                              // spread the load
  );
}

export async function shortlist(task: Task, size = 8): Promise<Candidate[]> {
  const { data: people } = await supabaseAdmin.from("people").select("*");
  const { data: loads } = await supabaseAdmin.from("person_load").select("*");
  const loadBy = new Map((loads ?? []).map((l) => [l.person_id, l]));

  return (people ?? [])
    .map((p) => {
      const l = loadBy.get(p.id) ?? { open_tasks: 0, open_hours: 0 };
      const withLoad = { ...p, open_tasks: Number(l.open_tasks), open_hours: Number(l.open_hours) };
      return { ...withLoad, score: scoreCandidate(task, withLoad) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, size);
}

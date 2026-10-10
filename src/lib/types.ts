// Shared types — agree on these first so all three of you build against the same shapes.
export type Level = "beginner" | "intermediate" | "advanced";
export type Urgency = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";
export type DriveAccess = "reader" | "commenter" | "writer";

export interface Person {
  id: string; name: string; email: string | null; github: string | null;
  level: Level; tags: string[]; available_hours: number; mascot_xp: number;
}
export interface Role { id: string; name: string; description: string | null; default_tags: string[]; }
export interface RoleFile { id: string; role_id: string; drive_file_id: string; file_name: string | null; file_url: string | null; access: DriveAccess; }
export interface RoleGroup { id: string; role_id: string; group_name: string; invite_url: string | null; }
export interface Task {
  id: string; title: string; description: string | null; tags: string[]; urgency: Urgency;
  deadline: string | null; estimate_h: number; status: TaskStatus;
  assignee_id: string | null; ai_reason: string | null; source: string;
}
export interface Resource {
  id: string; type: "stock" | "vendor" | "sponsor" | "budget"; name: string;
  qty: number | null; unit: string | null; per_person_per_day: number | null;
  amount: number | null; contact: string | null; status: string | null; notes: string | null;
}
export interface Candidate extends Person { open_tasks: number; open_hours: number; score: number; }

// ---- API contracts ----
// GET  /api/health                                              -> { ok, gemma, supabase }
// POST /api/assign          { task_id }                         -> { person_id, reason, alternatives: [{person_id, reason}] }
// POST /api/role-pack/apply { person_id, role_id, google_token } -> { brief, files, groups, tasks }
// POST /api/role-pack/revoke{ person_role_id, google_token }     -> { revoked: number }
// POST /api/restock         {}                                  -> { shortages: [...], tasks_created: number }
// POST /api/command         { text, confirm?, proposal? }       -> { proposal } | { result }

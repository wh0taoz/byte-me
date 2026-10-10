// Google Drive sharing via the REST API (no extra package needed).
// The access token comes from Supabase Auth's Google login: session.provider_token
// (requested with the drive.file scope — see START-HERE.md). Server-side use only.
import type { DriveAccess } from "./types";

const DRIVE = "https://www.googleapis.com/drive/v3";

async function drive(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`${DRIVE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
  });
  if (!res.ok) throw new Error(`Drive ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

/** Create a Google Doc or Sheet owned by the signed-in organiser (works with the drive.file scope). */
export async function createFile(token: string, name: string, kind: "doc" | "sheet") {
  const mimeType = kind === "doc"
    ? "application/vnd.google-apps.document"
    : "application/vnd.google-apps.spreadsheet";
  const file = await drive(token, "/files?fields=id,name,webViewLink", {
    method: "POST",
    body: JSON.stringify({ name, mimeType }),
  });
  return file as { id: string; name: string; webViewLink: string };
}

/** Grant one person access. Returns the permission id — store it so you can revoke later.
 *  Run grants one at a time per file: concurrent changes on the same file can fail. */
export async function grantAccess(
  token: string, fileId: string, email: string, role: DriveAccess, expiresAt?: string
): Promise<string> {
  const body: Record<string, unknown> = { type: "user", role, emailAddress: email };
  // Expiry works for user grants and must be in the future (max 1 year).
  if (expiresAt && new Date(expiresAt) > new Date()) body.expirationTime = expiresAt;
  const perm = await drive(token, `/files/${fileId}/permissions?sendNotificationEmail=false&fields=id`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return (perm as { id: string }).id;
}

export async function revokeAccess(token: string, fileId: string, permissionId: string) {
  await drive(token, `/files/${fileId}/permissions/${permissionId}`, { method: "DELETE" });
}

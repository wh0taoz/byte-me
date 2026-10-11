// The only file the UI talks to the backend through.
"use client";

import type { EventRow, GoingResult, Level, ProfileRow } from "./types";

// Raw network/5xx failures never reach the UI as error text — the team rule is
// "the UI must never show a raw error in the demo". 4xx bodies from our routes
// carry clean, human messages ("Event not found"), so those pass through.
const SERVER_ERROR = "Something went wrong on our side — please try again.";
const NETWORK_ERROR = "We couldn't reach the server — check your connection and try again.";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", ...init });
  } catch {
    throw new Error(NETWORK_ERROR);
  }
  if (!res.ok) {
    const message = res.status >= 500 ? SERVER_ERROR : await friendly4xx(res);
    const err = new Error(message) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

async function friendly4xx(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? SERVER_ERROR;
}

function post<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ---- events ----------------------------------------------------------------
export async function getEvents(filters?: {
  level?: Level;
  type?: string;
  city?: string;
}): Promise<EventRow[]> {
  const params = new URLSearchParams();
  if (filters?.level) params.set("level", filters.level);
  if (filters?.type) params.set("type", filters.type);
  if (filters?.city) params.set("city", filters.city);
  const qs = params.toString();
  return request<EventRow[]>(`/api/events${qs ? `?${qs}` : ""}`);
}

export async function getEvent(id: string): Promise<EventRow> {
  return request<EventRow>(`/api/events/${id}`);
}

/** Download the .ics as a blob so a failure becomes a toast, not a JSON page. */
export async function downloadIcs(id: string, title: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`/api/events/${id}/ics`);
  } catch {
    throw new Error(NETWORK_ERROR);
  }
  if (!res.ok) throw new Error(SERVER_ERROR);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(title)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "event"
  );
}

// ---- going / buddy pairing ---------------------------------------------------
export interface GoingRow {
  id: string;
  first_timer: boolean | null;
  buddy_profile_id: string | null;
  buddy_nickname: string | null;
  attended: boolean | null;
  events: EventRow;
}

export async function getMyGoing(profileId: string): Promise<GoingRow[]> {
  return request<GoingRow[]>(`/api/going?profile_id=${encodeURIComponent(profileId)}`);
}

export async function markGoing(input: {
  event_id: string;
  profile_id: string;
  first_timer: boolean;
}): Promise<GoingResult> {
  return post<GoingResult>("/api/going", input);
}

/** Un-going: removes the row and clears the buddy link on both sides. */
export async function unGoing(eventId: string, profileId: string): Promise<void> {
  await request<{ ok: boolean }>(
    `/api/going?event_id=${encodeURIComponent(eventId)}&profile_id=${encodeURIComponent(profileId)}`,
    { method: "DELETE" },
  );
}

/** "I was there" — marks attendance and counts a step. */
export async function markAttended(goingId: string): Promise<{ ok: boolean }> {
  return post<{ ok: boolean }>("/api/going/attended", { going_id: goingId });
}

// ---- guides --------------------------------------------------------------------
export async function getGuides(): Promise<
  { slug: string; title: string; body_md: string; emoji: string | null }[]
> {
  return request("/api/guides");
}

// ---- AI: "Say it simply" ---------------------------------------------------------
export async function simplifyText(text: string, level: Level): Promise<{ text: string; fallback?: boolean }> {
  return post("/api/simplify", { text, level });
}

// ---- profiles (local demo identity, no auth yet) ---------------------------------
// Stored as an object so the nickname/level survive reloads (chat is level-aware,
// My events greets you by name). Older demos stored only the id — both work.
const PROFILE_KEY = "esc:profile";
const LEGACY_ID_KEY = "esc:profile-id";

export interface LocalProfile {
  id: string;
  nickname?: string;
  level?: Level;
  first_timer?: boolean;
}

export function getLocalProfile(): LocalProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as LocalProfile;
      if (p?.id) return p;
    }
  } catch {
    // corrupted entry — fall through to the legacy key
  }
  const legacy = window.localStorage.getItem(LEGACY_ID_KEY);
  return legacy ? { id: legacy } : null;
}

export function setLocalProfile(profile: LocalProfile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.localStorage.setItem(LEGACY_ID_KEY, profile.id); // kept in sync for older code paths
}

/** Drop the local identity — used when the server no longer knows the profile. */
export function clearLocalProfile() {
  window.localStorage.removeItem(PROFILE_KEY);
  window.localStorage.removeItem(LEGACY_ID_KEY);
}

export function getLocalProfileId(): string | null {
  return getLocalProfile()?.id ?? null;
}

export async function createProfile(input: {
  nickname: string;
  level?: Level;
  first_timer?: boolean;
}): Promise<ProfileRow> {
  return post<ProfileRow>("/api/profiles", input);
}

// ---- labels ---------------------------------------------------------------------
export function levelLabel(level: Level): string {
  return { beginner: "Beginner", intermediate: "Intermediate", expert: "Expert" }[level];
}

/** Plain-language explanation of a level — shown on every event page. */
export function levelExplanation(level: Level): string {
  return {
    beginner: "No prior knowledge needed — everything is explained from scratch and every question is welcome.",
    intermediate: "Knowing the basics helps, but nothing is strictly required — the key points are always recapped.",
    expert: "The event assumes you already work with the topic. Jargon and depth are part of the ride.",
  }[level];
}

export const ALL_LEVELS: Level[] = ["beginner", "intermediate", "expert"];
export const ALL_TYPES = ["hackathon", "meetup", "seminar", "workshop", "conference"] as const;

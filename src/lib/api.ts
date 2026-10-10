// The only file the UI talks to the backend through.
"use client";

import type { EventRow, GoingResult, Level, ProfileRow } from "./types";

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
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
  return get<EventRow[]>(`/api/events${qs ? `?${qs}` : ""}`);
}

export async function getEvent(id: string): Promise<EventRow> {
  return get<EventRow>(`/api/events/${id}`);
}

export function icsUrl(id: string): string {
  return `/api/events/${id}/ics`;
}

// ---- going / buddy pairing ---------------------------------------------------
export async function markGoing(input: {
  event_id: string;
  profile_id: string;
  first_timer: boolean;
}): Promise<GoingResult> {
  const res = await fetch("/api/going", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<GoingResult>;
}

// ---- guides --------------------------------------------------------------------
export async function getGuides(): Promise<
  { slug: string; title: string; body_md: string; emoji: string | null }[]
> {
  return get("/api/guides");
}

// ---- profiles (local demo identity, no auth yet) ---------------------------------
const PROFILE_KEY = "esc:profile-id";

export function getLocalProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PROFILE_KEY);
}

export function setLocalProfileId(id: string) {
  window.localStorage.setItem(PROFILE_KEY, id);
}

export async function createProfile(input: {
  nickname: string;
  level?: Level;
  first_timer?: boolean;
}): Promise<ProfileRow> {
  const res = await fetch("/api/profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<ProfileRow>;
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

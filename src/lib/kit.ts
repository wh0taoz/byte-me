// Shared helpers for the SCOUT UI kit assets + persisted saves.
import type { Level } from "./types";

/** Official mascot art from the kit — never a substitute. */
export const MASCOT = {
  welcome: "/assets/mascot/welcome.png",
  listening: "/assets/mascot/listening.png",
  firstStep: "/assets/mascot/first-step.png",
  avatar: "/assets/mascot/avatar.png",
  heroWave: "/assets/mascot/hero-wave.png",
  helperWink: "/assets/mascot/helper-wink.png",
} as const;

export function levelArt(level: Level): string {
  return `/assets/mascot/level-${level}.png`;
}

export const ICON = {
  arrowRight: "/assets/icons/arrow-right.svg",
  bookmark: "/assets/icons/bookmark.svg",
  bookmarkFilled: "/assets/icons/bookmark-filled.svg",
  calendar: "/assets/icons/calendar.svg",
  chat: "/assets/icons/chat.svg",
  close: "/assets/icons/close.svg",
  filters: "/assets/icons/filters.svg",
  help: "/assets/icons/help.svg",
  home: "/assets/icons/home.svg",
  people: "/assets/icons/people.svg",
  pin: "/assets/icons/pin.svg",
  profile: "/assets/icons/profile.svg",
  search: "/assets/icons/search.svg",
  sprout: "/assets/icons/sprout.svg",
} as const;

// ---- persisted saves (client-side collection; no backend endpoint yet) ----
const SAVED_KEY = "stepin:saved";

export function getSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function setSavedIds(ids: string[]) {
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}

export function toggleSaved(id: string): string[] {
  const current = getSavedIds();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  setSavedIds(next);
  return next;
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id);
}

// ---- local preparation checklist (My events) -------------------------------
export function getChecklist(eventId: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(`stepin:checklist:${eventId}`) ?? "[]") as number[];
  } catch {
    return [];
  }
}

export function setChecklist(eventId: string, checked: number[]) {
  window.localStorage.setItem(`stepin:checklist:${eventId}`, JSON.stringify(checked));
}

export const CHECKLIST_ITEMS = [
  "Bring your laptop & charger",
  "Check how to get there",
  "Bring a question. Any question.",
];

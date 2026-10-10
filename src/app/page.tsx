"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ALL_LEVELS, ALL_TYPES, getEvents, levelLabel } from "@/lib/api";
import type { EventRow, Level } from "@/lib/types";
import { ICON, MASCOT, getSavedIds, isSaved, toggleSaved } from "@/lib/kit";
import { cn } from "@/lib/utils";
import { EventCard } from "@/components/event-card";
import { Empty, LevelPill, Skeleton } from "@/components/ui";

export default function DiscoverPage() {
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<Level | "all">("beginner");
  const [type, setType] = useState<string>("all");
  const [city, setCity] = useState("Belgrade");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    void getEvents()
      .then(setEvents)
      .catch((e: Error) => setError(e.message));
    setSavedIds(getSavedIds());
  }, []);

  const cities = useMemo(() => [...new Set((events ?? []).map((e) => e.city))], [events]);

  const filtered = useMemo(() => {
    if (!events) return [];
    const needle = q.trim().toLowerCase();
    return events.filter((e) => {
      if (level !== "all" && e.level !== level) return false;
      if (type !== "all" && e.type !== type) return false;
      if (city !== "all" && e.city !== city) return false;
      if (needle) {
        const hay = `${e.title} ${e.organizer} ${e.city} ${e.description}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [events, q, level, type, city]);

  function onToggleSave(id: string) {
    const next = toggleSaved(id);
    setSavedIds(next);
    window.dispatchEvent(
      new CustomEvent("stepin:toast", {
        detail: next.includes(id) ? "Saved for someday." : "Removed from saved.",
      }),
    );
  }

  function resetFilters() {
    setQ("");
    setLevel("all");
    setType("all");
    setCity("all");
  }

  return (
    <div>
      {/* ---- teal gradient: light melts into dark ---- */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(1100px 550px at 85% 100%, rgba(0, 116, 125, 0.5), transparent 60%),
            radial-gradient(900px 480px at 8% 0%, rgba(255, 255, 255, 0.85), transparent 55%),
            linear-gradient(180deg, #fbfdfc 0%, #e5f5ee 26%, #9ed8c9 58%, #00747d 100%)
          `,
        }}
      />

      {/* ---- hero: Pip greets you ---- */}
      <section className="mb-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-deep">
          Every step counts
        </p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Find your <span className="text-primary">first step.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/75 md:text-base">
              Tech events with a difficulty level and a plain-language &quot;what to expect&quot;.
              First time ever? Even better — that&apos;s the normal state around here.
            </p>
          </div>
          <div className="flex items-center gap-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
            <img
              src={MASCOT.heroWave}
              alt="Pip the stoat waves hello"
              className="h-28 w-[98px] shrink-0 object-contain md:h-32"
            />
            <div className="relative flex-1 rounded-2xl border-2 border-b-4 border-line bg-surface p-4">
              <span
                aria-hidden
                className="absolute -left-[8px] top-2/5 size-3 rotate-45 border-b-2 border-l-2 border-line bg-surface"
              />
              <p className="text-sm font-bold">Hey! New around here?</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                Find an event that feels right. I&apos;ll help with the first step.
              </p>
              <Link
                href="/ask-pip"
                className="mt-2 flex items-center justify-between text-xs font-bold text-primary-deep"
              >
                Ask me anything <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {ALL_LEVELS.map((lv) => (
            <LevelPill key={lv} level={lv} />
          ))}
          <span className="text-xs text-muted">
            the Pip on every card shows the difficulty level
          </span>
        </div>
      </section>

      {/* ---- search + filters ---- */}
      <section className="card mb-6 flex flex-col gap-3 border-2 p-3 shadow-winter lg:flex-row lg:items-center" aria-label="Find events">
        <label className="relative flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img
            src={ICON.search}
            alt=""
            className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 opacity-70"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            placeholder="What are you curious about?"
            aria-label="Search events"
            className="h-[52px] w-full rounded-xl border-2 border-line bg-[#f6f8fa] pl-11 pr-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </label>

        <label className="flex h-[52px] items-center gap-2 rounded-xl border-2 border-line bg-surface px-3 lg:w-48">
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img src={ICON.pin} alt="" className="size-4.5 opacity-70" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="City"
            className="h-full w-full min-w-0 bg-transparent text-sm text-ink focus:outline-none"
          >
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Difficulty">
          <Chip active={level === "all"} onClick={() => setLevel("all")}>
            All levels
          </Chip>
          {ALL_LEVELS.map((lv) => (
            <Chip key={lv} active={level === lv} onClick={() => setLevel(lv)} mint>
              {levelLabel(lv)}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Type">
          <Chip active={type === "all"} onClick={() => setType("all")} pill>
            All types
          </Chip>
          {ALL_TYPES.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)} pill>
              {t}
            </Chip>
          ))}
        </div>
      </section>

      {/* ---- results ---- */}
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">Pick your comfort zone</h2>
        <span aria-live="polite" className="text-[13px] text-muted">
          {filtered.length} {filtered.length === 1 ? "event" : "events"}
        </span>
      </div>

      {error ? (
        <Empty title="Couldn't load events" hint={error} />
      ) : !events ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-12 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
          <img src={MASCOT.listening} alt="Pip is ready to help" className="h-32 object-contain" />
          <h3 className="mt-4 text-lg font-bold">Let&apos;s try another step.</h3>
          <p className="mt-1 text-sm text-muted">No events match yet. Try fewer filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border-2 border-b-4 border-primary bg-surface px-5 text-sm font-bold text-primary-deep transition-colors hover:bg-ice"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {filtered.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              saved={savedIds.includes(e.id) || isSaved(e.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </ul>
      )}

      <p className="mt-10 text-center text-xs text-muted">
        A little curiosity goes a long way.
      </p>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  mint = false,
  pill = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  mint?: boolean;
  pill?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-10 border font-bold capitalize transition-colors",
        pill ? "rounded-full border px-3 text-xs" : "rounded-xl border-2 border-b-4 px-3 text-[13px]",
        active && mint && "border-line-strong bg-ice text-primary-deep",
        active && !mint && "border-primary bg-primary text-surface",
        active && pill && mint && "border-primary bg-primary text-surface",
        !active && "border-line bg-surface text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

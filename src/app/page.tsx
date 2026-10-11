"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ALL_LEVELS, ALL_TYPES, getEvents, levelLabel } from "@/lib/api";
import type { EventRow, Level } from "@/lib/types";
import { ICON, MASCOT, getSavedIds, toggleSaved } from "@/lib/kit";
import { cn } from "@/lib/utils";
import { EventCard } from "@/components/event-card";
import { Button, Empty, Skeleton } from "@/components/ui";

// useSearchParams needs a Suspense boundary during prerender.
export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      }
    >
      <Discover />
    </Suspense>
  );
}

function Discover() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
  const [level, setLevel] = useState<Level | "all">(() => {
    const l = searchParams.get("level");
    return ALL_LEVELS.includes(l as Level) ? (l as Level) : "beginner";
  });
  const [type, setType] = useState<string>(
    () => (ALL_TYPES as readonly string[]).includes(searchParams.get("type") ?? "")
      ? (searchParams.get("type") as string)
      : "all",
  );
  const [city, setCity] = useState(() => searchParams.get("city") ?? "Belgrade");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const load = useCallback(() => {
    void getEvents()
      .then((ev) => {
        setEvents(ev);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
    setSavedIds(getSavedIds());
  }, [load, reloadKey]);

  // Filters live in the URL — refresh, share and back/forward keep your view.
  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (level !== "all") params.set("level", level);
    if (type !== "all") params.set("type", type);
    if (city !== "all") params.set("city", city);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }, [q, level, type, city, router]);

  const cities = useMemo(() => [...new Set((events ?? []).map((e) => e.city))], [events]);

  const [now, setNow] = useState(0);
  useEffect(() => setNow(Date.now()), []);

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

  const { upcoming, past } = useMemo(() => {
    const up: EventRow[] = [];
    const gone: EventRow[] = [];
    for (const e of filtered) (new Date(e.ends_at ?? e.starts_at).getTime() < now ? gone : up).push(e);
    return { upcoming: up, past: gone };
  }, [filtered, now]);

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
      {/* ---- hero: Pip greets you ---- */}
      <section className="card brand-gradient mb-7 flex flex-col gap-8 p-8 md:flex-row md:items-center md:p-11 md:pl-12">
        <div className="flex max-w-xl flex-col gap-3.5">
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-primary-deep">
            Tech events for first-timers
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.16] tracking-[-0.02em] text-ink md:text-5xl">
            Every step counts.
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted md:text-[17px]">
            Tech events simplified, no matter the experience. First time ever? No worries! Pip is
            here to guide you through the scariest part – taking the first step.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 md:w-[380px]">
          <div className="card w-[210px] rounded-xl p-4">
            <p className="text-[13px] font-semibold leading-snug">
              Hi, I&apos;m Pip! Not sure an event is for you?{" "}
              <Link href="/ask-pip" className="underline underline-offset-2">
                Ask me anything.
              </Link>
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
          <img
            src={MASCOT.heroWave}
            alt="Pip the stoat waves hello"
            className="h-36 w-auto max-w-[55%] object-contain md:h-[190px] md:max-w-none"
          />
        </div>
      </section>

      {/* ---- search + filters ---- */}
      <section className="card mb-7 flex flex-col gap-3 p-3 lg:flex-row lg:items-center" aria-label="Find events">
        <label className="relative flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img
            src={ICON.search}
            alt=""
            className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            placeholder="What are you curious about?"
            aria-label="Search events"
            className="h-[52px] w-full rounded-xl border-[1.5px] border-line bg-bg pl-11 pr-3 text-sm text-ink placeholder:text-muted focus:border-primary-deep focus:outline-none"
          />
        </label>

        <label className="flex h-[52px] items-center gap-2 rounded-xl border-[1.5px] border-line bg-surface px-3 lg:w-48">
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img src={ICON.pin} alt="" className="size-4.5" />
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
            <Chip key={lv} active={level === lv} onClick={() => setLevel(lv)}>
              {levelLabel(lv)}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Type">
          <Chip active={type === "all"} onClick={() => setType("all")}>
            All types
          </Chip>
          {ALL_TYPES.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </section>

      {/* ---- results ---- */}
      <div className="mb-5 text-center">
        <h2 className="text-[26px] font-bold leading-[38px] tracking-[-0.01em] md:text-[30px]">
          Find what suits you best
        </h2>
        {/* result count stays announced for screen readers */}
        <span aria-live="polite" className="sr-only">
          {events === null ? "Loading events" : `${filtered.length} ${filtered.length === 1 ? "event" : "events"}`}
        </span>
      </div>

      {error ? (
        <Empty
          title="Couldn't load events"
          hint={error}
          action={<Button onClick={() => setReloadKey((k) => k + 1)}>Try again</Button>}
        />
      ) : !events ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
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
            className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border-2 border-b-4 border-line-strong bg-surface px-5 text-sm font-bold text-ink transition-colors hover:bg-ice"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                saved={savedIds.includes(e.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </ul>

          {past.length > 0 ? (
            <div className="mt-10">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-lg font-bold tracking-tight text-muted">Already happened</h2>
                <span className="text-[13px] text-muted">
                  {past.length} {past.length === 1 ? "event" : "events"}
                </span>
              </div>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((e) => (
                  <EventCard
                    key={e.id}
                    event={e}
                    saved={savedIds.includes(e.id)}
                    onToggleSave={onToggleSave}
                    past
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </>
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
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-10 rounded-full border-[1.5px] px-3.5 text-[13px] font-semibold capitalize transition-colors",
        active
          ? "border-transparent bg-nav-dark text-on-dark"
          : "border-line bg-surface text-muted hover:border-primary-deep hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

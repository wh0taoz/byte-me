"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getEvents } from "@/lib/api";
import type { EventRow } from "@/lib/types";
import { ICON, MASCOT, getSavedIds, toggleSaved } from "@/lib/kit";
import { cn } from "@/lib/utils";
import { EventCard } from "@/components/event-card";
import { Skeleton } from "@/components/ui";

export default function SavedPage() {
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [collection, setCollection] = useState<string>("all");

  useEffect(() => {
    void getEvents().then(setEvents);
    setSavedIds(getSavedIds());
  }, []);

  const savedEvents = useMemo(
    () => (events ?? []).filter((e) => savedIds.includes(e.id)),
    [events, savedIds],
  );

  const savedTypes = useMemo(
    () => [...new Set(savedEvents.map((e) => e.type))],
    [savedEvents],
  );

  const filtered = useMemo(
    () =>
      collection === "all"
        ? savedEvents
        : savedEvents.filter((e) => e.type === collection),
    [savedEvents, collection],
  );

  function onToggleSave(id: string) {
    const next = toggleSaved(id);
    setSavedIds(next);
    window.dispatchEvent(
      new CustomEvent("stepin:toast", {
        detail: next.includes(id) ? "Saved for someday." : "Removed from saved.",
      }),
    );
  }

  return (
    <div>
      <header className="mb-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-deep">
          Your collection
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Saved for someday<span className="text-primary">.</span>
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base">
          Good possibilities. Zero pressure.
        </p>
      </header>

      <div className="card mb-6 flex items-center gap-4 border-2 border-b-4 p-5">
        {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
        <img src={ICON.bookmark} alt="" className="rounded-xl bg-ice p-2.5" />
        <div>
          <p className="font-bold">
            {savedEvents.length > 0 ? "Saved for later" : "Nothing saved yet"}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {savedEvents.length === 1
              ? "One thing that caught your curiosity."
              : savedEvents.length > 0
                ? `${savedEvents.length} things that caught your curiosity.`
                : "Events you save will wait for you here."}
          </p>
        </div>
        <span className="ml-auto text-3xl font-extrabold tracking-tight text-primary-deep">
          {String(savedEvents.length).padStart(2, "0")}
        </span>
      </div>

      {savedTypes.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Saved categories">
          <Tab active={collection === "all"} onClick={() => setCollection("all")}>
            All saved
          </Tab>
          {savedTypes.map((t) => (
            <Tab key={t} active={collection === t} onClick={() => setCollection(t)}>
              {t}s
            </Tab>
          ))}
        </div>
      ) : null}

      {!events ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-12 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
          <img src={MASCOT.listening} alt="Pip listens" className="h-32 object-contain" />
          <h2 className="mt-4 text-lg font-bold">Your next possibility is out there.</h2>
          <p className="mt-1 text-sm text-muted">Save an event that sparks your curiosity.</p>
          <Link
            href="/"
            className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border-2 border-b-4 border-primary bg-surface px-5 text-sm font-bold text-primary-deep transition-colors hover:bg-ice"
          >
            Discover events
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Worth a first step</h2>
            <span aria-live="polite" className="text-[13px] text-muted">
              {filtered.length} saved
            </span>
          </div>
          <ul className="grid gap-5 md:grid-cols-2">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} saved onToggleSave={onToggleSave} />
            ))}
          </ul>
        </>
      )}

      <Link
        href="/"
        className="mt-8 flex flex-col items-center gap-2 rounded-2xl border-2 border-b-4 border-line bg-surface px-6 py-6 text-center text-sm text-muted transition-colors hover:bg-ice"
      >
        <span>There&apos;s more out there.</span>
        <strong className="text-primary-deep">Find another event →</strong>
      </Link>
    </div>
  );
}

function Tab({
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
        "min-h-10 rounded-full border px-3.5 text-xs font-bold capitalize transition-colors",
        active
          ? "border-primary bg-primary text-surface"
          : "border-line bg-[#f6f8fa] text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

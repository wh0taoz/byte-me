"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getLocalProfileId, getMyGoing, levelLabel } from "@/lib/api";
import type { GoingRow } from "@/lib/api";
import { CHECKLIST_ITEMS, ICON, MASCOT, getChecklist, setChecklist } from "@/lib/kit";
import { fmtTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LevelPill, Skeleton } from "@/components/ui";

export default function MyEventsPage() {
  const [going, setGoing] = useState<GoingRow[] | null>(null);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    const pid = getLocalProfileId();
    if (!pid) {
      setHasProfile(false);
      setGoing([]);
      return;
    }
    void getMyGoing(pid)
      .then(setGoing)
      .catch(() => setGoing([]));
  }, []);

  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  const upcoming = useMemo(
    () => (going ?? []).filter((g) => +new Date(g.events.starts_at) >= now),
    [going, now],
  );
  const past = useMemo(
    () => (going ?? []).filter((g) => +new Date(g.events.starts_at) < now),
    [going, now],
  );

  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const shown = tab === "upcoming" ? upcoming : past;

  return (
    <div>
      <header className="mb-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-deep">
          A little plan. A big first step.
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          You&apos;re going places<span className="text-primary">.</span>
        </h1>
      </header>

      {/* ---- journey / progress ---- */}
      <div className="mb-6 grid gap-3 rounded-[20px] border-2 border-b-4 border-line-strong bg-[#edfae2] p-5 sm:grid-cols-[1fr_100px] sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-deep">
            Step 01 · Show up
          </p>
          <h2 className="mt-1.5 text-lg font-bold">
            {upcoming.length > 0
              ? "Your first event is waiting."
              : "Your first step is out there."}
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            {upcoming.length === 1
              ? "One new experience on the horizon."
              : upcoming.length > 1
                ? `${upcoming.length} new experiences on the horizon.`
                : "Mark an event as going and it becomes a plan."}
          </p>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="size-3.5 rounded-full border-2 border-[#a9ccc2] bg-primary" aria-label="done" />
            <i className="h-0.5 flex-1 bg-[#bbddd2]" />
            <span
              className={cn(
                "size-3.5 rounded-full border-[3px] bg-white",
                upcoming.length > 0 ? "border-primary shadow-[0_0_0_3px_#c8e7dc]" : "border-[#a9ccc2]",
              )}
              aria-label="current"
            />
            <i className="h-0.5 flex-1 bg-[#bbddd2]" />
            <span className="size-3.5 rounded-full border-2 border-[#a9ccc2] bg-white" aria-label="todo" />
          </div>
          <div className="mt-1 flex justify-between text-[8px] font-bold text-primary-deep">
            <span>Get curious</span>
            <span>Show up</span>
            <span>Find your people</span>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
        <img
          src={MASCOT.firstStep}
          alt="Pip takes a small confident step"
          className="mx-auto h-24 object-contain"
        />
      </div>

      {/* ---- tabs ---- */}
      <div className="mb-5 flex gap-1.5" role="group" aria-label="Event tabs">
        <button
          onClick={() => setTab("upcoming")}
          aria-pressed={tab === "upcoming"}
          className={cn(
            "min-h-10 rounded-full border px-3.5 text-xs font-bold transition-colors",
            tab === "upcoming"
              ? "border-primary bg-primary text-surface"
              : "border-line bg-[#f6f8fa] text-muted hover:text-ink",
          )}
        >
          Upcoming <span className="ml-1 rounded-md bg-surface px-1.5 py-px text-primary-deep">{upcoming.length}</span>
        </button>
        <button
          onClick={() => setTab("past")}
          aria-pressed={tab === "past"}
          className={cn(
            "min-h-10 rounded-full border px-3.5 text-xs font-bold transition-colors",
            tab === "past"
              ? "border-primary bg-primary text-surface"
              : "border-line bg-[#f6f8fa] text-muted hover:text-ink",
          )}
        >
          Past events
        </button>
      </div>

      {!hasProfile ? (
        <div className="card flex flex-col items-center px-6 py-12 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
          <img src={MASCOT.listening} alt="Pip listens" className="h-32 object-contain" />
          <h2 className="mt-4 text-lg font-bold">Your story starts here.</h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Open any event, tell us your nickname and mark &quot;I&apos;m going&quot; — your plan
            will live on this page.
          </p>
          <Link
            href="/"
            className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border-2 border-b-4 border-primary bg-surface px-5 text-sm font-bold text-primary-deep transition-colors hover:bg-ice"
          >
            Find your first event
          </Link>
        </div>
      ) : going === null ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-64" />
        </div>
      ) : shown.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-12 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
          <img src={MASCOT.firstStep} alt="Pip takes a step" className="h-32 object-contain" />
          <h2 className="mt-4 text-lg font-bold">
            {tab === "past" ? "Your story starts here." : "Nothing on the horizon yet."}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {tab === "past"
              ? "After your first event, your past experiences will live here."
              : "Mark an event as going and it becomes your plan."}
          </p>
          <Link
            href="/"
            className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border-2 border-b-4 border-primary bg-surface px-5 text-sm font-bold text-primary-deep transition-colors hover:bg-ice"
          >
            Find your first event
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {shown.map((g) => (
            <PlanCard key={g.id} row={g} />
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col gap-1.5 rounded-xl bg-[#f6f8fa] p-4 text-xs text-muted">
        <strong className="text-ink">A tiny reminder</strong>
        <span>You don&apos;t have to be ready. Just curious.</span>
      </div>
    </div>
  );
}

function PlanCard({ row: g }: { row: GoingRow }) {
  const e = g.events;
  const start = new Date(e.starts_at);
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    setChecked(getChecklist(e.id));
  }, [e.id]);

  function toggle(i: number) {
    const next = checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i];
    setChecked(next);
    setChecklist(e.id, next);
  }

  return (
    <li className="card border-2 border-b-4 p-5">
      <div className="mb-4 flex gap-4">
        <div className="flex min-w-[66px] flex-col items-center rounded-xl bg-[#fff0d9] px-3 py-3 text-[#9b681f]">
          <span className="text-[10px] font-bold tracking-[0.1em]">
            {start.toLocaleDateString("en-GB", { month: "short" }).toUpperCase()}
          </span>
          <strong className="text-3xl leading-tight">{start.getDate()}</strong>
          <small className="text-[10px] font-bold">
            {start.toLocaleDateString("en-GB", { weekday: "short" })}
          </small>
        </div>
        <div className="min-w-0">
          <LevelPill level={e.level} size="sm" />
          <h2 className="mt-2 text-lg font-bold leading-snug tracking-tight">{e.title}</h2>
        </div>
      </div>

      <p className="flex items-center gap-2 text-[13px] text-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
        <img src={ICON.calendar} alt="" className="size-4" />
        {fmtTime(e.starts_at)} · <span className="capitalize">{e.type}</span>
      </p>
      <p className="mt-1 flex items-center gap-2 text-[13px] text-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
        <img src={ICON.pin} alt="" className="size-4" />
        {e.venue ?? e.city} · {e.city}
      </p>

      <div className="flex items-center gap-2 border-t-2 border-line pt-3.5 text-xs font-semibold text-primary-deep">
        <span className="size-1.5 rounded-full bg-primary" />
        {g.buddy_profile_id
          ? "In your plan · buddy paired"
          : g.first_timer
            ? "In your plan · on the buddy list"
            : "In your plan"}
      </div>

      <fieldset className="mt-4 rounded-xl bg-bg p-4">
        <legend className="px-1 text-sm font-bold">A tiny checklist</legend>
        {CHECKLIST_ITEMS.map((item, i) => (
          <label key={item} className="flex min-h-11 items-center gap-2.5 text-[13px]">
            <input
              type="checkbox"
              checked={checked.includes(i)}
              onChange={() => toggle(i)}
              className="size-[18px] accent-[var(--color-primary)]"
            />
            {item}
          </label>
        ))}
      </fieldset>

      <Link
        href={`/events/${e.id}`}
        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-surface shadow-[0_4px_0_var(--color-primary-deep)] transition-colors hover:bg-primary-deep"
      >
        View event details
        {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
        <img src={ICON.arrowRight} alt="" className="size-4 brightness-0 invert" />
      </Link>
      <p className="mt-3 text-center text-xs text-muted">
        Your plan · registration happens on the organizer&apos;s site
      </p>
    </li>
  );
}

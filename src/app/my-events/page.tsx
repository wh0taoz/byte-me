"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getLocalProfile, getMyGoing, markAttended, unGoing } from "@/lib/api";
import type { GoingRow } from "@/lib/api";
import { CHECKLIST_ITEMS, ICON, MASCOT, getChecklist, setChecklist } from "@/lib/kit";
import { fmtTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button, Empty, LevelPill, Skeleton } from "@/components/ui";

export default function MyEventsPage() {
  const [going, setGoing] = useState<GoingRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [nickname, setNickname] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    const p = getLocalProfile();
    setNickname(p?.nickname ?? null);
    if (!p) {
      setHasProfile(false);
      setGoing([]);
      return;
    }
    setError(null);
    void getMyGoing(p.id)
      .then(setGoing)
      .catch((e: Error) => setError(e.message));
  }, [reloadKey]);

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
  const attendedCount = useMemo(
    () => (going ?? []).filter((g) => g.attended).length,
    [going],
  );

  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const shown = tab === "upcoming" ? upcoming : past;

  function refresh() {
    setReloadKey((k) => k + 1);
  }

  return (
    <div>
      <header className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.06em] text-primary-deep">
          A little plan. A big first step.
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          You&apos;re going places<span className="text-primary">.</span>
        </h1>
        {nickname ? (
          <p className="mt-3 text-sm text-muted">Good to see you, {nickname}.</p>
        ) : null}
      </header>

      {/* ---- journey / progress ---- */}
      <div className="mb-6 grid gap-3 rounded-[20px] border-2 border-b-4 border-line-strong bg-ice p-5 sm:grid-cols-[1fr_100px] sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-primary-deep">
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
            <span
              className={cn(
                "size-3.5 rounded-full border-2 border-line",
                hasProfile ? "bg-primary" : "bg-surface",
              )}
              aria-label={hasProfile ? "done" : "todo"}
            />
            <i className="h-0.5 flex-1 bg-line" />
            <span
              className={cn(
                "size-3.5 rounded-full border-[3px] bg-surface",
                upcoming.length > 0
                  ? "border-primary shadow-[0_0_0_3px_#F7B26A]"
                  : "border-line",
              )}
              aria-label="current"
            />
            <i className="h-0.5 flex-1 bg-line" />
            <span
              className="size-3.5 rounded-full border-2 border-line bg-surface"
              aria-label="todo"
            />
          </div>
          <div className="mt-1 flex justify-between text-[8px] font-bold text-primary-deep">
            <span>Get curious</span>
            <span>Show up</span>
            <span>Find your people</span>
          </div>
          {attendedCount > 0 ? (
            <p className="mt-2.5 text-xs font-bold text-primary-deep">
              {attendedCount} {attendedCount === 1 ? "step" : "steps"} taken — every one counts.
            </p>
          ) : null}
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
            "min-h-10 rounded-full border-[1.5px] px-3.5 text-[13px] font-semibold transition-colors",
            tab === "upcoming"
              ? "border-transparent bg-nav-dark text-on-dark"
              : "border-line bg-surface text-muted hover:border-primary-deep hover:text-ink",
          )}
        >
          Upcoming <span className="ml-1 rounded-md bg-surface px-1.5 py-px text-primary-deep">{upcoming.length}</span>
        </button>
        <button
          onClick={() => setTab("past")}
          aria-pressed={tab === "past"}
          className={cn(
            "min-h-10 rounded-full border-[1.5px] px-3.5 text-[13px] font-semibold transition-colors",
            tab === "past"
              ? "border-transparent bg-nav-dark text-on-dark"
              : "border-line bg-surface text-muted hover:border-primary-deep hover:text-ink",
          )}
        >
          Past events
          {past.length > 0 ? (
            <span className="ml-1 rounded-md bg-surface px-1.5 py-px text-primary-deep">{past.length}</span>
          ) : null}
        </button>
      </div>

      {error ? (
        <Empty
          title="Couldn't load your plan"
          hint={error}
          action={<Button onClick={refresh}>Try again</Button>}
        />
      ) : !hasProfile ? (
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
            className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border-2 border-b-4 border-line-strong bg-primary px-5 text-sm font-bold text-on-accent transition-colors hover:bg-primary-deep hover:text-on-dark"
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
            className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border-2 border-b-4 border-line-strong bg-primary px-5 text-sm font-bold text-on-accent transition-colors hover:bg-primary-deep hover:text-on-dark"
          >
            Find your first event
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((g) => (
            <PlanCard key={g.id} row={g} past={tab === "past"} onChanged={refresh} />
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col gap-1.5 rounded-xl bg-bg p-4 text-xs text-muted">
        <strong className="text-ink">A tiny reminder</strong>
        <span>You don&apos;t have to be ready. Just curious.</span>
      </div>
    </div>
  );
}

function PlanCard({ row: g, past, onChanged }: { row: GoingRow; past: boolean; onChanged: () => void }) {
  const e = g.events;
  const start = new Date(e.starts_at);
  const [checked, setChecked] = useState<number[]>([]);
  const [attended, setAttended] = useState(g.attended ?? false);
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    setChecked(getChecklist(e.id));
  }, [e.id]);

  function toggle(i: number) {
    const next = checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i];
    setChecked(next);
    setChecklist(e.id, next);
  }

  function toast(msg: string) {
    window.dispatchEvent(new CustomEvent("stepin:toast", { detail: msg }));
  }

  async function onAttended() {
    if (busy || attended) return;
    setBusy(true);
    try {
      await markAttended(g.id);
      setAttended(true);
      toast("Step counted! 🐾");
      onChanged();
    } catch (err) {
      toast((err as Error).message || "Couldn't save that right now — please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    if (removing) return;
    setRemoving(true);
    try {
      const pid = getLocalProfile()?.id;
      if (!pid) throw new Error();
      await unGoing(e.id, pid);
      toast("Removed from your plan.");
      onChanged();
    } catch {
      toast("Couldn't remove that right now — try again in a moment.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <li className="card border-2 border-b-4 p-5">
      <div className="mb-4 flex gap-4">
        <div className="flex min-w-[66px] flex-col items-center rounded-xl bg-soft px-3 py-3 text-primary-deep">
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

      {past ? (
        attended ? (
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-ice px-3 py-2.5 text-xs font-bold text-ink">
            {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
            <img src={ICON.sprout} alt="" className="size-4" />
            You were there — step counted 🐾
          </p>
        ) : (
          <Button variant="secondary" className="mt-3 w-full" disabled={busy} onClick={() => void onAttended()}>
            {busy ? "Counting…" : "I was there"}
          </Button>
        )
      ) : null}

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
        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-b-4 border-line-strong bg-primary px-4 py-2 text-sm font-bold text-on-accent transition-colors hover:bg-primary-deep hover:text-on-dark"
      >
        View event details
        {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
        <img src={ICON.arrowRight} alt="" className="size-4 brightness-0" />
      </Link>
      <button
        onClick={() => void onRemove()}
        disabled={removing}
        className="mt-3 w-full text-center text-xs font-semibold text-muted underline decoration-dotted underline-offset-2 transition-colors hover:text-ink disabled:opacity-50"
      >
        {removing ? "Removing…" : "Can't make it? Remove from my plan"}
      </button>
    </li>
  );
}

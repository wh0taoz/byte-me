"use client";

import Link from "next/link";
import type { EventRow } from "@/lib/types";
import { ICON, levelArt } from "@/lib/kit";
import { fmtTime, smartRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LevelPill } from "./ui";

/** Card art header background: one shared warm ramp — the gradient matches
 *  the difficulty (beginner lightest → expert darkest), never the position. */
const LEVEL_BG: Record<EventRow["level"], string> = {
  beginner: "level-art-beginner",
  intermediate: "level-art-intermediate",
  expert: "level-art-expert",
};

export function EventCard({
  event: e,
  saved,
  onToggleSave,
  past = false,
}: {
  event: EventRow;
  saved: boolean;
  onToggleSave: (id: string) => void;
  past?: boolean;
}) {
  return (
    <li
      className={cn(
        "card flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5",
        past && "opacity-75 saturate-[0.6]",
      )}
    >
      {/* ---- art half: level gradient + Pip level art ---- */}
      <div className={cn("relative h-[150px] shrink-0", LEVEL_BG[e.level])}>
        <LevelPill level={e.level} bare className="absolute left-4 top-4" />
        {/* eslint-disable-next-line @next/next/no-img-element -- kit level art */}
        <img
          src={levelArt(e.level)}
          alt=""
          aria-hidden
          className="absolute right-6 top-3 size-[136px] object-contain"
        />
      </div>

      {/* ---- body: the basics ---- */}
      <div className="flex flex-1 flex-col gap-2.5 px-5 pb-5 pt-[18px]">
        <Link
          href={`/events/${e.id}`}
          className="text-lg font-semibold leading-6 tracking-tight hover:underline"
        >
          {e.title}
        </Link>

        <p className="flex items-center gap-2 text-[13px] text-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img src={ICON.calendar} alt="" className="size-4 shrink-0" />
          {smartRange(e.starts_at, e.ends_at)} · {fmtTime(e.starts_at)}
        </p>
        <p className="flex items-center gap-2 text-[13px] text-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img src={ICON.pin} alt="" className="size-4 shrink-0" />
          {e.venue ?? e.city} · {e.city}
        </p>
        {e.first_timer_count ? (
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-primary-deep">
            <span aria-hidden>🐾</span>
            {e.first_timer_count} newcomer{e.first_timer_count === 1 ? "" : "s"} going
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-2">
          {past ? (
            <span className="rounded-full bg-bg px-3 py-1.5 text-xs font-semibold text-muted">
              Finished
            </span>
          ) : (
            <span className="rounded-full border-[1.5px] border-line bg-surface px-3 py-1.5 text-xs font-semibold capitalize text-ink">
              {e.type}
            </span>
          )}
          <span className="flex-1" />
          <SaveButton saved={saved} title={e.title} onToggle={() => onToggleSave(e.id)} />
          <Link
            href={`/events/${e.id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-b-4 border-line-strong bg-primary px-4 text-xs font-bold uppercase tracking-[0.04em] text-on-accent transition-colors hover:bg-primary-deep hover:text-on-dark"
          >
            More details
          </Link>
        </div>
      </div>
    </li>
  );
}

export function SaveButton({
  saved,
  title,
  onToggle,
}: {
  saved: boolean;
  title: string;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={(saved ? "Unsave " : "Save ") + title}
      title={saved ? "Unsave" : "Save"}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl border-[1.5px] transition-colors",
        saved ? "border-primary-deep bg-soft" : "border-line bg-surface hover:border-primary-deep",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
      <img src={saved ? ICON.bookmarkFilled : ICON.bookmark} alt="" className="size-4.5" />
    </button>
  );
}

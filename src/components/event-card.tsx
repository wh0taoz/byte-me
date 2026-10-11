"use client";

import Link from "next/link";
import type { EventRow, EventType } from "@/lib/types";
import { ICON, levelArt } from "@/lib/kit";
import { fmtTime, smartRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LevelPill } from "./ui";

/** Bright flat illustration panels per event type (kit art direction). */
const ART: Record<EventType, { bg: string; fg: string; symbol: string; label: string }> = {
  workshop: { bg: "#e2eef5", fg: "#25496b", symbol: "</>", label: "START SMALL. BUILD SOMETHING." },
  meetup: { bg: "#fff0d9", fg: "#92674c", symbol: "hello.", label: "GOOD PEOPLE. NEW IDEAS." },
  hackathon: { bg: "#e5ecce", fg: "#4f6a39", symbol: "{ }", label: "ONE LINE AT A TIME." },
  seminar: { bg: "#e2eef5", fg: "#25496b", symbol: "#", label: "GO DEEP. ASK ANYTHING." },
  conference: { bg: "#e5ecce", fg: "#4f6a39", symbol: "★", label: "MANY ROOMS. MANY STEPS." },
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
  const art = ART[e.type];
  return (
    <li
      className={cn(
        "card flex flex-col overflow-hidden border-2 border-b-4 shadow-winter transition-transform hover:-translate-y-0.5 sm:flex-row",
        past && "opacity-75 saturate-[0.6]",
      )}
    >
      {/* ---- half the card: the Pip level art IS the level ---- */}
      <div
        className="relative flex min-h-[8.5rem] items-center justify-center p-6 sm:w-1/2"
        style={{ background: "linear-gradient(150deg, #f2fbf6 0%, #e5f5ee 55%, #d2efe1 100%)" }}
      >
        <div className="flex flex-col items-center gap-3" aria-hidden="true">
          <span
            className="flex h-12 w-full items-center justify-between self-stretch rounded-xl px-3 text-[34px] font-extrabold tracking-tighter"
            style={{ background: art.bg, color: art.fg }}
          >
            {art.symbol}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element -- kit level art */}
          <img src={levelArt(e.level)} alt="" className="h-24 object-contain" />
        </div>
        <LevelPill level={e.level} className="absolute bottom-3 left-3" />
      </div>

      {/* ---- half the card: the basics ---- */}
      <div className="flex flex-1 flex-col p-4 sm:w-1/2 sm:p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          {past ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f6f8fa] px-2 py-1 text-[11px] font-bold text-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
              <img src={ICON.calendar} alt="" className="size-4" />
              Finished
            </span>
          ) : e.level === "beginner" ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8f4d9] px-2 py-1 text-[11px] font-bold text-[#4c711f]">
              {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
              <img src={ICON.sprout} alt="" className="size-4" />
              Beginner friendly
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f6f8fa] px-2 py-1 text-[11px] font-bold capitalize text-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
              <img src={ICON.people} alt="" className="size-4" />
              {e.level}
            </span>
          )}
          <SaveButton saved={saved} title={e.title} onToggle={() => onToggleSave(e.id)} />
        </div>

        <Link
          href={`/events/${e.id}`}
          className="text-lg font-bold leading-snug tracking-tight hover:underline"
        >
          {e.title}
        </Link>

        <p className="mt-2 flex items-center gap-2 text-[13px] text-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img src={ICON.calendar} alt="" className="size-4" />
          <span className="capitalize">{e.type}</span> · {smartRange(e.starts_at, e.ends_at)} ·{" "}
          {fmtTime(e.starts_at)}
        </p>
        <p className="mb-3 mt-1 flex items-center gap-2 text-[13px] text-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img src={ICON.pin} alt="" className="size-4" />
          {e.venue ?? e.city} · {e.city}
        </p>

        {e.what_to_expect?.[0] ? (
          <div className="mb-3 rounded-xl bg-[#f6f8fa] p-3">
            <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              What to expect
            </span>
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed">{e.what_to_expect[0]}</p>
          </div>
        ) : null}

        {e.level === "beginner" ? (
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary-deep">
            {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
            <img src={ICON.people} alt="" className="size-4" />
            Come solo — you&apos;ll fit right in.
          </p>
        ) : null}

        <Link
          href={`/events/${e.id}`}
          className="mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-b-4 border-primary bg-surface px-4 py-2 text-sm font-bold text-primary-deep transition-colors hover:bg-ice"
        >
          Explore event
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img src={ICON.arrowRight} alt="" className="size-4" />
        </Link>
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
        "flex size-11 items-center justify-center rounded-xl transition-colors",
        saved ? "bg-ice" : "hover:bg-ice",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
      <img
        src={ICON.bookmark}
        alt=""
        className="size-5"
        style={saved ? { filter: "none" } : { opacity: 0.55 }}
      />
    </button>
  );
}

"use client";

import { ArrowRight, CalendarDays, GraduationCap, MapPin, Presentation, Search, Users, Wrench, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ALL_LEVELS, ALL_TYPES, getEvents, levelExplanation, levelLabel } from "@/lib/api";
import type { EventRow, EventType, Level } from "@/lib/types";
import { smartRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Stoat } from "@/components/stoat";
import { Motto } from "@/components/motto";
import { Empty, LevelPill, Skeleton } from "@/components/ui";

const TYPE_ICONS: Record<EventType, typeof Zap> = {
  hackathon: Zap,
  meetup: Users,
  seminar: GraduationCap,
  workshop: Wrench,
  conference: Presentation,
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<Level | "all">("all");
  const [type, setType] = useState<string>("all");
  const [city, setCity] = useState("all");

  useEffect(() => {
    void getEvents()
      .then(setEvents)
      .catch((e: Error) => setError(e.message));
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

  return (
    <div>
      {/* ---- the winter gradient: light melts into dark, full viewport ---- */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(1100px 550px at 85% 100%, rgba(53, 101, 122, 0.55), transparent 60%),
            radial-gradient(900px 480px at 8% 0%, rgba(255, 255, 255, 0.85), transparent 55%),
            linear-gradient(180deg, #f4f9fc 0%, #d6ebf3 26%, #a9cadd 58%, #447f98 100%)
          `,
        }}
      />

      {/* ---- hero: the motto IS the headline ---- */}
      <section className="mb-8">
        <Motto />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/80 md:text-base">
          Not sure if an event is &quot;for you&quot;? Every event here has a difficulty level and a
          plain-language &quot;what to expect&quot;. First time ever? Even better — that&apos;s the
          normal state around here.
        </p>
        <div className="mt-5 grid max-w-2xl gap-2.5 sm:grid-cols-3">
          {ALL_LEVELS.map((lv, i) => (
            <div key={lv} className="flex items-start gap-2.5">
              <Stoat level={lv} className="size-10 shrink-0" hop={i === 0} />
              <span>
                <span className="block text-xs font-semibold">{levelLabel(lv)}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink/70">
                  {levelExplanation(lv).split("—")[0]}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- filters ---- */}
      <section className="card mb-6 flex flex-col gap-3 p-3 shadow-winter md:flex-row md:items-center" aria-label="Filters">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search: hackathon, Python, Belgrade…"
            className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Level">
          <FilterTab active={level === "all"} onClick={() => setLevel("all")}>
            All levels
          </FilterTab>
          {ALL_LEVELS.map((lv) => (
            <FilterTab key={lv} active={level === lv} onClick={() => setLevel(lv)}>
              {levelLabel(lv)}
            </FilterTab>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Type">
          <FilterTab active={type === "all"} onClick={() => setType("all")}>
            All types
          </FilterTab>
          {ALL_TYPES.map((t) => (
            <FilterTab key={t} active={type === t} onClick={() => setType(t)}>
              {t}
            </FilterTab>
          ))}
        </div>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-line bg-surface px-2.5 py-2 text-sm text-ink focus:border-primary focus:outline-none"
          aria-label="City"
        >
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </section>

      {/* ---- list: two cards per row on desktop, one on mobile ---- */}
      {error ? (
        <Empty title="Couldn't load events" hint={error} />
      ) : !events ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Empty
          title="Nothing matches these filters"
          hint="Try dropping the level or city — new events land every week."
        />
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterTab({
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
        "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
        active
          ? "border-primary bg-primary text-surface"
          : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function EventCard({ event: e }: { event: EventRow }) {
  const TypeIcon = TYPE_ICONS[e.type];
  return (
    <li className="card flex flex-col overflow-hidden shadow-winter transition-transform hover:-translate-y-0.5 sm:flex-row">
      {/* ---- half the card: the stoat IS the level ---- */}
      <div
        className="relative flex min-h-[8.5rem] items-center justify-center p-6 sm:w-1/2"
        style={{
          background:
            "linear-gradient(145deg, #eaf5fa 0%, #d6ebf3 45%, #b7d6e4 100%)",
        }}
      >
        <span
          className="flex size-28 items-center justify-center rounded-full md:size-32"
          style={{ background: "radial-gradient(circle, rgba(98,155,181,0.30) 0%, rgba(98,155,181,0.10) 62%, transparent 72%)" }}
        >
          <Stoat level={e.level} className="size-20 md:size-24" />
        </span>
        <LevelPill level={e.level} className="absolute bottom-3 left-3" />
      </div>

      {/* ---- half the card: just the basics ---- */}
      <div className="flex flex-1 flex-col p-4 sm:w-1/2 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CalendarDays className="size-3.5" aria-hidden />
            {smartRange(e.starts_at, e.ends_at)}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <MapPin className="size-3.5" aria-hidden />
            {e.city}
          </span>
        </div>

        <Link
          href={`/events/${e.id}`}
          className="mt-2 text-lg font-semibold leading-snug tracking-tight hover:underline"
        >
          {e.title}
        </Link>

        <p className="mb-4 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <span className="font-medium text-ink">{e.organizer}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1 capitalize">
            <TypeIcon className="size-3.5" aria-hidden /> {e.type}
          </span>
        </p>

        <div className="mt-auto border-t border-line pt-3">
          <Link
            href={`/events/${e.id}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-surface transition-colors hover:bg-primary-deep"
          >
            More details <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </li>
  );
}

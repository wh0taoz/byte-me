"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, CalendarDays, Check, ExternalLink, Footprints, Info, Pencil, Star, X } from "lucide-react";
import {
  ALL_LEVELS,
  clearLocalProfile,
  getGithubProfile,
  getLocalProfile,
  getMyGoing,
  levelLabel,
  setLocalProfile,
} from "@/lib/api";
import type { GithubProfile, LocalProfile, GoingRow } from "@/lib/api";
import type { Level } from "@/lib/types";
import { getSavedIds } from "@/lib/kit";
import { cn } from "@/lib/utils";
import { LevelPill, Toggle } from "@/components/ui";

const NOTIF_PREF_KEY = "stepin:notif-prefs";

// Demo wiring: the profile page shows this GitHub account via our
// /api/github/[username] integration. Change the username here to demo
// someone else.
const GITHUB_USERNAME = "wh0taoz";
const NOTIF_PREFS = [
  { key: "new_events", label: "New events near me", hint: "When a beginner-friendly event lands in your city." },
  { key: "buddies", label: "Buddy matches", hint: "When another first-timer gets paired with you." },
  { key: "reminders", label: "Event reminders", hint: "A nudge the day before something you're going to." },
  { key: "weekly", label: "Weekly nudge", hint: "One small push to take the next step. Just one." },
] as const;

export default function ProfilePage() {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [going, setGoing] = useState<GoingRow[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [nick, setNick] = useState("");
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState(0);
  const [github, setGithub] = useState<GithubProfile | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const p = getLocalProfile();
    setProfile(p);
    setNick(p?.nickname ?? "");
    setSavedCount(getSavedIds().length);
    try {
      setPrefs(JSON.parse(window.localStorage.getItem(NOTIF_PREF_KEY) ?? "{}"));
    } catch {
      setPrefs({});
    }
    if (p) {
      void getMyGoing(p.id)
        .then(setGoing)
        .catch(() => setGoing([])); // stats just show 0 if the check fails
    }
    setReady(true);
    // GitHub enrichment is best-effort: if it fails the page still works.
    void getGithubProfile(GITHUB_USERNAME)
      .then(setGithub)
      .catch(() => setGithub(null));
  }, []);

  const stats = useMemo(() => {
    const attended = going.filter((g) => g.attended).length;
    const upcoming =
      now === 0 ? 0 : going.filter((g) => +new Date(g.events.starts_at) >= now).length;
    const cities = new Set(going.filter((g) => g.attended).map((g) => g.events.city)).size;
    const buddies = going.filter((g) => g.buddy_profile_id).length;
    return { steps: attended, upcoming, saved: savedCount, cities, buddies, planned: going.length };
  }, [going, savedCount, now]);

  function saveNickname() {
    const name = nick.trim();
    if (!profile || !name) {
      setEditing(false);
      setNick(profile?.nickname ?? "");
      return;
    }
    setLocalProfile({ ...profile, nickname: name });
    setProfile({ ...profile, nickname: name });
    setEditing(false);
    window.dispatchEvent(new CustomEvent("stepin:toast", { detail: "Nickname updated." }));
  }

  function patchProfile(patch: Partial<LocalProfile>) {
    setProfile((p) => {
      if (p) setLocalProfile({ ...p, ...patch });
      return p ? { ...p, ...patch } : p;
    });
  }

  function setPref(key: string, value: boolean) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      window.localStorage.setItem(NOTIF_PREF_KEY, JSON.stringify(next));
      return next;
    });
  }

  function resetProfile() {
    // wipe everything demo-scoped on this device, then start fresh
    clearLocalProfile();
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("stepin:"))
      .forEach((k) => window.localStorage.removeItem(k));
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-7">
      {/* ---- header card ---- */}
      <section className="card brand-gradient flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-b-4 border-line-strong bg-soft text-5xl font-extrabold text-primary-deep">
          {github ? (
            // eslint-disable-next-line @next/next/no-img-element -- GitHub avatar
            <img
              src={github.avatar_url}
              alt={`${github.username} on GitHub`}
              className="size-full object-cover"
            />
          ) : (
            (profile?.nickname?.trim()?.[0]?.toUpperCase() ?? "S")
          )}
        </span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex max-w-sm items-center gap-2">
              <label className="sr-only" htmlFor="nickname">
                Your nickname
              </label>
              <input
                id="nickname"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                maxLength={30}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveNickname();
                  if (e.key === "Escape") {
                    setNick(profile?.nickname ?? "");
                    setEditing(false);
                  }
                }}
                className="min-w-0 flex-1 rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2 text-2xl font-bold text-ink focus:border-primary-deep focus:outline-none"
              />
              <button
                onClick={saveNickname}
                aria-label="Save nickname"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-b-4 border-line-strong bg-primary text-on-accent"
              >
                <Check className="size-4" aria-hidden />
              </button>
              <button
                onClick={() => {
                  setNick(profile?.nickname ?? "");
                  setEditing(false);
                }}
                aria-label="Cancel editing"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-line bg-surface text-muted"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          ) : (
            <h1 className="text-2xl font-bold tracking-tight md:text-[32px] md:leading-10">
              {ready ? (profile?.nickname ?? "New around here") : "…"}
            </h1>
          )}
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <LevelPill level={(profile?.level ?? "beginner") as Level} />
            <span className="text-[15px] text-muted">
              {profile?.first_timer === false
                ? "Returning explorer — been there, done that"
                : "First time at a tech event"}
            </span>
          </div>
        </div>
        {profile ? (
          <button
            onClick={() => setEditing(true)}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border-2 border-b-4 border-line-strong bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:bg-ice"
          >
            <Pencil className="size-4" aria-hidden /> Edit nickname
          </button>
        ) : (
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center rounded-xl border-2 border-b-4 border-line-strong bg-primary px-5 text-sm font-semibold text-on-accent transition-colors hover:bg-primary-deep hover:text-on-dark"
          >
            Start your journey
          </Link>
        )}
      </section>

      {/* ---- GitHub card (demo integration, username hardcoded) ---- */}
      {github ? (
        <section className="card p-6" aria-label="GitHub profile">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                GitHub
                <a
                  href={`https://github.com/${github.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-normal text-primary-deep hover:underline"
                >
                  @{github.username} <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </h2>
              {github.bio ? <p className="mt-1 text-[13px] text-muted">{github.bio}</p> : null}
            </div>
            <div className="flex gap-5 text-sm">
              <GitHubStat value={github.public_repos} label="repos" />
              <GitHubStat value={github.followers} label="followers" />
              <GitHubStat value={github.following} label="following" />
            </div>
          </div>

          {github.top_languages.length ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.06em] text-muted">
                Top languages
              </span>
              {github.top_languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full border-[1.5px] border-line bg-surface px-3 py-1 text-xs font-semibold text-ink"
                >
                  {lang}
                </span>
              ))}
            </div>
          ) : null}

          {github.recent_repos.length ? (
            <ul className="mt-4 flex flex-col">
              {github.recent_repos.map((repo, i) => (
                <li
                  key={repo.name}
                  className={cn("py-2.5", i > 0 && "border-t-[1.5px] border-line")}
                >
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-primary-deep hover:underline"
                  >
                    {repo.name}
                    {repo.language ? (
                      <span className="font-normal text-muted">· {repo.language}</span>
                    ) : null}
                  </a>
                  {repo.description ? (
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                      {repo.description}
                    </p>
                  ) : null}
                  {repo.stars > 0 ? (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                      <Star className="size-3" aria-hidden /> {repo.stars}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* ---- stats ---- */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3" aria-label="Your stats">
        <StatCard
          icon={<Footprints className="size-5" aria-hidden />}
          label="Steps taken"
          value={ready ? stats.steps : null}
          hint={stats.steps === 0 ? "Every one starts at zero." : "Every one counts."}
        />
        <StatCard
          icon={<CalendarDays className="size-5" aria-hidden />}
          label="Upcoming events"
          value={ready ? stats.upcoming : null}
          hint={stats.upcoming === 0 ? "Nothing planned yet." : "On the horizon."}
        />
        <StatCard
          icon={<Bookmark className="size-5" aria-hidden />}
          label="Saved events"
          value={ready ? stats.saved : null}
          hint={stats.saved === 0 ? "No maybe-somes yet." : "Possibilities waiting."}
        />
      </section>

      {/* ---- achievements ---- */}
      <section aria-label="Achievements">
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">Achievements</h2>
          <p className="mt-0.5 text-sm text-muted">
            Small wins on the way — they unlock as you show up.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Achievement
            emoji="🐾"
            name="First step"
            desc="Attend your first event."
            unlocked={stats.steps >= 1}
            progress={ready ? `${stats.steps}/1 attended` : null}
          />
          <Achievement
            emoji="🗓️"
            name="Making it real"
            desc="Mark an event as going."
            unlocked={stats.planned >= 1}
            progress={ready ? `${Math.min(stats.planned, 1)}/1 planned` : null}
          />
          <Achievement
            emoji="📌"
            name="Wish list"
            desc="Save 3 events for someday."
            unlocked={stats.saved >= 3}
            progress={ready ? `${Math.min(stats.saved, 3)}/3 saved` : null}
          />
          <Achievement
            emoji="🤝"
            name="Better together"
            desc="Get paired with a buddy."
            unlocked={stats.buddies >= 1}
            progress={ready ? (stats.buddies >= 1 ? "Paired!" : "No buddy yet") : null}
          />
          <Achievement
            emoji="🧭"
            name="Explorer"
            desc="Attend events in 2 different cities."
            unlocked={stats.cities >= 2}
            progress={ready ? `${stats.cities}/2 cities` : null}
          />
          <Achievement
            emoji="🚀"
            name="Five and counting"
            desc="Take 5 steps in total."
            unlocked={stats.steps >= 5}
            progress={ready ? `${Math.min(stats.steps, 5)}/5 steps` : null}
          />
        </div>
      </section>

      {/* ---- about you ---- */}
      <section className="card p-6" aria-label="About you">
        <h2 className="text-lg font-semibold">About you</h2>

        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.06em] text-muted">
            Your comfort level
          </p>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Level">
            {ALL_LEVELS.map((lv) => {
              const active = (profile?.level ?? "beginner") === lv;
              return (
                <button
                  key={lv}
                  onClick={() => patchProfile({ level: lv })}
                  aria-pressed={active}
                  className={cn(
                    "min-h-11 rounded-full border-[1.5px] text-sm font-semibold transition-colors",
                    active
                      ? "border-transparent bg-nav-dark text-on-dark"
                      : "border-line bg-surface text-muted hover:border-primary-deep hover:text-ink",
                  )}
                >
                  {levelLabel(lv)}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[13px] text-muted">
            Used to tune how Pip explains things — you can always change it.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t-[1.5px] border-line pt-5">
          <div>
            <p className="text-sm font-semibold">First-timer mode</p>
            <p className="mt-0.5 text-[13px] text-muted">
              Pair me with another first-timer when I go to an event.
            </p>
          </div>
          <Toggle
            label="First-timer mode"
            checked={profile?.first_timer !== false}
            onChange={(v) => patchProfile({ first_timer: v })}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t-[1.5px] border-line pt-5 sm:flex-row sm:items-center">
          <p className="flex items-start gap-2 text-[13px] text-muted">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              Saved on this device — your demo profile lives in this browser. No account, no
              server, no pressure.
            </span>
          </p>
          <button
            onClick={resetProfile}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-primary-deep transition-colors hover:bg-ice sm:ml-auto"
          >
            Reset demo profile
          </button>
        </div>
      </section>

      {/* ---- notification settings (demo) ---- */}
      <section className="card p-6" aria-label="Notification settings">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <p className="mt-1 text-[13px] text-muted">
          Preferences are saved on this device — delivery isn&apos;t wired up for the demo yet.
        </p>
        <div className="mt-4 flex flex-col">
          {NOTIF_PREFS.map((p, i) => (
            <div
              key={p.key}
              className={cn(
                "flex items-center justify-between gap-4 py-4",
                i > 0 && "border-t-[1.5px] border-line",
              )}
            >
              <div>
                <p className="text-sm font-semibold">{p.label}</p>
                <p className="mt-0.5 text-[13px] text-muted">{p.hint}</p>
              </div>
              <Toggle
                label={p.label}
                checked={prefs[p.key] !== false}
                onChange={(v) => setPref(p.key, v)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function GitHubStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-extrabold leading-tight">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  hint: string;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-soft text-primary-deep">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.06em] text-muted">{label}</p>
        <p className="text-[32px] font-extrabold leading-tight tracking-tight">
          {value === null ? "…" : String(value).padStart(2, "0")}
        </p>
        <p className="text-[13px] text-muted">{hint}</p>
      </div>
    </div>
  );
}

function Achievement({
  emoji,
  name,
  desc,
  unlocked,
  progress,
}: {
  emoji: string;
  name: string;
  desc: string;
  unlocked: boolean;
  progress: string | null;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-[20px] border-2 border-b-4 border-line-strong p-5",
        unlocked ? "border-primary-deep bg-soft" : "bg-bg",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl",
          unlocked ? "bg-surface" : "bg-surface opacity-40 grayscale",
        )}
      >
        {emoji}
      </span>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold">
          {name}
          {unlocked ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-on-accent">
              Unlocked
            </span>
          ) : null}
        </p>
        <p className="mt-0.5 text-[13px] text-muted">{desc}</p>
        <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.06em] text-primary-deep">
          {unlocked ? "Nice work!" : (progress ?? "—")}
        </p>
      </div>
    </div>
  );
}

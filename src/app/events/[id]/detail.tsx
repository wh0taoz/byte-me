"use client";

import { ArrowLeft, CalendarDays, Check, ExternalLink, MapPin, Sparkles, Ticket, Wand2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ALL_LEVELS,
  clearLocalProfile,
  createProfile,
  downloadIcs,
  getEvent,
  getLocalProfile,
  getMyGoing,
  levelExplanation,
  levelLabel,
  markGoing,
  setLocalProfile,
  simplifyText,
  unGoing,
} from "@/lib/api";
import type { LocalProfile } from "@/lib/api";
import type { EventRow, GoingResult, Level } from "@/lib/types";
import { fmtTime, smartRange } from "@/lib/format";
import { levelArt } from "@/lib/kit";
import { Button, Chip, Empty, LevelPill, Skeleton, inputClass, labelClass } from "@/components/ui";

function toast(msg: string) {
  window.dispatchEvent(new CustomEvent("stepin:toast", { detail: msg }));
}

export function EventDetailView() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [icsBusy, setIcsBusy] = useState(false);

  useEffect(() => {
    let live = true;
    void getEvent(id)
      .then((ev) => {
        if (live) {
          setEvent(ev);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (live) setError(e.message);
      });
    return () => {
      live = false;
    };
  }, [id, reloadKey]);

  if (error) {
    return (
      <Empty
        title="Couldn't load this event"
        hint={error}
        action={<Button onClick={() => setReloadKey((k) => k + 1)}>Try again</Button>}
      />
    );
  }
  if (!event) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const e = event;
  const ai = e.ai_summary;
  const oneDay =
    e.ends_at && new Date(e.starts_at).toDateString() === new Date(e.ends_at).toDateString();

  async function onAddToCalendar() {
    if (icsBusy) return;
    setIcsBusy(true);
    try {
      await downloadIcs(e.id, e.title);
    } catch {
      toast("Couldn't add to calendar — try again in a moment.");
    } finally {
      setIcsBusy(false);
    }
  }

  return (
    <div>
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden /> All events
      </Link>

      {/* ---- upper half: all the basic info + registration ---- */}
      <section className="card p-5 md:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Chip className="capitalize">{e.type}</Chip>
          <LevelPill level={e.level} />
          <Chip>
            <MapPin className="size-3" aria-hidden /> {e.city}
          </Chip>
          <Chip>
            <CalendarDays className="size-3" aria-hidden />
            {smartRange(e.starts_at, e.ends_at)}
            {oneDay ? ` · ${fmtTime(e.starts_at)}` : ""}
          </Chip>
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{e.title}</h1>
        <p className="mt-2 text-sm text-muted">
          <span className="font-medium text-ink">{e.organizer}</span>
          {e.venue ? ` · ${e.venue}` : ""}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">{levelExplanation(e.level)}</p>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          {e.registration_url ? (
            <a
              href={e.registration_url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-b-4 border-line-strong bg-primary px-4 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-primary-deep hover:text-on-dark"
            >
              Register / RSVP on the organizer&apos;s site
              <ExternalLink className="size-4" aria-hidden />
            </a>
          ) : (
            <p className="flex-1 text-sm text-muted">Registration info coming soon.</p>
          )}
          <Button variant="secondary" disabled={icsBusy} onClick={() => void onAddToCalendar()}>
            <CalendarDays className="size-4" aria-hidden />
            {icsBusy ? "Adding…" : "Add to my calendar"}
          </Button>
        </div>
      </section>

      {/* ---- Pip says the AI summary ---- */}
      <section className="mt-6 flex items-start gap-2.5 md:gap-4" aria-label="AI summary">
        {/* eslint-disable-next-line @next/next/no-img-element -- official kit level art */}
        <img
          src={levelArt(e.level)}
          alt={`Pip the stoat, ${e.level} level art`}
          className="mt-1 h-20 w-20 shrink-0 object-contain md:h-24 md:w-24"
        />
        <div className="card relative flex-1 p-4 md:p-5">
          {/* speech bubble tail pointing at Pip */}
          <span
            aria-hidden
            className="absolute -left-[7px] top-6 size-3.5 rotate-45 border-b border-l border-line bg-surface"
          />
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
            <Sparkles className="size-3.5 text-accent" aria-hidden />
            Pip&apos;s AI summary <span className="font-normal">— may contain mistakes</span>
          </p>

          <div className="text-sm leading-relaxed">
            {ai?.what_to_expect ? (
              <p>{ai.what_to_expect}</p>
            ) : (
              <p className="text-muted">
                I&apos;m still writing my summary for this one — everything you need to decide is in
                &quot;What to expect&quot; just below. Or ask me anything with the button in the
                corner! 🐾
              </p>
            )}

            {ai?.is_this_for_me ? (
              <p className="mt-2">
                <span className="font-semibold">Is this for me? </span>
                {ai.is_this_for_me}
              </p>
            ) : null}

            {ai?.prior_knowledge?.length ? (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  Prior knowledge that helps
                </p>
                <ul className="flex flex-col gap-1.5">
                  {ai.prior_knowledge.map((p) => (
                    <li key={p} className="flex gap-2 text-sm leading-relaxed">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ) : ai?.what_to_expect ? (
              <p className="mt-2 text-sm text-muted">No prior knowledge needed — come as you are.</p>
            ) : null}

            {ai?.key_terms?.length ? (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  Key terms, explained kindly
                </p>
                <dl className="flex flex-col gap-1.5">
                  {ai.key_terms.map((t) => (
                    <div key={t.term} className="text-sm">
                      <dt className="inline font-semibold">{t.term}: </dt>
                      <dd className="inline text-muted">{t.explanation}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {ai?.bring?.length ? (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  Bring with you
                </p>
                <ul className="flex flex-col gap-1.5">
                  {ai.bring.map((b) => (
                    <li key={b} className="flex gap-2 text-sm leading-relaxed">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ---- details + going ---- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <DescriptionBlock event={e} />
          {e.what_to_expect?.length ? (
            <ul className="mt-4 flex flex-col gap-2">
              {e.what_to_expect.map((x) => (
                <li key={x} className="flex gap-2.5 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <aside>
          <GoingCard eventId={e.id} />
        </aside>
      </div>
    </div>
  );
}

/** The organizer's description + "Say it simply" (Gemma rewrites it in
 *  plain language; toggle back to the original any time). */
function DescriptionBlock({ event: e }: { event: EventRow }) {
  const [simple, setSimple] = useState<string | null>(null);
  const [showSimple, setShowSimple] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSimplify() {
    if (busy) return;
    if (simple !== null) {
      setShowSimple((s) => !s);
      return;
    }
    setBusy(true);
    try {
      const out = await simplifyText(e.description, getLocalProfile()?.level ?? "beginner");
      if (out.fallback) {
        toast("Pip couldn't simplify it right now — the original stays.");
      } else if (out.text.trim()) {
        setSimple(out.text);
        setShowSimple(true);
      }
    } catch {
      toast("Pip couldn't simplify it right now — the original stays.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">What to expect</h2>
        <Button variant="ghost" size="sm" disabled={busy} onClick={() => void onSimplify()}>
          <Wand2 className="size-3.5" aria-hidden />
          {busy ? "Pip is simplifying…" : simple !== null && showSimple ? "Show original" : "Say it simply"}
        </Button>
      </div>
      <p className="text-sm leading-relaxed" aria-live="polite">
        {showSimple && simple !== null ? simple : e.description}
      </p>
    </>
  );
}

function GoingCard({ eventId }: { eventId: string }) {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [ready, setReady] = useState(false); // "already going?" check finished
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState<Level>("beginner");
  const [firstTimer, setFirstTimer] = useState(true);
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GoingResult | null>(null);

  // Already going from an earlier visit? Show the result state, not the form —
  // otherwise a reload would offer "I'm going" again (and POST again).
  useEffect(() => {
    const p = getLocalProfile();
    setProfile(p);
    if (!p) {
      setReady(true);
      return;
    }
    void getMyGoing(p.id)
      .then((rows) => {
        const row = rows.find((r) => r.events.id === eventId);
        if (row) {
          setFirstTimer(row.first_timer ?? false);
          setResult({
            going: { id: row.id },
            buddy: row.buddy_nickname ? { nickname: row.buddy_nickname } : null,
          });
        }
      })
      .catch(() => undefined) // if this check fails the form still works; POST dedupes
      .finally(() => setReady(true));
  }, [eventId]);

  async function onGoing() {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      let pid = profile;
      if (!pid) {
        const name = nickname.trim();
        if (!name) {
          setError("Tell us your nickname first — that's how your buddy finds you.");
          setBusy(false);
          return;
        }
        const created = await createProfile({ nickname: name, level, first_timer: firstTimer });
        pid = { id: created.id, nickname: created.nickname, level: created.level ?? level, first_timer: created.first_timer ?? firstTimer };
        setProfile(pid);
        setLocalProfile(pid);
      }
      setResult(await markGoing({ event_id: eventId, profile_id: pid.id, first_timer: firstTimer }));
    } catch (e) {
      // A stale local profile (server row gone, e.g. after a reseed) must not
      // dead-end the user: drop it and offer the nickname form again.
      if ((e as Error & { status?: number }).status === 422 && profile) {
        clearLocalProfile();
        setProfile(null);
        setError("Your saved profile expired — tell us your nickname once more.");
      } else {
        setError((e as Error).message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    if (!profile || removing) return;
    setRemoving(true);
    try {
      await unGoing(eventId, profile.id);
      setResult(null);
      toast("Removed from your plan.");
    } catch {
      toast("Couldn't remove that right now — try again in a moment.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold">Going?</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Mark it here and we&apos;ll keep count. First-timers get paired with another first-timer as
        a buddy — so nobody walks in alone.
      </p>

      {!ready ? (
        <Skeleton className="mt-3 h-36 w-full" />
      ) : result ? (
        <div className="mt-3 rounded-lg border border-line bg-ice/60 px-3 py-3 text-sm leading-relaxed animate-fade-in">
          {result.buddy ? (
            <p>
              <span className="font-semibold">You&apos;re paired with {result.buddy.nickname}!</span>{" "}
              Look for each other at the entrance — you&apos;re each other&apos;s buddy for this
              event.
            </p>
          ) : firstTimer ? (
            <p>
              <span className="font-semibold">You&apos;re on the buddy list.</span> As soon as
              another first-timer marks this event, we&apos;ll pair you up.
            </p>
          ) : (
            <p>
              <span className="font-semibold">You&apos;re in!</span> See you there — one more step
              counted.
            </p>
          )}
          <button
            onClick={() => void onRemove()}
            disabled={removing}
            className="mt-2.5 text-xs font-semibold text-muted underline decoration-dotted underline-offset-2 transition-colors hover:text-ink disabled:opacity-50"
          >
            {removing ? "Removing…" : "Can't make it? Remove from my plan"}
          </button>
        </div>
      ) : (
        <>
          {!profile ? (
            <>
              <label className="mt-3 block">
                <span className={labelClass}>Your nickname</span>
                <input
                  value={nickname}
                  onChange={(ev) => setNickname(ev.target.value)}
                  placeholder="e.g. Jovana"
                  maxLength={30}
                  className={inputClass}
                />
              </label>

              <label className="mt-3 block">
                <span className={labelClass}>How much tech-event experience do you have?</span>
                <select
                  value={level}
                  onChange={(ev) => setLevel(ev.target.value as Level)}
                  className={inputClass}
                >
                  {ALL_LEVELS.map((lv) => (
                    <option key={lv} value={lv}>
                      {LEVEL_HINTS[lv]}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : null}

          <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={firstTimer}
              onChange={(ev) => setFirstTimer(ev.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
            />
            <span className="leading-relaxed text-muted">
              I&apos;m going for the first time — pair me with a buddy
            </span>
          </label>

          {error ? <p className="mt-2 text-xs text-urgent">{error}</p> : null}

          <Button variant="primary" className="mt-3 w-full" disabled={busy} onClick={() => void onGoing()}>
            {busy ? "Saving…" : <><Ticket className="size-4" aria-hidden /> I&apos;m going</>}
          </Button>
        </>
      )}
    </div>
  );
}

const LEVEL_HINTS: Record<Level, string> = {
  beginner: `${levelLabel("beginner")} — I'm new to tech events`,
  intermediate: `${levelLabel("intermediate")} — I know the basics`,
  expert: `${levelLabel("expert")} — I work with this daily`,
};

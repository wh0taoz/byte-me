"use client";

import { ArrowLeft, CalendarDays, Check, ExternalLink, MapPin, Ticket } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createProfile,
  getEvent,
  getLocalProfileId,
  icsUrl,
  levelExplanation,
  markGoing,
  setLocalProfileId,
} from "@/lib/api";
import type { EventRow, GoingResult } from "@/lib/types";
import { fmtTime, smartRange } from "@/lib/format";
import { Stoat } from "@/components/stoat";
import { AiBlock, Button, Chip, Empty, LevelPill, Skeleton, inputClass } from "@/components/ui";

export function EventDetailView() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getEvent(id)
      .then(setEvent)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <Empty title="Couldn't load this event" hint={error} />;
  if (!event) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const e = event;
  const ai = e.ai_summary;
  const oneDay =
    e.ends_at &&
    new Date(e.starts_at).toDateString() === new Date(e.ends_at).toDateString();

  return (
    <div>
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden /> All events
      </Link>

      <header className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Chip className="capitalize">{e.type}</Chip>
          <LevelPill level={e.level} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{e.title}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="font-medium text-ink">{e.organizer}</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            {smartRange(e.starts_at, e.ends_at)}
            {oneDay ? ` · ${fmtTime(e.starts_at)}` : ""}
          </span>
          {e.venue || e.city ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {e.venue ?? e.city}
            </span>
          ) : null}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="card flex items-start gap-4 p-5">
            <Stoat level={e.level} className="size-20 shrink-0" />
            <div>
              <LevelPill level={e.level} />
              <p className="mt-2.5 text-sm leading-relaxed">{levelExplanation(e.level)}</p>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
              What to expect
            </h2>
            <p className="mb-4 text-sm leading-relaxed">{e.description}</p>
            {e.what_to_expect?.length ? (
              <ul className="flex flex-col gap-2">
                {e.what_to_expect.map((x) => (
                  <li key={x} className="flex gap-2.5 text-sm leading-relaxed">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section>
            {ai?.summary ? (
              <AiBlock>
                <p>{ai.summary}</p>
                {ai.prior_knowledge?.length ? (
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
                ) : (
                  <p className="mt-2 text-sm text-muted">
                    No prior knowledge needed — come as you are.
                  </p>
                )}
                {ai.key_terms?.length ? (
                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                      Key terms, explained simply
                    </p>
                    <dl className="flex flex-col gap-1.5">
                      {ai.key_terms.map((t) => (
                        <div key={t.term} className="text-sm">
                          <dt className="inline font-semibold">{t.term}: </dt>
                          <dd className="inline text-muted">{t.meaning}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}
              </AiBlock>
            ) : (
              <AiBlock>
                <p className="text-muted">
                  The AI summary for this event is being written — check back soon. Everything you
                  need to decide is in &quot;What to expect&quot; above.
                </p>
              </AiBlock>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            {e.registration_url ? (
              <a
                href={e.registration_url}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-primary-deep"
              >
                Register <ExternalLink className="size-4" aria-hidden />
              </a>
            ) : (
              <p className="text-center text-sm text-muted">Registration info coming soon</p>
            )}
            <p className="mt-2 text-center text-xs text-muted">
              Registration happens on the organizer&apos;s site — confirmations live there too.
            </p>
            <a
              href={icsUrl(e.id)}
              download
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-bg"
            >
              <CalendarDays className="size-4" aria-hidden /> Add to calendar (.ics)
            </a>
          </div>

          <GoingCard eventId={e.id} />
        </aside>
      </div>
    </div>
  );
}

function GoingCard({ eventId }: { eventId: string }) {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [firstTimer, setFirstTimer] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GoingResult | null>(null);

  useEffect(() => {
    setProfileId(getLocalProfileId());
  }, []);

  async function onGoing() {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      let pid = profileId;
      if (!pid) {
        const name = nickname.trim();
        if (!name) {
          setError("Tell us your nickname first — that's how your buddy finds you.");
          setBusy(false);
          return;
        }
        const profile = await createProfile({ nickname: name, first_timer: firstTimer });
        pid = profile.id;
        setProfileId(pid);
        setLocalProfileId(pid);
      }
      setResult(await markGoing({ event_id: eventId, profile_id: pid, first_timer: firstTimer }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold">Going?</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Mark it here and we&apos;ll keep count. First-timers get paired with another first-timer as
        a buddy — so nobody walks in alone.
      </p>

      {result ? (
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
        </div>
      ) : (
        <>
          {!profileId ? (
            <label className="mt-3 block">
              <span className="mb-1 block text-xs font-medium text-muted">Your nickname</span>
              <input
                value={nickname}
                onChange={(ev) => setNickname(ev.target.value)}
                placeholder="e.g. Jovana"
                className={inputClass}
              />
            </label>
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

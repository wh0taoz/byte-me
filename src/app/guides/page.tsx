"use client";

import { BookOpen, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getGuides } from "@/lib/api";
import { Empty, Skeleton } from "@/components/ui";

type Guide = Awaited<ReturnType<typeof getGuides>>[number];

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getGuides()
      .then(setGuides)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">First time? Start here.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Short guides written for someone who has never been to a single tech event. If a word here
          is unclear — that&apos;s normal too. Ask the organizer, that&apos;s their job.
        </p>
      </header>

      {error ? (
        <Empty title="Couldn't load the guides" hint={error} />
      ) : !guides ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {guides.map((g, i) => (
            <GuideCard key={g.slug} guide={g} defaultOpen={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

function GuideCard({ guide: g, defaultOpen }: { guide: Guide; defaultOpen: boolean }) {
  return (
    <details className="card group p-5" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ice text-lg">
          {g.emoji ?? <BookOpen className="size-4" aria-hidden />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-semibold leading-snug">{g.title}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
          <Clock className="size-3.5" aria-hidden /> {estimateMinutes(g.body_md)} min read
        </span>
      </summary>
      <div className="mt-5 border-t border-line pt-5">
        <Markdown body={g.body_md} />
      </div>
    </details>
  );
}

function estimateMinutes(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).length / 200));
}

/** Tiny markdown renderer — headings, bullets, **bold**, paragraphs. */
function Markdown({ body }: { body: string }) {
  const blocks: React.ReactElement[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={key++} className="my-3 flex flex-col gap-2">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{inline(item)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }
    flushList();
    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="mt-5 mb-1 text-sm font-semibold">
          {inline(line.slice(4))}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="mt-6 mb-2 text-base font-semibold">
          {inline(line.slice(3))}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      blocks.push(
        <h2 key={key++} className="mt-6 mb-2 text-lg font-bold tracking-tight">
          {inline(line.slice(2))}
        </h2>,
      );
    } else {
      blocks.push(
        <p key={key++} className="my-2 text-sm leading-relaxed text-muted">
          {inline(line)}
        </p>,
      );
    }
  }
  flushList();

  return <div className="first:mt-0 [&>*:first-child]:mt-0">{blocks}</div>;
}

function inline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

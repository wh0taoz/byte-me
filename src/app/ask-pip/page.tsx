"use client";

import { useEffect, useRef, useState } from "react";
import { getLocalProfile } from "@/lib/api";
import { ICON, MASCOT } from "@/lib/kit";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hey! Let's make your first event feel easier. Coming alone? Not sure what to bring? Ask away — we'll figure it out together.",
};

const QUICK_QUESTIONS = [
  { icon: ICON.people, label: "Can I come alone?" },
  { icon: ICON.sprout, label: "I'm a total beginner. Is that okay?" },
  { icon: ICON.help, label: "What should I bring?" },
];

export default function AskPipPage() {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [asked, setAsked] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, busy]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setInput("");
    setAsked(true);
    setBusy(true);
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(1),
          level: getLocalProfile()?.level ?? "beginner",
        }),
      });
      if (!res.ok) throw new Error(`Pip couldn't answer (${res.status})`);
      const data = (await res.json()) as { reply: string };
      // On Gemma failure the route answers 200 with a friendly fallback reply.
      setMessages([...next, { role: "assistant", content: data.reply || "…" }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "My brain froze for a second (winter stoat problems). Please try asking again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* ---- Pip header ---- */}
      <div className="flex items-center gap-5 border-b-2 border-line pb-6">
        <span className="flex size-[84px] shrink-0 items-center justify-center rounded-full border-2 border-b-4 border-line-strong bg-soft">
          {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
          <img
            src={MASCOT.helperWink}
            alt="Pip, your friendly event guide"
            className="h-16 w-14 object-contain"
          />
        </span>
        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.06em] text-primary-deep">
            Your event sidekick
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Ask Pip<span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-sm text-muted">No question is too small.</p>
        </div>
      </div>

      {/* ---- conversation ---- */}
      <section className="mt-6 flex flex-col gap-4" aria-label="Chat with Pip" aria-live="polite">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[460px] [overflow-wrap:anywhere] rounded-[18px] rounded-br-[4px] bg-primary px-4 py-3 text-[15px] leading-relaxed text-on-accent">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={i} className="flex items-end gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
              <img
                src={MASCOT.avatar}
                alt="Pip"
                className="size-9 shrink-0 rounded-full bg-soft object-contain"
              />
              <p className="max-w-[460px] [overflow-wrap:anywhere] rounded-[18px] rounded-bl-[4px] border-[1.5px] border-line bg-surface px-4 py-3 text-[15px] leading-relaxed">
                {m.content}
              </p>
            </div>
          ),
        )}

        {busy ? (
          <div className="flex items-end gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- official kit mascot art */}
            <img
              src={MASCOT.avatar}
              alt="Pip"
              className="size-9 shrink-0 rounded-full bg-soft object-contain"
            />
            <p className="flex items-center gap-1.5 rounded-[18px] rounded-bl-[4px] border-[1.5px] border-line bg-surface px-4 py-3.5">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="size-1.5 animate-bounce rounded-full bg-muted"
                  style={{ animationDelay: `${d * 0.15}s` }}
                />
              ))}
            </p>
          </div>
        ) : null}
        <div ref={endRef} />
      </section>

      {/* ---- quick questions ---- */}
      {!asked ? (
        <div className="mt-8">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.06em] text-muted">
            A few things you can ask
          </p>
          <div className="flex flex-col gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q.label}
                onClick={() => void send(q.label)}
                className="flex min-h-13 w-full items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-3 text-left text-[13px] font-semibold transition-colors hover:border-primary-deep hover:bg-ice"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
                <img src={q.icon} alt="" className="size-4.5" />
                {q.label}
                <span className="ml-auto text-primary-deep" aria-hidden>
                  ↗
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* ---- composer ---- */}
      <form
        className="card mt-6 flex items-center gap-2 rounded-[20px] py-1.5 pl-4 pr-1.5 focus-within:border-primary-deep"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Your question for Pip
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          autoComplete="off"
          maxLength={500}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send question"
          disabled={busy || !input.trim()}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-b-4 border-line-strong bg-primary transition-colors hover:bg-primary-deep disabled:opacity-40"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- kit icon */}
          <img src={ICON.arrowRight} alt="" className="size-4 brightness-0" />
        </button>
      </form>
      <p className="mt-2.5 text-center text-[11px] leading-relaxed text-muted">
        AI helper — answers may contain mistakes. Check details with the organizer.
      </p>
    </div>
  );
}

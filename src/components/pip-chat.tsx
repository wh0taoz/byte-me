"use client";

import { Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getLocalProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { MASCOT } from "@/lib/kit";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I'm Pip! 🐾 Ask me anything about tech events — what a hackathon is, what a word means, what to bring, whether you're \"allowed\" to come (spoiler: yes). No question is too small.",
};

export function PipChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const pathname = usePathname();
  const eventIdRef = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Event-aware: /api/explain loads the event server-side from the URL id.
  useEffect(() => {
    eventIdRef.current = pathname?.match(/^\/events\/([^/?]+)/)?.[1];
  }, [pathname]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy, open]);

  // Focus the composer on open; Esc closes the panel.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(1),
          event_id: eventIdRef.current,
          level: getLocalProfile()?.level ?? "beginner",
        }),
      });
      if (!res.ok) throw new Error(`chat failed (${res.status})`);
      const data = (await res.json()) as { reply: string };
      // On Gemma failure the route answers 200 with a friendly fallback reply.
      setMessages([...next, { role: "assistant", content: data.reply || "…hiccup. Try again?" }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "My brain froze for a second (winter stoat problems). Please try asking again!",
        },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* ---- floating "Ask Pip" button, bottom right ---- */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Pip chat" : "Chat with Pip"}
        aria-expanded={open}
        className="brand-gradient fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full border-2 border-b-4 border-line-strong pb-3.5 pl-2 pr-5 pt-3 shadow-winter transition-transform hover:scale-105 md:bottom-10 md:right-10"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface">
          {open ? (
            <X className="size-4 text-ink" aria-hidden />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- kit art
            <img src={MASCOT.avatar} alt="" className="size-7 object-contain" />
          )}
        </span>
        <span className="text-sm font-semibold text-ink">{open ? "Close" : "Ask Pip"}</span>
      </button>

      {/* ---- chat panel ---- */}
      {open ? (
        <div
          role="dialog"
          aria-label="Chat with Pip"
          className="card fixed bottom-24 right-5 z-50 flex h-[min(60vh,30rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden shadow-winter animate-slide-up md:right-10"
        >
          <div className="flex items-center gap-2.5 bg-nav-dark px-4 py-3 text-on-dark">
            <span className="flex size-9 items-center justify-center rounded-full bg-soft">
              {/* eslint-disable-next-line @next/next/no-img-element -- kit art */}
              <img src={MASCOT.avatar} alt="" className="size-7 object-contain" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Pip</p>
              <p className="text-[11px] opacity-80">no question is too small</p>
            </div>
          </div>

          <div
            ref={scrollRef}
            aria-live="polite"
            className="flex flex-1 flex-col gap-3 overflow-y-auto bg-bg p-3.5"
          >
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] [overflow-wrap:anywhere] rounded-[18px] rounded-br-[4px] bg-primary px-4 py-3 text-sm leading-relaxed text-on-accent">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div key={i} className="flex items-end gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element -- kit art */}
                  <img
                    src={MASCOT.avatar}
                    alt=""
                    className="size-9 shrink-0 rounded-full bg-soft object-contain"
                  />
                  <p className="max-w-[85%] [overflow-wrap:anywhere] rounded-[18px] rounded-bl-[4px] border-[1.5px] border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink">
                    {m.content}
                  </p>
                </div>
              ),
            )}

            {busy ? (
              <div className="flex items-end gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- kit art */}
                <img
                  src={MASCOT.avatar}
                  alt=""
                  className="size-9 shrink-0 rounded-full bg-soft object-contain"
                />
                <p className="flex items-center gap-1 rounded-[18px] rounded-bl-[4px] border-[1.5px] border-line bg-surface px-4 py-3.5">
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
          </div>

          <form
            className="flex gap-2 border-t-[1.5px] border-line bg-surface p-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Pip anything…"
              className="min-w-0 flex-1 rounded-full border-[1.5px] border-line bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-muted focus:border-primary-deep focus:outline-none"
              aria-label="Message Pip"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-b-4 border-line-strong bg-primary text-on-accent transition-colors",
                "hover:bg-primary-deep hover:text-on-dark disabled:opacity-40",
              )}
            >
              <Send className="size-4" aria-hidden />
            </button>
          </form>
          <p className="border-t-[1.5px] border-line bg-surface px-3 py-1.5 text-center text-[10px] text-muted">
            AI helper — answers may contain mistakes. Press Esc to close.
          </p>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getEvent } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StoatHead } from "./stoat";

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
  const contextRef = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // If we're on an event page, feed Pip the event as context.
  useEffect(() => {
    contextRef.current = undefined;
    const m = pathname?.match(/^\/events\/([^/?]+)/);
    if (!m) return;
    void getEvent(m[1])
      .then((e) => {
        contextRef.current = `Title: ${e.title}\nOrganizer: ${e.organizer}\nType: ${e.type}\nLevel: ${e.level}\nCity: ${e.city}\nDescription: ${e.description}`;
      })
      .catch(() => undefined);
  }, [pathname]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1), context: contextRef.current }),
      });
      if (!res.ok) throw new Error(`chat failed (${res.status})`);
      const data = (await res.json()) as { reply: string };
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
    }
  }

  return (
    <>
      {/* ---- floating stoat button, bottom right ---- */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Pip chat" : "Chat with Pip"}
        className="bg-winter fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full border-2 border-surface text-surface shadow-winter transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" aria-hidden /> : <StoatHead className="size-11" />}
      </button>

      {/* ---- chat panel ---- */}
      {open ? (
        <div className="card fixed bottom-22 right-5 z-50 flex h-[min(60vh,30rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden shadow-winter animate-slide-up">
          <div className="bg-winter flex items-center gap-2.5 px-4 py-3 text-surface">
            <span className="flex size-9 items-center justify-center rounded-full bg-surface">
              <StoatHead className="size-7" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Pip</p>
              <p className="text-[11px] opacity-80">no question is too small</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-bg p-3.5">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm leading-relaxed text-surface">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div key={i} className="flex items-end gap-2">
                  <StoatHead className="size-7 shrink-0 rounded-full border border-line bg-surface" />
                  <p className="max-w-[85%] rounded-2xl rounded-bl-sm border border-line bg-surface px-3.5 py-2 text-sm leading-relaxed text-ink">
                    {m.content}
                  </p>
                </div>
              ),
            )}

            {busy ? (
              <div className="flex items-end gap-2">
                <StoatHead className="size-7 shrink-0 rounded-full border border-line bg-surface" />
                <p className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-line bg-surface px-3.5 py-2.5">
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
            className="flex gap-2 border-t border-line bg-surface p-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Pip anything…"
              className="min-w-0 flex-1 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
              aria-label="Message Pip"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-surface transition-colors",
                "hover:bg-primary-deep disabled:opacity-40",
              )}
            >
              <Send className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

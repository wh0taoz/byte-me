"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, CalendarClock, Sparkles, Users, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { getLocalProfile } from "@/lib/api";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Discover" },
  { href: "/saved", label: "Saved" },
  { href: "/my-events", label: "My events" },
  { href: "/guides", label: "Guides" },
  { href: "/ask-pip", label: "Ask Pip" },
];

// Demo notifications — hardcoded for the pitch UI (no backend yet).
const NOTIFS = [
  {
    id: 1,
    tab: "buddies" as const,
    icon: Users,
    title: "You've got a buddy!",
    body: "Jovana is going to Frontend Night too. Look for each other at the entrance.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    tab: "reminders" as const,
    icon: CalendarClock,
    title: "Tomorrow: Frontend Night",
    body: "Fri 16 Oct, 18:00 — Startit Center, Novi Sad. Bring a question — any question.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    tab: "buddies" as const,
    icon: Users,
    title: "Another first-timer joined",
    body: "Someone just marked CSS Night as their first event too. You're not alone.",
    time: "3h ago",
    unread: true,
  },
  {
    id: 4,
    tab: "reminders" as const,
    icon: CalendarClock,
    title: "RSVP closes soon",
    body: "Registration for NS Code Sprint closes on Friday — it's in your saved list.",
    time: "1d ago",
    unread: false,
  },
  {
    id: 5,
    tab: "reminders" as const,
    icon: Sparkles,
    title: "Welcome to SCOUT",
    body: "Every step counts — yours start on the Discover page.",
    time: "2d ago",
    unread: false,
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const [initial, setInitial] = useState<string | null>(null);
  const unread = notifs.filter((n) => n.unread).length;

  // The demo profile lives in localStorage — read it after mount so SSR HTML matches.
  useEffect(() => {
    const p = getLocalProfile();
    setInitial(p?.nickname?.trim()?.[0]?.toUpperCase() ?? null);
  }, [pathname]);

  // Esc closes the notifications panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-line-strong bg-surface">
      <div className="mx-auto flex h-19 max-w-[1200px] items-center gap-6 px-4 md:px-10">
        <Link href="/" aria-label={`${BRAND.name} home`} className="flex shrink-0 items-center gap-2.5">
          {/* logo fills its rounded square edge-to-edge (the badge art bleeds
              slightly so no orange corners peek through) */}
          <span className="relative block size-9 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element -- official SCOUT logo mark */}
            <img
              src="/assets/brand/scout-icon.png"
              alt=""
              className="absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2"
            />
          </span>
          <span className="text-lg font-semibold tracking-[0.06em] text-ink">{BRAND.name}</span>
        </Link>

        <nav
          className="ml-auto flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Main"
        >
          {NAV.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-9 shrink-0 items-center rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                  active ? "bg-ice text-ink" : "text-muted hover:bg-ice hover:text-ink",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
            aria-expanded={open}
            className="relative flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ice"
          >
            <Bell className="size-5" aria-hidden />
            {unread > 0 ? (
              <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full border-2 border-surface bg-unread px-0.5 text-[10px] font-bold leading-none text-on-dark">
                {unread}
              </span>
            ) : null}
          </button>

          <Link
            href="/profile"
            aria-label="Your profile"
            aria-current={pathname === "/profile" ? "page" : undefined}
            className={cn(
              "flex size-10 items-center justify-center rounded-full border-2 border-primary-deep bg-soft text-base font-bold text-primary-deep transition-transform hover:scale-105",
              pathname === "/profile" && "ring-2 ring-primary ring-offset-2 ring-offset-surface",
            )}
          >
            {initial ?? "S"}
          </Link>
        </div>
      </div>

      {open ? (
        <NotificationsPanel
          notifs={notifs}
          onClose={() => setOpen(false)}
          onMarkAllRead={() => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })))}
        />
      ) : null}
    </header>
  );
}

function NotificationsPanel({
  notifs,
  onClose,
  onMarkAllRead,
}: {
  notifs: typeof NOTIFS;
  onClose: () => void;
  onMarkAllRead: () => void;
}) {
  const [tab, setTab] = useState<"all" | "buddies" | "reminders">("all");
  const items = notifs.filter((n) => tab === "all" || n.tab === tab);
  const unread = notifs.filter((n) => n.unread).length;

  return (
    <>
      {/* dim the page behind the panel */}
      <button
        aria-label="Close notifications"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default bg-black/20"
      />
      <div
        role="dialog"
        aria-label="Notifications"
        className="card fixed right-4 top-20 z-50 flex max-h-[min(70vh,32rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden shadow-[0_16px_40px_rgba(39,9,2,0.18)] md:right-10 md:top-[84px] md:w-[420px]"
      >
        <div className="flex items-center gap-2.5 px-5 pb-3 pt-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unread > 0 ? (
            <span className="rounded-full bg-unread px-2.5 py-1 text-xs font-bold uppercase tracking-[0.06em] text-on-dark">
              {unread} new
            </span>
          ) : null}
          <button
            onClick={onMarkAllRead}
            className="ml-auto rounded-lg px-2 py-1 text-[13px] font-semibold text-primary-deep transition-colors hover:bg-ice"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-ice hover:text-ink"
          >
            <X className="size-4.5" aria-hidden />
          </button>
        </div>

        <div className="flex gap-1.5 px-5 pb-3" role="tablist" aria-label="Notification tabs">
          {(["all", "buddies", "reminders"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "min-h-9 rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] font-semibold capitalize transition-colors",
                tab === t
                  ? "border-transparent bg-nav-dark text-on-dark"
                  : "border-line bg-surface text-muted hover:border-primary-deep hover:text-ink",
              )}
            >
              {t === "all" ? "All" : t === "buddies" ? "Buddies" : "Reminders"}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-bg p-3">
          {items.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-muted">Nothing here yet.</p>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "relative flex items-start gap-3 rounded-xl p-3",
                  n.unread ? "bg-ice" : "bg-surface",
                )}
              >
                {n.unread ? (
                  <span aria-hidden className="absolute right-3 top-3 size-2.5 rounded-full bg-unread" />
                ) : null}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-soft text-primary-deep">
                  <n.icon className="size-4.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 pr-4">
                  <span className="block text-[15px] font-semibold leading-snug">
                    {n.title}
                    {n.unread ? <span className="sr-only"> (unread)</span> : null}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted">{n.body}</span>
                  <span className="mt-1.5 block text-xs font-bold uppercase tracking-[0.06em] text-muted">
                    {n.time}
                  </span>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

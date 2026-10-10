"use client";

import { CalendarDays, BookOpen, Footprints } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Events", icon: CalendarDays },
  { href: "/guides", label: "First-time guides", icon: BookOpen },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-winter flex size-8 items-center justify-center rounded-lg text-surface shadow-winter">
            <Footprints className="size-4.5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight">{BRAND.name}</span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
              {BRAND.motto}
            </span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1" aria-label="Main">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3",
                  active
                    ? "bg-primary text-surface"
                    : "text-muted hover:bg-bg hover:text-ink",
                )}
              >
                <Icon className="size-4" aria-hidden />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

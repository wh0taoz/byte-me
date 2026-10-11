"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Discover" },
  { href: "/saved", label: "Saved" },
  { href: "/my-events", label: "My events" },
  { href: "/guides", label: "Guides" },
  { href: "/ask-pip", label: "Ask Pip" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b-2 border-line-strong bg-surface">
      <div className="mx-auto flex h-19 max-w-[1200px] items-center gap-6 px-4 md:px-10">
        <Link href="/" aria-label={`${BRAND.name} home`} className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary">
            {/* eslint-disable-next-line @next/next/no-img-element -- official SCOUT logo mark */}
            <img src="/assets/brand/scout-icon.png" alt="" className="size-7 object-contain" />
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
      </div>
    </header>
  );
}

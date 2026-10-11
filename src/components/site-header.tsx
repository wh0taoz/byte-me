"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { ICON } from "@/lib/kit";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Events", icon: ICON.home },
  { href: "/saved", label: "Saved", icon: ICON.bookmark },
  { href: "/my-events", label: "My events", icon: ICON.calendar },
  { href: "/guides", label: "Guides", icon: ICON.sprout },
  { href: "/ask-pip", label: "Ask Pip", icon: ICON.chat },
];

function KitIcon({ src, alt = "" }: { src: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- kit icons are static SVG assets
  return <img src={src} alt={alt} className="size-4.5" aria-hidden={!alt} />;
}

export { KitIcon };

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b-2 border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-6">
        <Link href="/" aria-label="StepIn home" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand SVG from the kit */}
          <img src="/assets/brand/footsteps.svg" alt="" width="26" height="32" />
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight">{BRAND.name}</span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              {BRAND.motto}
            </span>
          </span>
        </Link>

        <nav
          className="ml-auto flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Main"
        >
          {NAV.map(({ href, label, icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border-2 px-2.5 text-sm font-semibold transition-colors sm:px-3",
                  active
                    ? "border-line-strong bg-ice text-primary-deep"
                    : "border-transparent text-muted hover:bg-ice hover:text-ink",
                )}
              >
                <KitIcon src={icon} />
                <span className="hidden sm:inline">{label}</span>
                {/* icon-only below sm — keep an accessible name for screen readers */}
                <span className="sr-only sm:hidden">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

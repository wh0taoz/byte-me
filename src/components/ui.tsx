"use client";

import { Loader2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { Level } from "@/lib/types";
import { levelLabel } from "@/lib/api";
import { levelArt } from "@/lib/kit";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-4 animate-spin", className)} aria-label="Loading" />;
}

/**
 * Level indicator: official Pip level art + the word — never colour alone.
 * beginner waves, intermediate reads, expert is on the laptop.
 */
export function LevelPill({
  level,
  size = "md",
  className,
}: {
  level: Level;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-mint font-semibold text-ink",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className,
      )}
      title={`Level: ${levelLabel(level)}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- kit art is a static PNG asset */}
      <img src={levelArt(level)} alt="" className={size === "sm" ? "size-4" : "size-4.5"} />
      {levelLabel(level)}
    </span>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** AI output — always labelled, per the team rule: "AI summary — may contain mistakes". */
export function AiBlock({ children, label = "AI summary" }: { children: ReactNode; label?: string }) {
  return (
    <div className="rounded-lg border border-line bg-ice/60 px-3.5 py-3">
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted">
        <Sparkles className="size-3.5 text-accent" aria-hidden />
        {label}
        <span className="font-normal">— may contain mistakes</span>
      </p>
      <div className="text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "secondary",
  size = "md",
  disabled,
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
        variant === "primary" && "bg-primary text-surface hover:bg-primary-deep",
        variant === "secondary" && "border border-line-strong bg-surface text-ink hover:bg-bg",
        variant === "ghost" && "text-muted hover:bg-bg hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card flex flex-col items-center gap-1 px-6 py-10 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-line", className)} />;
}

export const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none";

export const labelClass = "mb-1 block text-xs font-medium text-muted";

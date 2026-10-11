"use client";

import { Loader2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { Level } from "@/lib/types";
import { levelLabel } from "@/lib/api";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-4 animate-spin", className)} aria-label="Loading" />;
}

/**
 * Level badge: 8px dot + the word (never colour alone).
 * `bare` = dot + text only, no pill shape — for use on the card gradients,
 * where the level's own tint already provides the backdrop.
 */
const LEVEL_TEXT: Record<Level, string> = {
  beginner: "text-level-beginner",
  intermediate: "text-level-intermediate",
  expert: "text-level-expert",
};
const LEVEL_STYLE: Record<Level, string> = {
  beginner: "bg-level-beginner-soft text-level-beginner",
  intermediate: "bg-level-intermediate-soft text-level-intermediate",
  expert: "bg-level-expert-soft text-level-expert",
};

export function LevelPill({
  level,
  size = "md",
  bare = false,
  className,
}: {
  level: Level;
  size?: "sm" | "md";
  bare?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-bold uppercase tracking-[0.06em]",
        bare
          ? cn(LEVEL_TEXT[level], "[text-shadow:0_1px_2px_rgba(39,9,2,0.3)]")
          : cn("rounded-full", LEVEL_STYLE[level]),
        !bare && (size === "sm" ? "px-2.5 py-1" : "px-3 py-[5px]"),
        size === "sm" ? "text-[11px]" : "text-xs",
        className,
      )}
      title={`Level: ${levelLabel(level)}`}
    >
      <span aria-hidden className="size-2 shrink-0 rounded-full bg-current" />
      {levelLabel(level)}
    </span>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border-[1.5px] border-line bg-surface px-3 py-1.5 text-[13px] font-semibold capitalize text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Pip's output — always labelled: "Pip's summary — may contain mistakes". */
export function AiBlock({ children, label = "Pip's summary" }: { children: ReactNode; label?: string }) {
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
        "inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-5 py-2.5 text-sm",
        variant === "primary" &&
          "border-2 border-b-4 border-line-strong bg-primary text-on-accent hover:bg-primary-deep hover:text-on-dark",
        variant === "secondary" &&
          "border-2 border-b-4 border-line-strong bg-surface text-ink hover:bg-ice",
        variant === "ghost" && "text-primary-deep hover:bg-ice hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Empty({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-1 px-6 py-10 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

/** Toggle switch — 46×28 pill, 22px knob; ON uses the primary accent. */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-[46px] shrink-0 rounded-full border-2 border-line-strong transition-colors",
        checked ? "bg-primary" : "bg-soft",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 size-[22px] -translate-y-1/2 rounded-full bg-surface transition-[left]",
          checked ? "left-[calc(100%-25px)]" : "left-[3px]",
        )}
      />
    </button>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-line", className)} />;
}

export const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary-deep focus:outline-none";

export const labelClass = "mb-1 block text-xs font-medium text-muted";

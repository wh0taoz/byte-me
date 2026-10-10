// The signature motto lockup: a leap trace takes off from "Every",
// lands on "step", and Pip jumps the gap from "step" to "counts".
import { StoatLeap } from "./stoat";

export function Motto({ className }: { className?: string }) {
  return (
    <h1
      className={`flex flex-wrap items-end gap-x-2.5 text-4xl font-bold leading-none tracking-tight md:text-5xl ${className ?? ""}`}
    >
      <span>Every</span>

      {/* the leap trace: takeoff dot at "Every", dashed arc, landing on "step" */}
      <svg
        className="mb-[0.42em] h-[0.95em] w-[2.1em] shrink-0 text-accent"
        viewBox="0 0 100 44"
        fill="none"
        aria-hidden
      >
        <path
          d="M5 40 Q50 -14 95 40"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeDasharray="0.5 9.5"
          strokeLinecap="round"
        />
        <circle cx="5" cy="40" r="3.2" fill="currentColor" />
        <path
          d="M95 40 l-7 -2.5 M95 40 l-3 -6.8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <span>step</span>

      <StoatLeap className="mb-[0.3em] size-[1.4em] shrink-0" />

      <span>counts.</span>
    </h1>
  );
}

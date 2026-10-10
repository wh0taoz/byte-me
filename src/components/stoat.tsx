// Pip the winter stoat — white coat, ink-lined, black ear & tail tips.
// Three poses double as the level system:
//   beginner     — waving, light-hearted
//   intermediate — glasses and a book
//   expert       — locked in on the laptop (inspired by a dear friend)
// Colours come from the palette tokens, so a reskin reskins the stoat too.
import type { Level } from "@/lib/types";

const INK = "var(--color-ink)";
const COAT = "var(--color-surface)";
const ACCENT = "var(--color-accent)";

function Ear({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 12 C${x - 3} 6 ${x + 1} 4 ${x + 4} 9 L${x + 3} 13 Z`} fill={COAT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={x + 0.5} cy={8.6} r="1.5" fill={INK} />
    </g>
  );
}

function BeginnerPose() {
  return (
    <g>
      {/* tail up with the black tip */}
      <path d="M38 46 C52 46 57 36 53 24" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M38 46 C52 46 57 36 53 24" fill="none" stroke={COAT} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="53" cy="24" r="3.4" fill={INK} />
      {/* body */}
      <ellipse cx="30" cy="44" rx="12" ry="15" fill={COAT} stroke={INK} strokeWidth="2.2" />
      {/* waving arm */}
      <path d="M38 37 C44 35 47 31 48 26" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="48" cy="26" r="2.6" fill={COAT} stroke={INK} strokeWidth="2" />
      {/* other arm */}
      <path d="M22 37 C18 39 16 42 15 45" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="15" cy="45" r="2.6" fill={COAT} stroke={INK} strokeWidth="2" />
      {/* feet */}
      <ellipse cx="24" cy="58.4" rx="3.4" ry="2.2" fill={COAT} stroke={INK} strokeWidth="2" />
      <ellipse cx="36" cy="58.4" rx="3.4" ry="2.2" fill={COAT} stroke={INK} strokeWidth="2" />
      {/* head */}
      <Ear x={21} />
      <Ear x={35} />
      <circle cx="30" cy="20" r="10.5" fill={COAT} stroke={INK} strokeWidth="2.2" />
      <circle cx="26" cy="19" r="1.7" fill={INK} />
      <circle cx="34" cy="19" r="1.7" fill={INK} />
      <path d="M29 22.6 h2 l-1 1.5 Z" fill={INK} />
      <path d="M25.5 25.5 Q30 28.8 34.5 25.5" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      {/* snow */}
      <g stroke={ACCENT} strokeWidth="1.4" strokeLinecap="round">
        <path d="M50 8 v6 M47 11 h6 M48.2 9.2 l3.6 3.6 M51.8 9.2 l-3.6 3.6" />
        <path d="M10 24 v4 M8 26 h4" />
      </g>
    </g>
  );
}

function IntermediatePose() {
  return (
    <g>
      {/* curled tail */}
      <path d="M44 50 C55 52 59 42 52 35" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M44 50 C55 52 59 42 52 35" fill="none" stroke={COAT} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="52" cy="35" r="3.4" fill={INK} />
      {/* sitting body */}
      <ellipse cx="32" cy="45" rx="14" ry="13.5" fill={COAT} stroke={INK} strokeWidth="2.2" />
      {/* open book */}
      <path d="M14 50 C20 46 26 46 31 49 L31 58.5 C26 55.5 20 55.5 14 59.5 Z" fill={COAT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 50 C44 46 38 46 33 49 L33 58.5 C38 55.5 44 55.5 50 59.5 Z" fill={COAT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <g stroke="var(--color-muted)" strokeWidth="1.3" strokeLinecap="round">
        <path d="M19 51.6 C23 49.8 27 49.8 30 51.6" />
        <path d="M19 54.6 C23 52.8 27 52.8 30 54.6" />
        <path d="M45 51.6 C41 49.8 37 49.8 34 51.6" />
        <path d="M45 54.6 C41 52.8 37 52.8 34 54.6" />
      </g>
      {/* paws on the book */}
      <circle cx="16.5" cy="52.5" r="2.5" fill={COAT} stroke={INK} strokeWidth="2" />
      <circle cx="47.5" cy="52.5" r="2.5" fill={COAT} stroke={INK} strokeWidth="2" />
      {/* head */}
      <Ear x={23} />
      <Ear x={37} />
      <circle cx="32" cy="21" r="10.5" fill={COAT} stroke={INK} strokeWidth="2.2" />
      {/* glasses */}
      <circle cx="27.4" cy="20" r="4.1" fill="none" stroke={INK} strokeWidth="1.9" />
      <circle cx="36.6" cy="20" r="4.1" fill="none" stroke={INK} strokeWidth="1.9" />
      <path d="M31.5 20 h1" stroke={INK} strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="27.4" cy="20" r="1.4" fill={INK} />
      <circle cx="36.6" cy="20" r="1.4" fill={INK} />
      <path d="M31 25 h2 l-1 1.3 Z" fill={INK} />
      <path d="M29 27.5 Q32 29.3 35 27.5" fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
    </g>
  );
}

function ExpertPose() {
  return (
    <g>
      {/* tail wrapped around */}
      <path d="M14 50 C4 47 4 38 10 33" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M14 50 C4 47 4 38 10 33" fill="none" stroke={COAT} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="10" cy="33" r="3.4" fill={INK} />
      {/* hunched body */}
      <path d="M14 54 C12 38 20 27 33 27 C46 27 54 37 52 54 Z" fill={COAT} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* laptop */}
      <rect x="21" y="42" width="26" height="13" rx="1.5" fill="var(--color-ice)" stroke={INK} strokeWidth="2" />
      <g strokeLinecap="round" strokeWidth="1.6">
        <path d="M25 46.5 h9" stroke={INK} />
        <path d="M25 49.5 h13" stroke={ACCENT} />
        <path d="M25 52 h6" stroke="var(--color-muted)" />
      </g>
      <path d="M17 55 h32 l2.5 4.5 H14.5 Z" fill={COAT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* paws on the keyboard */}
      <circle cx="26" cy="55.5" r="2.5" fill={COAT} stroke={INK} strokeWidth="2" />
      <circle cx="40" cy="55.5" r="2.5" fill={COAT} stroke={INK} strokeWidth="2" />
      {/* head — lowered, focused */}
      <Ear x={24} />
      <Ear x={38} />
      <circle cx="33" cy="25" r="10" fill={COAT} stroke={INK} strokeWidth="2.2" />
      {/* determined brows + eyes */}
      <path d="M26.5 21.5 l5 1.8" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M39.5 21.5 l-5 1.8" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="29" cy="25.5" r="1.6" fill={INK} />
      <circle cx="37" cy="25.5" r="1.6" fill={INK} />
      <path d="M30.5 30.5 h5" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      {/* coffee */}
      <path d="M55 47 h6 l-.8 6 h-4.4 Z" fill={COAT} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M61 48.5 c2.5 0 2.5 3 0 3" fill="none" stroke={INK} strokeWidth="1.6" />
      <path d="M56.8 44.5 c0-1.2 1-1.2 1-2.4 M59 44.5 c0-1.2 1-1.2 1-2.4" fill="none" stroke={ACCENT} strokeWidth="1.3" strokeLinecap="round" />
    </g>
  );
}

const POSES: Record<Level, () => React.ReactElement> = {
  beginner: BeginnerPose,
  intermediate: IntermediatePose,
  expert: ExpertPose,
};

export function Stoat({
  level,
  className,
  hop = false,
}: {
  level: Level;
  className?: string;
  hop?: boolean;
}) {
  const Pose = POSES[level];
  return (
    <svg
      viewBox="0 0 64 64"
      className={hop ? `animate-stoat-hop ${className ?? ""}` : className}
      role="img"
      aria-label={`Pip the stoat, ${level} pose`}
    >
      <Pose />
    </svg>
  );
}

/** Mid-leap pose for the motto lockup — stretched body, trailing tail. */export function StoatLeap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {/* speed lines */}
      <g stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round">
        <path d="M5 28 h9" />
        <path d="M3 36 h7" />
      </g>
      {/* trailing tail with the black tip */}
      <path d="M16 42 C10 46 7 50 6 55" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M16 42 C10 46 7 50 6 55" fill="none" stroke={COAT} strokeWidth="4" strokeLinecap="round" />
      <circle cx="6" cy="55" r="3" fill={INK} />
      {/* stretched body, leaping up-right */}
      <path d="M14 44 C22 28 36 19 50 15" fill="none" stroke={INK} strokeWidth="15" strokeLinecap="round" />
      <path d="M14 44 C22 28 36 19 50 15" fill="none" stroke={COAT} strokeWidth="11.5" strokeLinecap="round" />
      {/* back legs extended */}
      <path d="M20 40 C17 45 16 49 17 53" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="17" cy="53" r="2.2" fill={COAT} stroke={INK} strokeWidth="1.8" />
      <path d="M26 33 C24 38 24 42 26 46" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="26" cy="46" r="2.2" fill={COAT} stroke={INK} strokeWidth="1.8" />
      {/* front paw reaching */}
      <path d="M46 17 C50 16 54 17 57 19" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="57" cy="19" r="2.3" fill={COAT} stroke={INK} strokeWidth="1.8" />
      {/* head, facing right and slightly up */}
      <path d="M48 6 C45.5 2 48 0.5 51 4 L50.5 6.5 Z" fill={COAT} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M56 8 C55 3.5 58 2.5 59.5 6.5 L58 8.5 Z" fill={COAT} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="52.5" cy="13" r="8.5" fill={COAT} stroke={INK} strokeWidth="2.2" />
      <circle cx="49.5" cy="11.5" r="1.6" fill={INK} />
      <circle cx="55.5" cy="10.5" r="1.6" fill={INK} />
      <path d="M60.5 12.5 l-1.6 1.2 1.2 1 Z" fill={INK} />
      <path d="M56.5 16.5 Q59 18 61 16" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Just the head — used for the chat button, AI message avatars, chat header. */
export function StoatHead({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M20 18 C16 8 22 5 26 12 L25 17 Z" fill={COAT} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M38 12 C38 3 46 4 44 12 L41 16 Z" fill={COAT} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="17" cy="15" r="2" fill={INK} />
      <circle cx="43.5" cy="10.5" r="2" fill={INK} />
      <circle cx="32" cy="34" r="22" fill={COAT} stroke={INK} strokeWidth="2.6" />
      <circle cx="23" cy="31" r="2.6" fill={INK} />
      <circle cx="41" cy="31" r="2.6" fill={INK} />
      <path d="M30 40 h4 l-2 2.4 Z" fill={INK} />
      <path d="M25 46 Q32 51 39 46" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      {/* snowflake */}
      <g stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round">
        <path d="M52 12 v6 M49 15 h6 M50.2 13.2 l3.6 3.6 M53.8 13.2 l-3.6 3.6" />
      </g>
    </svg>
  );
}

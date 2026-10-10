// Pip the winter stoat — flat illustration style (no outlines, filled shapes
// only, like the team's reference): big head, tube body, stubby paws, dot
// eyes, soft grey shading and a ground shadow. Three poses double as the
// level system:
//   beginner     — standing, waving, light-hearted
//   intermediate — glasses and a book
//   expert       — locked in on the laptop (inspired by a dear friend)
// Colours come from the palette tokens, so a reskin reskins the stoat too.
import type { Level } from "@/lib/types";

const FUR = "var(--color-surface)"; // white winter coat
const SHADE = "var(--color-line)"; // soft grey shading (#DADEE1)
const INK = "var(--color-ink)"; // eyes, nose, tiny mouths
const ACCENT = "var(--color-accent)";

function GroundShadow({ cx = 32, cy = 57.5, rx = 15 }: { cx?: number; cy?: number; rx?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={2.8} fill={ACCENT} opacity={0.28} />;
}

function BeginnerPose() {
  return (
    <g>
      <GroundShadow />
      {/* tail curving up with a shaded underside */}
      <path d="M40 48 C52 47 57 37 52 27 L48.5 29.5 C52.5 37.5 48.5 44 39 45 Z" fill={FUR} />
      <path d="M48.7 29.7 C50 32.5 50.5 35.5 49.7 38.4 L47.2 37.2 C47.8 34.8 47.4 32.3 46.2 30.1 Z" fill={SHADE} />
      {/* body tube */}
      <path d="M32 28 C22 28 17.5 40 19.5 52 C20.5 55.5 43.5 55.5 44.5 52 C46.5 40 42 28 32 28 Z" fill={FUR} />
      {/* belly shading */}
      <path d="M32 35 C26.5 35 23.5 43 24.5 51 C27.5 52.5 36.5 52.5 39.5 51 C40.5 43 37.5 35 32 35 Z" fill={SHADE} />
      {/* stubby feet */}
      <ellipse cx="26" cy="55" rx="4" ry="2.4" fill={SHADE} />
      <ellipse cx="38" cy="55" rx="4" ry="2.4" fill={SHADE} />
      {/* waving arm */}
      <path d="M39 37 C45 35 48.5 30 49.5 24.5 L45.8 23 C45 28 42.5 32 37.5 34 Z" fill={FUR} />
      <circle cx="47.5" cy="23.5" r="3.2" fill={FUR} />
      {/* resting arm */}
      <path d="M25 37 C21 39.5 19 43.5 18.7 47.5 L22.3 48.3 C22.6 44.8 24.2 41.3 27.5 39 Z" fill={FUR} />
      {/* ears */}
      <circle cx="22.5" cy="10.5" r="3.4" fill={FUR} />
      <circle cx="41.5" cy="10.5" r="3.4" fill={FUR} />
      <circle cx="22.5" cy="10.5" r="1.5" fill={SHADE} />
      <circle cx="41.5" cy="10.5" r="1.5" fill={SHADE} />
      {/* head */}
      <circle cx="32" cy="20" r="13" fill={FUR} />
      <ellipse cx="32" cy="26" rx="6" ry="4.2" fill={SHADE} />
      {/* face */}
      <circle cx="26.5" cy="19.5" r="2.1" fill={INK} />
      <circle cx="37.5" cy="19.5" r="2.1" fill={INK} />
      <path d="M30.7 23.4 h2.6 L32 25.2 Z" fill={INK} />
      <path d="M29 27 Q32 29 35 27" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="23.2" cy="24" r="1.7" fill={ACCENT} opacity="0.45" />
      <circle cx="40.8" cy="24" r="1.7" fill={ACCENT} opacity="0.45" />
      {/* snow */}
      <g stroke={ACCENT} strokeWidth="1.4" strokeLinecap="round">
        <path d="M53 8 v5 M50.5 10.5 h5 M51.6 9.1 l2.8 2.8 M54.4 9.1 l-2.8 2.8" />
        <path d="M10 28 v4 M8 30 h4" />
      </g>
    </g>
  );
}

function IntermediatePose() {
  return (
    <g>
      <GroundShadow rx={17} />
      {/* tail curled around the side */}
      <path d="M43 52 C54 52.5 58 44 51.5 38 C48.5 35 45.5 38 48 40.5 C51 44 49 48.5 42.5 48.5 Z" fill={FUR} />
      <path d="M51.4 38.4 C50 37.4 48.4 38.2 48.9 39.8 C49.3 39 50.2 38.7 50.9 39.2 Z" fill={SHADE} />
      {/* sitting body */}
      <path d="M32 30 C21 30 16 42 18 52 C19 55 45 55 46 52 C48 42 43 30 32 30 Z" fill={FUR} />
      <path d="M32 37 C26.5 37 23.5 44 24.5 50.5 C27.5 52 36.5 52 39.5 50.5 C40.5 44 37.5 37 32 37 Z" fill={SHADE} />
      <ellipse cx="26" cy="54.5" rx="4" ry="2.3" fill={SHADE} />
      <ellipse cx="38" cy="54.5" rx="4" ry="2.3" fill={SHADE} />
      {/* arms reaching the book */}
      <path d="M23 40 C19.5 43 17.5 47 17 50.5 L20.5 51 C21 47.8 22.8 44.5 25.8 42 Z" fill={FUR} />
      <path d="M41 40 C44.5 43 46.5 47 47 50.5 L43.5 51 C43 47.8 41.2 44.5 38.2 42 Z" fill={FUR} />
      {/* ears */}
      <circle cx="23.5" cy="11.5" r="3.4" fill={FUR} />
      <circle cx="40.5" cy="11.5" r="3.4" fill={FUR} />
      <circle cx="23.5" cy="11.5" r="1.5" fill={SHADE} />
      <circle cx="40.5" cy="11.5" r="1.5" fill={SHADE} />
      {/* head */}
      <circle cx="32" cy="21" r="13" fill={FUR} />
      {/* glasses */}
      <circle cx="26.5" cy="20" r="4.5" fill="none" stroke={INK} strokeWidth="1.8" />
      <circle cx="37.5" cy="20" r="4.5" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="M31 20 h2" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="26.5" cy="20" r="1.9" fill={INK} />
      <circle cx="37.5" cy="20" r="1.9" fill={INK} />
      {/* nose + tiny mouth */}
      <path d="M30.7 25 h2.6 L32 26.6 Z" fill={INK} />
      <path d="M30.4 28.2 Q32 29.2 33.6 28.2" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      {/* open book */}
      <path d="M13.5 49.5 C19.5 46.5 26.5 46.5 31.3 49.3 L31.3 59 C26.5 56.2 19.5 56.2 13.5 59.2 Z" fill="var(--color-ice)" />
      <path d="M50.5 49.5 C44.5 46.5 37.5 46.5 32.7 49.3 L32.7 59 C37.5 56.2 44.5 56.2 50.5 59.2 Z" fill="var(--color-ice)" />
      <g stroke={ACCENT} strokeWidth="1.3" strokeLinecap="round" fill="none">
        <path d="M18.5 51 C22 49.6 26.5 49.6 29.5 51.2" />
        <path d="M18.5 54 C22 52.6 26.5 52.6 29.5 54.2" />
        <path d="M45.5 51 C42 49.6 37.5 49.6 34.5 51.2" />
        <path d="M45.5 54 C42 52.6 37.5 52.6 34.5 54.2" />
      </g>
      {/* paws holding the book */}
      <circle cx="17" cy="52.5" r="2.7" fill={FUR} />
      <circle cx="47" cy="52.5" r="2.7" fill={FUR} />
    </g>
  );
}

function ExpertPose() {
  return (
    <g>
      <GroundShadow rx={18} />
      {/* tail wrapped around */}
      <path d="M20 51 C10 48.5 9.5 38.5 16 34 C19 31.8 21.5 34.5 19.5 36.8 C15.8 40 17 45 22.5 47.5 Z" fill={FUR} />
      {/* hunched body */}
      <path d="M32 27 C20.5 27 14.5 40 17.5 53 C18.5 55.5 45.5 55.5 46.5 53 C49.5 40 43.5 27 32 27 Z" fill={FUR} />
      <path d="M32 36 C25.5 36 21.5 45 23 51.5 C27.5 53 36.5 53 41 51.5 C42.5 45 38.5 36 32 36 Z" fill={SHADE} />
      {/* laptop */}
      <rect x="20" y="41" width="24" height="12" rx="1.5" fill="var(--color-ice)" />
      <g strokeLinecap="round" strokeWidth="1.6" fill="none">
        <path d="M24 45.5 h8" stroke={INK} />
        <path d="M24 48.5 h12" stroke={ACCENT} />
      </g>
      <path d="M16 53 h32 l2.5 4.2 H13.5 Z" fill={SHADE} />
      {/* paws on the keyboard */}
      <circle cx="25" cy="53.5" r="2.7" fill={FUR} />
      <circle cx="39" cy="53.5" r="2.7" fill={FUR} />
      {/* ears */}
      <circle cx="24" cy="15.5" r="3.2" fill={FUR} />
      <circle cx="40" cy="15.5" r="3.2" fill={FUR} />
      <circle cx="24" cy="15.5" r="1.4" fill={SHADE} />
      <circle cx="40" cy="15.5" r="1.4" fill={SHADE} />
      {/* head lowered in focus */}
      <circle cx="32" cy="24" r="12.5" fill={FUR} />
      <ellipse cx="32" cy="29.5" rx="5.5" ry="3.8" fill={SHADE} />
      {/* focused half-lid eyes + determined brows */}
      <path d="M25.8 22.2 l4.6 1.4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38.2 22.2 l-4.6 1.4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="27.5" cy="25.5" rx="1.9" ry="1.4" fill={INK} />
      <ellipse cx="36.5" cy="25.5" rx="1.9" ry="1.4" fill={INK} />
      <path d="M30.7 28.4 h2.6 L32 30 Z" fill={INK} />
      <path d="M30 31.4 h4" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      {/* coffee */}
      <path d="M54.5 47.5 h6.5 l-0.9 6.5 h-4.7 Z" fill={FUR} />
      <path d="M54.5 47.5 h6.5 l-0.3 2 h-5.9 Z" fill={SHADE} />
      <path d="M61 49 c2.4 0 2.4 2.8 0 2.8" fill="none" stroke={SHADE} strokeWidth="1.5" />
      <g stroke={ACCENT} strokeWidth="1.3" strokeLinecap="round" fill="none">
        <path d="M56.6 45 c0-1.4 1.1-1.4 1.1-2.8 M59.2 45 c0-1.4 1.1-1.4 1.1-2.8" />
      </g>
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

/** Mid-leap pose for the motto lockup — stretched body, trailing tail. */
export function StoatLeap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {/* speed lines */}
      <g stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 26 h9" />
        <path d="M2 34 h7" />
      </g>
      {/* trailing tail */}
      <path d="M15.5 44.5 C10 48 7 52.5 6 57 C5.6 59 8.6 59.6 9.4 57.5 C11 52.8 13.8 49 18.5 46.5 Z" fill={FUR} />
      {/* stretched body, leaping up-right */}
      <path d="M15 45 C21.5 29 34.5 19.5 50 15.5" stroke={FUR} strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M17 44.5 C22.5 32 32 23.5 44 19" stroke={SHADE} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* back legs extended */}
      <path d="M20 40 C17 44 16 48 17 52" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M25.5 34 C23.5 38 23 41.5 24 45" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* front paw reaching */}
      <path d="M46 17.5 C50 16.5 54 17 57.5 19" stroke={FUR} strokeWidth="5.5" strokeLinecap="round" fill="none" />
      {/* ears + head, facing right */}
      <circle cx="48.5" cy="7" r="2.6" fill={FUR} />
      <circle cx="55.5" cy="8" r="2.6" fill={FUR} />
      <circle cx="52.5" cy="12.5" r="8.5" fill={FUR} />
      <ellipse cx="57" cy="15" rx="3.4" ry="2.6" fill={SHADE} />
      <circle cx="50.5" cy="10.5" r="1.7" fill={INK} />
      <circle cx="55.5" cy="10" r="1.7" fill={INK} />
      <path d="M60.2 13.4 l-2.2 1.5 1.4 1.1 Z" fill={INK} />
      <path d="M57 17 Q59 18.2 60.6 16.8" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Just the head — chat button, AI message avatars, chat header. */
export function StoatHead({ className, backdrop = true }: { className?: string; backdrop?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {backdrop ? <circle cx="32" cy="34" r="30" fill="var(--color-ice)" /> : null}
      {/* ears */}
      <circle cx="20.5" cy="14.5" r="4.4" fill={FUR} />
      <circle cx="43.5" cy="14.5" r="4.4" fill={FUR} />
      <circle cx="20.5" cy="14.5" r="1.9" fill={SHADE} />
      <circle cx="43.5" cy="14.5" r="1.9" fill={SHADE} />
      {/* head */}
      <circle cx="32" cy="35" r="22" fill={FUR} />
      <ellipse cx="32" cy="45" rx="10" ry="7" fill={SHADE} />
      {/* face */}
      <circle cx="23.5" cy="31" r="3" fill={INK} />
      <circle cx="40.5" cy="31" r="3" fill={INK} />
      <path d="M30.2 39.5 h3.6 L32 42 Z" fill={INK} />
      <path d="M27 44.5 Q32 48 37 44.5" fill="none" stroke={INK} strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="18.5" cy="38.5" r="2.4" fill={ACCENT} opacity="0.45" />
      <circle cx="45.5" cy="38.5" r="2.4" fill={ACCENT} opacity="0.45" />
      {/* snowflake */}
      <g stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round">
        <path d="M52 10 v6 M49 13 h6 M50.2 11.2 l3.6 3.6 M53.8 11.2 l-3.6 3.6" />
      </g>
    </svg>
  );
}

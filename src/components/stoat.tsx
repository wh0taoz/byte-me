// Pip the winter stoat — redrawn to match the team's reference character:
// flat shapes, no outlines, cream fur, pale blue-grey shading, big oval
// navy eyes with highlights, coral nose and inner ears, teal scarf, and a
// thick tail with a dark navy tip. Three poses double as the level system:
//   beginner     — standing, waving, light-hearted
//   intermediate — glasses and a book
//   expert       — locked in on the laptop (inspired by a dear friend)
import type { Level } from "@/lib/types";

const FUR = "#f7f3ec"; // cream winter coat
const SHADE = "#dde3ea"; // pale blue-grey shading
const INK = "var(--color-ink)"; // deep blue — eyes, tail tip, tiny mouths
const SCARF = "#1e9aa8"; // the signature teal scarf
const SCARF_DARK = "#157f8c";
const CORAL = "#ef8f7b"; // nose + inner ears

function GroundShadow({ cx = 32, cy = 57.5, rx = 15 }: { cx?: number; cy?: number; rx?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={2.8} fill="var(--color-accent)" opacity={0.28} />;
}

/** Oval navy eyes with a white highlight and a tiny glint. */
function Eyes({
  y = 20,
  lx = 26.5,
  rx = 37.5,
  squish = 1,
  scale = 1,
}: {
  y?: number;
  lx?: number;
  rx?: number;
  squish?: number;
  scale?: number;
}) {
  const eye = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={y} rx={2.3 * scale} ry={2.8 * scale * squish} fill={INK} />
      <circle cx={cx + 0.8 * scale} cy={y - 1 * scale} r={0.9 * scale} fill="#fff" />
      <circle cx={cx - 0.7 * scale} cy={y + 1.2 * scale} r={0.35 * scale} fill="#fff" />
    </g>
  );
  return (
    <g>
      {eye(lx)}
      {eye(rx)}
    </g>
  );
}

/** Teal scarf: band under the chin, knot and a short hanging end. */
function Scarf() {
  return (
    <g>
      <path
        d="M25 29.5 C28.5 32.5 35.5 32.5 39 29.5 C40 32.5 39.7 34.4 38.5 35.2 C34.5 37.4 29.5 37.4 25.5 35.2 C24.3 34.4 24 32.5 25 29.5 Z"
        fill={SCARF}
      />
      <circle cx="38.6" cy="34.6" r="2.2" fill={SCARF_DARK} />
      <path d="M38.5 36.2 C40.5 38.8 40.3 41.4 38.4 43.6 C37.5 41.9 37.1 39 38 36.2 Z" fill={SCARF} />
    </g>
  );
}

function BeginnerPose() {
  return (
    <g>
      <GroundShadow />
      {/* tail curving up, dark navy tip */}
      <path d="M39 47 C51 46.5 55.5 37.5 51.5 28" stroke={FUR} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M40 46 C49.5 44.5 53 38.5 51 31.5" stroke={SHADE} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <ellipse cx="52" cy="26.5" rx="3" ry="4.2" transform="rotate(-35 52 26.5)" fill={INK} />
      {/* body tube */}
      <path d="M32 28 C22 28 17.5 40 19.5 52 C20.5 55.5 43.5 55.5 44.5 52 C46.5 40 42 28 32 28 Z" fill={FUR} />
      <path d="M32 36 C26.5 36 23.5 43.5 24.5 51 C27.5 52.4 36.5 52.4 39.5 51 C40.5 43.5 37.5 36 32 36 Z" fill={SHADE} />
      {/* stubby feet */}
      <ellipse cx="26" cy="55" rx="4" ry="2.4" fill={SHADE} />
      <ellipse cx="38" cy="55" rx="4" ry="2.4" fill={SHADE} />
      {/* waving arm */}
      <path d="M39 38 C45 36 48.5 31 49.5 25.5 L45.8 24 C45 29 42.5 33 37.5 35 Z" fill={FUR} />
      <circle cx="47.5" cy="24.5" r="3.2" fill={FUR} />
      {/* resting arm */}
      <path d="M25 38 C21 40.5 19 44.5 18.7 48.5 L22.3 49.3 C22.6 45.8 24.2 42.3 27.5 40 Z" fill={FUR} />
      {/* ears with coral inner */}
      <circle cx="22.5" cy="10.5" r="3.4" fill={FUR} />
      <circle cx="41.5" cy="10.5" r="3.4" fill={FUR} />
      <circle cx="22.5" cy="10.5" r="1.7" fill={CORAL} />
      <circle cx="41.5" cy="10.5" r="1.7" fill={CORAL} />
      {/* head */}
      <circle cx="32" cy="20" r="13" fill={FUR} />
      <ellipse cx="32" cy="26.5" rx="6" ry="4" fill={SHADE} />
      {/* face */}
      <Eyes />
      <path d="M30.6 23.6 h2.8 L32 25.6 Z" fill={CORAL} />
      <path d="M28.6 27.2 Q32 29.4 35.4 27.2" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      {/* the scarf */}
      <Scarf />
      {/* snow */}
      <g stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round">
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
      {/* tail curled around the side, dark navy tip */}
      <path d="M43 51 C53.5 51.5 57.5 43.5 51.5 38" stroke={FUR} strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="50.6" cy="36.4" rx="2.8" ry="4" transform="rotate(40 50.6 36.4)" fill={INK} />
      {/* sitting body */}
      <path d="M32 30 C21 30 16 42 18 52 C19 55 45 55 46 52 C48 42 43 30 32 30 Z" fill={FUR} />
      <path d="M32 38 C26.5 38 23.5 44.5 24.5 50.5 C27.5 51.8 36.5 51.8 39.5 50.5 C40.5 44.5 37.5 38 32 38 Z" fill={SHADE} />
      <ellipse cx="26" cy="54.5" rx="4" ry="2.3" fill={SHADE} />
      <ellipse cx="38" cy="54.5" rx="4" ry="2.3" fill={SHADE} />
      {/* arms reaching the book */}
      <path d="M23 41 C19.5 44 17.5 48 17 51.5 L20.5 52 C21 48.8 22.8 45.5 25.8 43 Z" fill={FUR} />
      <path d="M41 41 C44.5 44 46.5 48 47 51.5 L43.5 52 C43 48.8 41.2 45.5 38.2 43 Z" fill={FUR} />
      {/* ears */}
      <circle cx="23.5" cy="11.5" r="3.4" fill={FUR} />
      <circle cx="40.5" cy="11.5" r="3.4" fill={FUR} />
      <circle cx="23.5" cy="11.5" r="1.7" fill={CORAL} />
      <circle cx="40.5" cy="11.5" r="1.7" fill={CORAL} />
      {/* head */}
      <circle cx="32" cy="21" r="13" fill={FUR} />
      {/* glasses over the oval eyes */}
      <circle cx="26.5" cy="20" r="4.6" fill="none" stroke={INK} strokeWidth="1.8" />
      <circle cx="37.5" cy="20" r="4.6" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="M31.1 20 h1.8" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <Eyes scale={0.78} />
      {/* nose + tiny mouth */}
      <path d="M30.6 25.2 h2.8 L32 27.2 Z" fill={CORAL} />
      <path d="M30.4 28.6 Q32 29.6 33.6 28.6" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <Scarf />
      {/* open book */}
      <path d="M13.5 49.5 C19.5 46.5 26.5 46.5 31.3 49.3 L31.3 59 C26.5 56.2 19.5 56.2 13.5 59.2 Z" fill="var(--color-ice)" />
      <path d="M50.5 49.5 C44.5 46.5 37.5 46.5 32.7 49.3 L32.7 59 C37.5 56.2 44.5 56.2 50.5 59.2 Z" fill="var(--color-ice)" />
      <g stroke="var(--color-accent)" strokeWidth="1.3" strokeLinecap="round" fill="none">
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
      {/* tail wrapped around, dark navy tip */}
      <path d="M20 50.5 C10.5 48 10 38.5 16 34" stroke={FUR} strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="15" cy="32" rx="2.8" ry="4" transform="rotate(-40 15 32)" fill={INK} />
      {/* hunched body */}
      <path d="M32 27 C20.5 27 14.5 40 17.5 53 C18.5 55.5 45.5 55.5 46.5 53 C49.5 40 43.5 27 32 27 Z" fill={FUR} />
      <path d="M32 37 C25.5 37 21.5 45.5 23 51.5 C27.5 53 36.5 53 41 51.5 C42.5 45.5 38.5 37 32 37 Z" fill={SHADE} />
      {/* laptop */}
      <rect x="20" y="41" width="24" height="12" rx="1.5" fill="var(--color-ice)" />
      <g strokeLinecap="round" strokeWidth="1.6" fill="none">
        <path d="M24 45.5 h8" stroke={INK} />
        <path d="M24 48.5 h12" stroke="var(--color-accent)" />
      </g>
      <path d="M16 53 h32 l2.5 4.2 H13.5 Z" fill={SHADE} />
      {/* paws on the keyboard */}
      <circle cx="25" cy="53.5" r="2.7" fill={FUR} />
      <circle cx="39" cy="53.5" r="2.7" fill={FUR} />
      {/* ears */}
      <circle cx="24" cy="16" r="3.2" fill={FUR} />
      <circle cx="40" cy="16" r="3.2" fill={FUR} />
      <circle cx="24" cy="16" r="1.6" fill={CORAL} />
      <circle cx="40" cy="16" r="1.6" fill={CORAL} />
      {/* head lowered in focus */}
      <circle cx="32" cy="24.5" r="12.5" fill={FUR} />
      <ellipse cx="32" cy="30" rx="5.5" ry="3.6" fill={SHADE} />
      {/* focused squished eyes + determined brows */}
      <path d="M25.8 22.4 l4.6 1.4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38.2 22.4 l-4.6 1.4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <Eyes y={25.5} lx={27.5} rx={36.5} squish={0.55} scale={0.92} />
      <path d="M30.6 28.6 h2.8 L32 30.4 Z" fill={CORAL} />
      <path d="M30 31.6 h4" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <Scarf />
      {/* coffee */}
      <path d="M54.5 47.5 h6.5 l-0.9 6.5 h-4.7 Z" fill={FUR} />
      <path d="M54.5 47.5 h6.5 l-0.3 2 h-5.9 Z" fill={SHADE} />
      <path d="M61 49 c2.4 0 2.4 2.8 0 2.8" fill="none" stroke={SHADE} strokeWidth="1.5" />
      <g stroke="var(--color-accent)" strokeWidth="1.3" strokeLinecap="round" fill="none">
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
      <g stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 26 h9" />
        <path d="M2 34 h7" />
      </g>
      {/* trailing tail with the big dark tip */}
      <path d="M16 44.5 C10.5 48 7.5 52.5 6.5 56.5" stroke={FUR} strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="6" cy="57.5" rx="3" ry="4" transform="rotate(20 6 57.5)" fill={INK} />
      {/* stretched body, leaping up-right */}
      <path d="M15 45 C21.5 29 34.5 19.5 50 15.5" stroke={FUR} strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M17 44.5 C22.5 32 32 23.5 44 19" stroke={SHADE} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* back legs extended */}
      <path d="M20 40 C17 44 16 48 17 52" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M25.5 34 C23.5 38 23 41.5 24 45" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* front paw reaching */}
      <path d="M46 17.5 C50 16.5 54 17 57.5 19" stroke={FUR} strokeWidth="5.5" strokeLinecap="round" fill="none" />
      {/* the scarf streaming along the body */}
      <path d="M24 32.5 C29 25.5 36 20 44 16.8 L45.2 19.4 C37.8 22.5 31.2 27.7 26.4 34.4 Z" fill={SCARF} />
      {/* ears + head, facing right */}
      <circle cx="48.5" cy="7" r="2.6" fill={FUR} />
      <circle cx="55.5" cy="8" r="2.6" fill={FUR} />
      <circle cx="48.5" cy="7" r="1.3" fill={CORAL} />
      <circle cx="55.5" cy="8" r="1.3" fill={CORAL} />
      <circle cx="52.5" cy="12.5" r="8.5" fill={FUR} />
      <ellipse cx="57" cy="15.5" rx="3.4" ry="2.6" fill={SHADE} />
      {/* side-view oval eye with highlight */}
      <ellipse cx="55" cy="10.5" rx="1.8" ry="2.2" fill={INK} />
      <circle cx="55.7" cy="9.7" r="0.7" fill="#fff" />
      <path d="M60 13.6 l-2 1.3 1.2 1 Z" fill={CORAL} />
      <path d="M57 17 Q59 18.2 60.6 16.8" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Just the head — chat button, AI message avatars, chat header. */
export function StoatHead({ className, backdrop = true }: { className?: string; backdrop?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {backdrop ? <circle cx="32" cy="34" r="30" fill="var(--color-ice)" /> : null}
      {/* ears with coral inner */}
      <circle cx="20.5" cy="14.5" r="4.4" fill={FUR} />
      <circle cx="43.5" cy="14.5" r="4.4" fill={FUR} />
      <circle cx="20.5" cy="14.5" r="2.1" fill={CORAL} />
      <circle cx="43.5" cy="14.5" r="2.1" fill={CORAL} />
      {/* head */}
      <circle cx="32" cy="35" r="22" fill={FUR} />
      <ellipse cx="32" cy="46" rx="10" ry="6.5" fill={SHADE} />
      {/* big oval eyes with highlights */}
      <ellipse cx="23.5" cy="31" rx="3.1" ry="3.8" fill={INK} />
      <circle cx="24.6" cy="29.6" r="1.2" fill="#fff" />
      <circle cx="22.6" cy="32.6" r="0.5" fill="#fff" />
      <ellipse cx="40.5" cy="31" rx="3.1" ry="3.8" fill={INK} />
      <circle cx="41.6" cy="29.6" r="1.2" fill="#fff" />
      <circle cx="39.6" cy="32.6" r="0.5" fill="#fff" />
      {/* coral nose + smile */}
      <path d="M29.9 39.8 h4.2 L32 42.4 Z" fill={CORAL} />
      <path d="M27.5 45 Q32 48.2 36.5 45" fill="none" stroke={INK} strokeWidth="1.9" strokeLinecap="round" />
      {/* the scarf under the chin */}
      <path
        d="M14.5 46.5 C21 52.5 43 52.5 49.5 46.5 C50.5 50 49.8 52.4 48 53.4 C41 57.4 23 57.4 16 53.4 C14.2 52.4 13.5 50 14.5 46.5 Z"
        fill={SCARF}
      />
      {/* snowflake */}
      <g stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M52 8 v6 M49 11 h6 M50.2 9.2 l3.6 3.6 M53.8 9.2 l-3.6 3.6" />
      </g>
    </svg>
  );
}

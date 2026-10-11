export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function fmtDateTime(iso: string): string {
  return `${fmtShort(iso)}, ${fmtTime(iso)}`;
}

/** Date range; single-day events don't render as "14–14 Oct". */
export function smartRange(startIso: string, endIso: string | null): string {
  const s = new Date(startIso);
  const e = new Date(endIso ?? startIso);
  const sameDay =
    s.getDate() === e.getDate() &&
    s.getMonth() === e.getMonth() &&
    s.getFullYear() === e.getFullYear();
  if (sameDay) return fmtDate(startIso);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric" });
  const mon = (d: Date) => d.toLocaleDateString("en-GB", { month: "short" });
  const yr = (d: Date) => d.toLocaleDateString("en-GB", { year: "numeric" });
  return sameMonth
    ? `${day(s)}–${day(e)} ${mon(e)} ${yr(e)}`
    : `${day(s)} ${mon(s)} – ${day(e)} ${mon(e)} ${yr(e)}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

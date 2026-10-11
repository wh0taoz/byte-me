// GET /api/events/[id]/ics — hand-built .ics download for an event.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// "2026-11-07T09:00:00+02:00" -> "20261107T070000Z"
function formatICSDate(input: string): string {
  return new Date(input).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

// RFC 5545 TEXT escaping: backslash, semicolon, comma, newlines.
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// RFC 5545 §3.1: fold long content lines at 75 octets; continuations start
// with a space. Slicing by characters keeps multibyte text intact.
function fold(line: string): string {
  let current = "";
  let currentBytes = 0;
  const parts: string[] = [];
  for (const ch of line) {
    const b = Buffer.byteLength(ch, "utf8");
    if (currentBytes + b > 75) {
      parts.push(current);
      current = " " + ch;
      currentBytes = 1 + b;
    } else {
      current += ch;
      currentBytes += b;
    }
  }
  parts.push(current);
  return parts.join("\r\n");
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) {
    return NextResponse.json({ error: "Event not found", code: 404 }, { status: 404 });
  }

  const { data: event, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[ics] lookup failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't load this event right now — please try again.", code: 500 },
      { status: 500 },
    );
  }
  if (!event) {
    return NextResponse.json({ error: "Event not found", code: 404 }, { status: 404 });
  }

  // An event with no end time gets a 2-hour slot — DTEND == DTSTART (a
  // zero-duration event) is discarded by several calendar apps.
  const dtEnd = event.ends_at ?? new Date(new Date(event.starts_at).getTime() + 2 * 60 * 60 * 1000).toISOString();

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "PRODID:-//Every Step Counts//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}`,
    `DTSTAMP:${formatICSDate(new Date().toISOString())}`,
    `DTSTART:${formatICSDate(event.starts_at)}`,
    `DTEND:${formatICSDate(dtEnd)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.venue || event.city)}`,
  ];
  if (event.registration_url) lines.push(`URL:${escapeText(event.registration_url)}`);
  lines.push(
    `DESCRIPTION:${escapeText(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  );

  const slug =
    String(event.title)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "event";

  return new Response(
    lines.map(fold).join("\r\n") + "\r\n",
    {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}.ics"`,
      },
    },
  );
}

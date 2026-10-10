// GET /api/events/[id]/ics — hand-built .ics download for an event.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: event, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 });
  }
  if (!event) {
    return NextResponse.json({ error: "Event not found", code: 404 }, { status: 404 });
  }

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Every Step Counts//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}`,
    `DTSTART:${formatICSDate(event.starts_at)}`,
    `DTEND:${formatICSDate(event.ends_at || event.starts_at)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.venue || event.city)}`,
  ];
  if (event.registration_url) lines.push(`URL:${event.registration_url}`);
  lines.push(
    `DESCRIPTION:${escapeText(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  );

  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="event.ics"',
    },
  });
}

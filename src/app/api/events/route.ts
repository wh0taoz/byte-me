// GET /api/events — upcoming events sorted by starts_at. Filters: ?level=&type=&city= (all optional).
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const LEVELS = ["beginner", "intermediate", "expert"] as const;
const TYPES = ["hackathon", "meetup", "seminar", "workshop", "conference"] as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const level = searchParams.get("level");
  const type = searchParams.get("type");
  const city = searchParams.get("city");

  if (level && !LEVELS.includes(level as (typeof LEVELS)[number])) {
    return NextResponse.json({ error: `Invalid level: ${level}`, code: 400 }, { status: 400 });
  }
  if (type && !TYPES.includes(type as (typeof TYPES)[number])) {
    return NextResponse.json({ error: `Invalid type: ${type}`, code: 400 }, { status: 400 });
  }

  let query = supabaseAdmin.from("events").select("*").order("starts_at", { ascending: true });
  if (level) query = query.eq("level", level);
  if (type) query = query.eq("type", type);
  const cityTrimmed = city?.trim();
  if (cityTrimmed) query = query.ilike("city", cityTrimmed); // "belgrade" works too

  const { data, error } = await query;
  if (error) {
    console.error("[events] list failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't load events right now — please try again.", code: 500 },
      { status: 500 },
    );
  }
  return NextResponse.json(data);
}

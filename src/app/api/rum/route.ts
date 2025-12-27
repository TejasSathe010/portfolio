import { NextResponse } from "next/server";
import { z } from "zod";

const RumSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  rating: z.string().optional(),
  delta: z.number().optional(),
  navigationType: z.string().optional(),
  url: z.string(),
  ts: z.number()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RumSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

    // Production extension: write to a datastore (Postgres/ClickHouse) or a log pipeline.
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

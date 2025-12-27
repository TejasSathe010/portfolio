import { NextResponse } from "next/server";

const cache = new Map<string, { exp: number; value: unknown }>();
const TTL_MS = 60 * 60 * 1000;

function readCache<T>(k: string): T | null {
  const hit = cache.get(k);
  if (!hit) return null;
  if (Date.now() > hit.exp) {
    cache.delete(k);
    return null;
  }
  return hit.value as T;
}
function writeCache(k: string, v: unknown) {
  cache.set(k, { exp: Date.now() + TTL_MS, value: v });
}

export async function GET(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });
  if (!apiKey) return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });

  const cacheKey = `crux:${url}`;
  const cached = readCache<{ p75: unknown }>(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" }
    });
  }

  const endpoint = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${encodeURIComponent(apiKey)}`;

  const r = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  if (!r.ok) {
    const text = await r.text().catch(() => "");
    return NextResponse.json({ error: "CrUX request failed", detail: text }, { status: 502 });
  }

  const data = (await r.json()) as any;
  const metrics = data?.record?.metrics ?? {};

  const pickP75 = (m: any): number | null => {
    const p = m?.percentiles?.p75;
    return typeof p === "number" ? p : null;
  };

  const out = {
    p75: {
      LCP: pickP75(metrics.largest_contentful_paint),
      INP: pickP75(metrics.interaction_to_next_paint),
      CLS: pickP75(metrics.cumulative_layout_shift)
    }
  };

  writeCache(cacheKey, out);

  return NextResponse.json(out, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" }
  });
}

import { NextResponse } from "next/server";

type Strategy = "mobile" | "desktop";

const cache = new Map<string, { exp: number; value: unknown }>();
const TTL_MS = 5 * 60 * 1000;

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
  const strategy = (searchParams.get("strategy") as Strategy) || "mobile";

  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });
  if (!apiKey) return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });

  const cacheKey = `psi:${strategy}:${url}`;
  const cached = readCache<{ scores: unknown }>(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" }
    });
  }

  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", strategy);
  endpoint.searchParams.set("category", "performance");
  endpoint.searchParams.append("category", "accessibility");
  endpoint.searchParams.append("category", "best-practices");
  endpoint.searchParams.append("category", "seo");
  endpoint.searchParams.set("key", apiKey);

  const r = await fetch(endpoint.toString());
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    return NextResponse.json({ error: "PSI request failed", detail: text }, { status: 502 });
  }

  const data = (await r.json()) as any;
  const categories = data?.lighthouseResult?.categories ?? {};
  const scores = {
    strategy,
    performance: categories.performance?.score,
    accessibility: categories.accessibility?.score,
    bestPractices: categories["best-practices"]?.score,
    seo: categories.seo?.score
  };

  const out = { scores };
  writeCache(cacheKey, out);

  return NextResponse.json(out, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" }
  });
}

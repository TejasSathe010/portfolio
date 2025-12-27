import { NextResponse } from "next/server";
import { projects } from "@/lib/projects";

export const runtime = "nodejs";

async function ping(url: string) {
  const start = performance.now();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2500);

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: ctrl.signal,
      headers: { "accept": "application/json,text/plain,*/*" }
    });

    const ms = Math.round(performance.now() - start);
    return { ok: res.ok, status: res.status, ms };
  } catch {
    const ms = Math.round(performance.now() - start);
    return { ok: false, status: 0, ms };
  } finally {
    clearTimeout(t);
  }
}

export async function GET() {
  const checkedAt = new Date().toISOString();

  const results = await Promise.all(
    projects.map(async (p) => {
      if (!p.healthUrl) {
        return { id: p.id, name: p.name, ok: null as null, status: null as null, ms: null as null };
      }

      // Allow local API paths for same-origin pings
      const url = p.healthUrl.startsWith("/") ? p.healthUrl : p.healthUrl;
      const r = await ping(url);

      return { id: p.id, name: p.name, ok: r.ok, status: r.status, ms: r.ms };
    })
  );

  return NextResponse.json({ checkedAt, results });
}

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/lib/projects";
import { cn } from "@/lib/utils";

type Row = { id: string; name: string; ok: boolean | null; status: number | null; ms: number | null };
type Payload = { checkedAt: string; results: Row[] };

function statusTone(ok: boolean | null): "neutral" | "good" | "bad" {
  if (ok === null) return "neutral";
  return ok ? "good" : "bad";
}

export function ProjectHealthPanel() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health/projects", { cache: "no-store" });
      setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = window.setInterval(load, 30000);
    return () => window.clearInterval(id);
  }, [load]);

  const rows = useMemo(() => {
    const byId = new Map(data?.results?.map((r) => [r.id, r]) ?? []);
    return projects.map((p) => {
      const r = byId.get(p.id);
      return {
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        href: p.href,
        ok: r?.ok ?? null,
        status: r?.status ?? null,
        ms: r?.ms ?? null,
        hasHealth: !!p.healthUrl
      };
    });
  }, [data]);

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-fg">Project health</div>
            <div className="mt-1 text-sm text-muted">Status + latency checks (auto-refresh every 30s).</div>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className={cn(
              "rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-sm font-semibold",
              "text-fg/70 hover:text-fg hover:bg-fg/[0.03]",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-border/70">
          <div className="grid grid-cols-[1.4fr,0.6fr,0.6fr] bg-card/60 px-4 py-3 text-xs font-semibold text-muted">
            <div>Project</div>
            <div>Status</div>
            <div>Latency</div>
          </div>

          <div className="divide-y divide-border/70 bg-card/40">
            {rows.map((r) => {
              const tone = statusTone(r.ok);

              const statusLabel =
                r.ok === null
                  ? r.hasHealth
                    ? "checking…"
                    : "connect healthUrl"
                  : r.ok
                  ? `OK${r.status ? ` • ${r.status}` : ""}`
                  : `DOWN${r.status ? ` • ${r.status}` : ""}`;

              return (
                <div key={r.id} className="grid grid-cols-[1.4fr,0.6fr,0.6fr] items-center px-4 py-3">
                  <div className="min-w-0">
                    {r.href ? (
                      <Link href={r.href} className="truncate text-sm font-semibold text-fg hover:underline">
                        {r.name}
                      </Link>
                    ) : (
                      <div className="truncate text-sm font-semibold text-fg">{r.name}</div>
                    )}
                    <div className="truncate text-xs text-muted">{r.tagline}</div>
                  </div>

                  <div>
                    <Badge tone={tone}>{statusLabel}</Badge>
                  </div>

                  <div className="text-sm font-semibold text-fg">
                    {r.ms == null ? "—" : `${r.ms}ms`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 text-xs text-muted">
          Last check: <span className="font-mono text-fg/80">{data?.checkedAt ?? "—"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

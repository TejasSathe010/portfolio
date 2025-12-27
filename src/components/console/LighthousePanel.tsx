"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type LH = {
  categories?: {
    performance?: { score?: number };
    accessibility?: { score?: number };
    seo?: { score?: number };
    ["best-practices"]?: { score?: number };
  };
};

function pct(score?: number) {
  if (typeof score !== "number") return null;
  return Math.round(score * 100);
}

export function LighthousePanel() {
  const [data, setData] = useState<LH | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch("/lighthouse.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("missing");
        return r.json();
      })
      .then((j) => {
        const candidate: LH = j?.lhr ?? j?.[0]?.lhr ?? j?.[0] ?? j ?? null;
        setData(candidate);
        setMissing(false);
      })
      .catch(() => {
        setMissing(true);
        setData(null);
      });
  }, []);

  const scores = useMemo(() => {
    const c = data?.categories;
    return [
      { label: "Performance", v: pct(c?.performance?.score) },
      { label: "SEO", v: pct(c?.seo?.score) },
      { label: "A11y", v: pct(c?.accessibility?.score) },
      { label: "Best Practices", v: pct(c?.["best-practices"]?.score) }
    ];
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-fg">Lighthouse CI</div>
            <div className="text-sm text-muted">
              Real audit scores ingested from{" "}
              <span className="font-mono text-fg/80">/public/lighthouse.json</span>.
            </div>
          </div>

          <Badge tone={missing ? "neutral" : "good"}>{missing ? "not connected" : "connected"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {missing ? (
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 text-sm text-fg/80">
            <div className="font-semibold text-fg">Not connected yet</div>
            <div className="mt-2 text-muted">
              Drop a Lighthouse CI JSON output file at:
              <span className="ml-2 font-mono text-fg/80">public/lighthouse.json</span>
            </div>
            <div className="mt-2 text-xs text-muted">
              Tip: start with a manual run and paste the JSON. This UI will auto-render when present.
            </div>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {scores.map((s) => {
              const w = Math.max(0, Math.min(100, s.v ?? 0));
              return (
                <div key={s.label} className="rounded-2xl border border-border/70 bg-card/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted">{s.label}</div>
                    <div className="font-mono text-sm font-semibold text-fg">{s.v ?? "—"}</div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-fg/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand via-brand2 to-brand3"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

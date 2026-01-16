"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatMs } from "@/lib/utils";
import { cn } from "@/lib/utils";

type VitalName = "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
type Vital = { value: number; rating?: string };

type PsiScores = {
  strategy: "mobile" | "desktop";
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
};

type CruxP75 = Partial<Record<"LCP" | "INP" | "CLS", number>>;

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

function formatVital(name: VitalName, value: number) {
  if (name === "CLS") return value.toFixed(3);
  return formatMs(value);
}

function toneForRating(r?: string): "neutral" | "good" | "warn" | "bad" {
  const rr = (r ?? "").toLowerCase();
  if (rr === "good") return "good";
  if (rr.includes("needs")) return "warn";
  if (rr === "poor") return "bad";
  return "neutral";
}

function pct(v?: number) {
  if (typeof v !== "number") return null;
  return Math.round(v * 100);
}

function MetricTile({ label, v }: { label: string; v: number | null }) {
  const value = v == null ? "—" : `${v}/100`;
  const w = Math.max(0, Math.min(100, v ?? 0));

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted">{label}</div>
        <div className="font-mono text-xs font-semibold text-fg">{value}</div>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-fg/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand via-brand2 to-brand3"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

function snapshotText(args: {
  psiMobile: PsiScores | null;
  psiDesktop: PsiScores | null;
  crux: CruxP75 | null;
  live: Partial<Record<VitalName, Vital>>;
}) {
  const m = args.psiMobile;
  const d = args.psiDesktop;
  const c = args.crux;

  const s = (x?: number) => (typeof x === "number" ? `${Math.round(x * 100)}/100` : "—");
  const ms = (name: VitalName, v?: Vital) => (v ? formatVital(name, v.value) : "—");

  return [
    "Evidence snapshot",
    "",
    `PSI Mobile: Perf ${s(m?.performance)} • A11y ${s(m?.accessibility)} • Best ${s(m?.bestPractices)} • SEO ${s(m?.seo)}`,
    `PSI Desktop: Perf ${s(d?.performance)} • A11y ${s(d?.accessibility)} • Best ${s(d?.bestPractices)} • SEO ${s(d?.seo)}`,
    `CrUX p75: LCP ${c?.LCP != null ? formatMs(c.LCP) : "—"} • INP ${c?.INP != null ? formatMs(c.INP) : "—"} • CLS ${
      c?.CLS != null ? c.CLS.toFixed(3) : "—"
    }`,
    `Live (this session): LCP ${ms("LCP", args.live.LCP)} • INP ${ms("INP", args.live.INP)} • CLS ${
      args.live.CLS ? args.live.CLS.value.toFixed(3) : "—"
    } • TTFB ${ms("TTFB", args.live.TTFB)}`,
    "",
    "Overlay: Shift + D"
  ].join("\n");
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export function EvidenceClient({
  siteUrl,
  compact = false
}: {
  siteUrl: string;
  compact?: boolean;
}) {
  const [live, setLive] = useState<Partial<Record<VitalName, Vital>>>({});
  const [psiMobile, setPsiMobile] = useState<PsiScores | null>(null);
  const [psiDesktop, setPsiDesktop] = useState<PsiScores | null>(null);
  const [crux, setCrux] = useState<CruxP75 | null>(null);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ name: VitalName; value: number; rating?: string }>;
      if (!ce.detail?.name) return;
      setLive((v) => ({ ...v, [ce.detail.name]: { value: ce.detail.value, rating: ce.detail.rating } }));
    };
    window.addEventListener("rum:vital", handler);
    return () => window.removeEventListener("rum:vital", handler);
  }, []);

  useEffect(() => {
    const enc = encodeURIComponent(siteUrl);
    (async () => {
      setLoading(true);
      const [m, d, c] = await Promise.all([
        getJson<{ scores: PsiScores }>(`/api/psi?url=${enc}&strategy=mobile`),
        getJson<{ scores: PsiScores }>(`/api/psi?url=${enc}&strategy=desktop`),
        getJson<{ p75: CruxP75 }>(`/api/crux?url=${enc}`)
      ]);

      setPsiMobile(m?.scores ?? null);
      setPsiDesktop(d?.scores ?? null);
      setCrux(c?.p75 ?? null);
      setLoading(false);
    })();
  }, [siteUrl]);

  const liveRows = useMemo(
    () => (["LCP", "INP", "CLS", "FCP", "TTFB"] as const).map((k) => [k, live[k]] as const),
    [live]
  );

  const cruxRows = useMemo(
    () => (["LCP", "INP", "CLS"] as const).map((k) => [k, crux?.[k]] as const),
    [crux]
  );

  const onCopy = useCallback(async () => {
    const text = snapshotText({ psiMobile, psiDesktop, crux, live });
    const ok = await copyToClipboard(text);
    if (!ok) return;

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }, [psiMobile, psiDesktop, crux, live]);

  return (
    <div className="space-y-4">
      {/* Optional internal heading (when used standalone) */}
      {!compact ? (
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-fg">Performance & SEO observability</h2>
          <p className="mt-1 text-sm text-muted">
            Live session vitals + latest lab audit + field p75. Toggle overlay with{" "}
            <span className="font-mono text-fg/80">Shift + D</span>.
          </p>
        </div>
      ) : null}

      {/* Summary strip */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-fg">Snapshot</div>
              <div className="text-sm text-muted">
                Shareable proof in one click. Overlay: <span className="font-mono text-fg/80">Shift + D</span>.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={loading ? "neutral" : "good"}>{loading ? "loading" : "ready"}</Badge>
              <Badge tone={crux ? "good" : "neutral"}>{crux ? "CrUX p75" : "CrUX —"}</Badge>
              <Badge tone="neutral">PSI</Badge>

              <Button variant="secondary" size="sm" onClick={onCopy}>
                {copied ? "Copied ✓" : "Copy snapshot"}
              </Button>

              <Link
                href="/console"
                className="inline-flex min-h-[44px] items-center rounded-2xl border border-border/70 bg-card/60 px-3 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03] transition-colors duration-200"
              >
                Open console →
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
        {/* LIVE */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-fg">Live (this session)</div>
                <div className="mt-1 text-sm text-muted">Measured in-browser via web-vitals.</div>
              </div>
              <Badge tone="neutral">RUM</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            {liveRows.map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3"
              >
                <div className="text-xs font-semibold text-fg">{k}</div>

                <div className="flex items-center gap-2">
                  {v?.rating ? <Badge tone={toneForRating(v.rating)}>{v.rating}</Badge> : null}
                  <div className="w-[92px] text-right font-mono text-xs font-semibold text-fg">
                    {v ? formatVital(k, v.value) : "—"}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* LAB */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-fg">Lab (latest)</div>
                <div className="mt-1 text-sm text-muted">Lighthouse via PageSpeed Insights (cached).</div>
              </div>
              <Badge tone={loading ? "neutral" : "good"}>{loading ? "loading" : "ready"}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div className="rounded-2xl border border-border/70 bg-card/60 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted">Mobile</div>
                <Badge tone="neutral">PSI</Badge>
              </div>
              <div className={cn("mt-3 grid grid-cols-2 gap-2", loading && "opacity-70")}>
                <MetricTile label="Perf" v={pct(psiMobile?.performance)} />
                <MetricTile label="A11y" v={pct(psiMobile?.accessibility)} />
                <MetricTile label="Best" v={pct(psiMobile?.bestPractices)} />
                <MetricTile label="SEO" v={pct(psiMobile?.seo)} />
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/60 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted">Desktop</div>
                <Badge tone="neutral">PSI</Badge>
              </div>
              <div className={cn("mt-3 grid grid-cols-2 gap-2", loading && "opacity-70")}>
                <MetricTile label="Perf" v={pct(psiDesktop?.performance)} />
                <MetricTile label="A11y" v={pct(psiDesktop?.accessibility)} />
                <MetricTile label="Best" v={pct(psiDesktop?.bestPractices)} />
                <MetricTile label="SEO" v={pct(psiDesktop?.seo)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FIELD */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-fg">Field p75</div>
                <div className="mt-1 text-sm text-muted">CrUX API (real user experience).</div>
              </div>
              <Badge tone={crux ? "good" : "neutral"}>{crux ? "available" : "—"}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            {cruxRows.map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3"
              >
                <div className="text-xs font-semibold text-fg">{k}</div>
                <div className="font-mono text-xs font-semibold text-fg">
                  {v != null ? (k === "CLS" ? v.toFixed(3) : formatMs(v)) : "—"}
                </div>
              </div>
            ))}

            <div className="pt-2 text-xs text-muted">
              Field data may be unavailable for low-traffic sites. When missing, it shows as —.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

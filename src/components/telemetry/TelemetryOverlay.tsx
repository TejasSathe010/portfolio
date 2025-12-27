"use client";

import { useEffect, useMemo, useState } from "react";
import { formatMs } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type VitalName = "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
type LiveVitals = Partial<Record<VitalName, { value: number; rating?: string }>>;

function kb(n: number) {
  return `${Math.round((n / 1024) * 10) / 10} KB`;
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

export function TelemetryOverlay() {
  const [open, setOpen] = useState(false);
  const [vitals, setVitals] = useState<LiveVitals>({});
  const [jsBytes, setJsBytes] = useState(0);
  const [cssBytes, setCssBytes] = useState(0);
  const [net, setNet] = useState<string>("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "d") setOpen((v) => !v);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ name: VitalName; value: number; rating?: string }>;
      const name = ce.detail?.name;
      if (!name) return;
      setVitals((v) => ({ ...v, [name]: { value: ce.detail.value, rating: ce.detail.rating } }));
    };
    window.addEventListener("rum:vital", handler);
    return () => window.removeEventListener("rum:vital", handler);
  }, []);

  useEffect(() => {
    const calc = () => {
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      let js = 0;
      let css = 0;

      for (const r of res) {
        const t = r.transferSize ?? 0;
        if (r.initiatorType === "script") js += t;
        if (r.initiatorType === "link") css += t;
      }
      setJsBytes(js);
      setCssBytes(css);
    };

    calc();
    const id = window.setInterval(calc, 2500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const nav = navigator as unknown as { connection?: { effectiveType?: string; downlink?: number; addEventListener?: any; removeEventListener?: any } };
    const c = nav.connection;

    const read = () => {
      if (!c?.effectiveType) return setNet("");
      setNet(`${c.effectiveType}${c.downlink ? ` • ${c.downlink}Mbps` : ""}`);
    };

    read();
    c?.addEventListener?.("change", read);
    return () => c?.removeEventListener?.("change", read);
  }, []);

  const rows = useMemo(
    () => (["LCP", "INP", "CLS", "FCP", "TTFB"] as const).map((k) => [k, vitals[k]] as const),
    [vitals]
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Live metrics overlay"
      className={cn(
        "fixed bottom-4 right-4 z-[9999] w-[360px]",
        "rounded-3xl border border-border/70 bg-card/80 shadow-lift backdrop-blur"
      )}
    >
      <div className="flex items-center justify-between border-b border-border/70 p-4">
        <div>
          <div className="text-sm font-semibold text-fg">Live metrics</div>
          <div className="text-xs text-muted">Shift + D to toggle</div>
        </div>

        <button
          className="rounded-2xl border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 text-xs">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-3">
          <div className="text-[11px] text-muted">JS (approx)</div>
          <div className="mt-1 font-mono text-fg">{kb(jsBytes)}</div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/60 p-3">
          <div className="text-[11px] text-muted">CSS (approx)</div>
          <div className="mt-1 font-mono text-fg">{kb(cssBytes)}</div>
        </div>
        <div className="col-span-2 rounded-2xl border border-border/70 bg-card/60 p-3">
          <div className="text-[11px] text-muted">Network</div>
          <div className="mt-1 font-mono text-fg">{net || "unknown"}</div>
        </div>
      </div>

      <div className="space-y-2 px-4 pb-4">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-3 py-2">
            <div className="text-xs font-semibold text-fg">{k}</div>
            <div className="flex items-center gap-2">
              {v?.rating ? <Badge tone={toneForRating(v.rating)}>{v.rating}</Badge> : null}
              <div className="w-[92px] text-right font-mono text-xs text-fg">
                {v ? formatVital(k, v.value) : "—"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

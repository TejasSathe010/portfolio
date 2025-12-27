import type { KeyMetric } from "@/lib/keyMetrics";
import { cn } from "@/lib/utils";

export function KeyMetricsRow({ metrics }: { metrics: KeyMetric[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-stretch [grid-auto-rows:1fr]">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={cn(
            "rounded-3xl border border-border/70 bg-card/70 shadow-soft backdrop-blur",
            "px-4 py-4"
          )}
        >
          <div className="text-xs text-muted">{m.label}</div>
          <div className="mt-1 font-mono text-sm font-semibold text-fg">{m.value}</div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-fg/[0.06] overflow-hidden">
            <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-brand/60 via-brand2/60 to-brand3/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

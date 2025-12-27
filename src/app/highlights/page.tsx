import { Card } from "@/components/ui/Card";

export const metadata = { title: "Highlights" };

type Highlight = {
  title: string;
  context: string;
  change: string[];
  impact: string;
  link?: string;
};

const highlights: Highlight[] = [
  {
    title: "Reduced regressions via clearer monorepo boundaries",
    context: "Improved dependency boundaries across React + Redux + Node layers to prevent integration breakage.",
    change: [
      "Separated API client + domain logic contracts",
      "Introduced deterministic integration tests for boundary validation",
      "Simplified build graph to reduce cross-package coupling"
    ],
    impact: "Cut integration regressions by 38% and improved release confidence.",
    link: undefined
  },
  {
    title: "Kafka outbox pipeline correctness hardening",
    context: "Strengthened exactly-once behavior for high-volume transactional processing.",
    change: ["Added idempotency keys", "Correlated publish + write acknowledgements", "Improved retry semantics"],
    impact: "Improved correctness under rebalance scenarios and reduced duplicate writes to near-zero.",
    link: undefined
  },
  {
    title: "Performance: edge routing tuned for high RPS rollouts",
    context: "Adjusted Nginx/Envoy routing and upstream policies for staged traffic shifts.",
    change: ["Tuned timeouts + pool sizing", "Introduced safe ramp template", "Added dashboards for p95 + saturation"],
    impact: "Held error rate below 0.03% during rollouts while sustaining 25K RPS.",
    link: undefined
  }
];

export default function HighlightsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Highlights</h1>
        <p className="max-w-2xl text-muted">
          High-signal snapshots of work that reads like a real code review: context → change → impact.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 items-stretch [grid-auto-rows:1fr]">
        {highlights.map((h) => (
          <Card key={h.title} className="h-full">
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-fg">{h.title}</div>
                <div className="text-sm text-muted">{h.context}</div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                <div className="text-xs font-semibold text-fg/80">Change</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg/80">
                  {h.change.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border/70 bg-gradient-to-r from-brand/[0.10] to-brand2/[0.10] p-4">
                <div className="text-xs font-semibold text-fg/80">Impact</div>
                <div className="mt-2 text-sm text-fg/80">{h.impact}</div>
              </div>

              {h.link ? (
                <a className="text-sm font-semibold text-fg/70 hover:text-fg" href={h.link} target="_blank" rel="noreferrer">
                  View PR →
                </a>
              ) : (
                <div className="text-xs text-muted">Link optional (add PR URLs later).</div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

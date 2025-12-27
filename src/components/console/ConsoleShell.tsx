import { ProjectHealthPanel } from "./ProjectHealthPanel";
import { BuildPanel } from "./BuildPanel";
import { LighthousePanel } from "./LighthousePanel";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export function ConsoleShell() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs text-fg/70 shadow-soft backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-brand2" />
          Engineering console • live signals • operational readiness
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-fg">Console</h1>
        <p className="max-w-2xl text-sm text-muted">
          This portfolio is instrumented like a product: health, build metadata, and performance signals.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
        <ProjectHealthPanel />
        <BuildPanel />
        <LighthousePanel />

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-fg">Performance budgets</div>
            <div className="mt-1 text-sm text-muted">Hook Lighthouse CI here for a true “wow”.</div>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            {[
              { k: "SEO", v: "Target 100" },
              { k: "Perf", v: "Target 100" },
              { k: "A11y", v: "Target 100" }
            ].map((x) => (
              <div
                key={x.k}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3"
              >
                <div className="text-muted">{x.k}</div>
                <div className="font-mono font-semibold text-fg">{x.v}</div>
              </div>
            ))}

            <div className="text-xs text-muted">
              Next step: publish a Lighthouse JSON to{" "}
              <span className="font-mono text-fg/80">/public/lighthouse.json</span> and render it here.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

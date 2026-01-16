import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const metadata = { title: "Postmortems" };

type Incident = {
  title: string;
  severity: "SEV-1" | "SEV-2" | "SEV-3";
  impact: string;
  detection: string;
  rootCause: string;
  fix: string;
  prevention: string[];
};

const incidents: Incident[] = [
  {
    title: "Staged rollout latency regression",
    severity: "SEV-2",
    impact: "p95 latency drifted above target during phased traffic shift; error rate stayed low.",
    detection: "Detected via dashboard alert on p95 + request queue depth during canary.",
    rootCause: "Routing policy changed request distribution faster than cache warm-up + DB pool limits.",
    fix: "Adjusted rollout step size, increased cache warm-up, and tuned upstream pool + timeouts.",
    prevention: [
      "Canary budget checks gate rollout (p95 + saturation).",
      "Warm-up job runs before traffic shift.",
      "Runbooks: rollback + rate-limited ramp template."
    ]
  },
  {
    title: "Exactly-once pipeline duplicate processing edge case",
    severity: "SEV-2",
    impact: "Small subset of events retried under consumer rebalance caused duplicate downstream writes.",
    detection: "Observed by idempotency key mismatch counters + audit sampling.",
    rootCause: "Outbox write and publish ack not correlated across a rare rebalance window.",
    fix: "Added idempotency enforcement at write boundary + publish correlation checks.",
    prevention: [
      "Idempotency keys required for all writes.",
      "Rebalance chaos test in CI pipeline.",
      "SLO: duplicate write budget alarms."
    ]
  }
];

function toneForSev(sev: Incident["severity"]): "bad" | "warn" | "good" {
  if (sev === "SEV-1") return "bad";
  if (sev === "SEV-2") return "warn";
  return "good";
}

function DotBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-sm text-muted">
      <span
        aria-hidden="true"
        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand2"
      />
      <span className="text-pretty">{children}</span>
    </li>
  );
}

function SectionBlock({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
      <div className="text-xs font-semibold text-fg/80">{label}</div>
      <div className="mt-1 text-sm text-fg/80">{children}</div>
    </div>
  );
}

export default function PostmortemsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs text-fg/70 shadow-soft backdrop-blur">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-brand2" />
          Reliability analysis • root cause analysis • prevention
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-fg">Postmortems</h1>

        <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted">
          Incident analysis written for clarity: what happened, why it happened, what changed, and how we prevent recurrence.
        </p>

        {/* Summary strip */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <div className="text-xs text-muted">Coverage</div>
            <div className="mt-1 text-sm font-semibold text-fg">Rollouts, queues, idempotency</div>
            <div className="mt-1 text-xs text-muted">Detection signals and fixes described in production terms.</div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <div className="text-xs text-muted">How to read</div>
            <div className="mt-1 text-sm font-semibold text-fg">Detection → Root cause → Fix</div>
            <div className="mt-1 text-xs text-muted">Prevention measures are the permanent changes section.</div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <div className="text-xs text-muted">Severity</div>
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge tone="bad">SEV-1</Badge>
              <Badge tone="warn">SEV-2</Badge>
              <Badge tone="good">SEV-3</Badge>
            </div>
            <div className="mt-1 text-xs text-muted">Severity reflects user impact and time-sensitivity.</div>
          </div>
        </div>
      </header>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      <section className="grid gap-4 md:grid-cols-2 items-stretch [grid-auto-rows:1fr]" aria-label="Postmortems list">
        {incidents.map((i) => (
          <Card key={i.title} className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="truncate text-sm font-semibold text-fg">{i.title}</div>
                  <div className="text-sm text-muted text-pretty">{i.impact}</div>
                </div>

                <div className="shrink-0">
                  <Badge tone={toneForSev(i.severity)}>{i.severity}</Badge>
                </div>
              </div>

              {/* micro “signals” row */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] font-semibold text-fg/70">
                  Detection: alerts
                </span>
                <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] font-semibold text-fg/70">
                  Scope: production
                </span>
                <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] font-semibold text-fg/70">
                  Type: reliability
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid gap-3">
                <SectionBlock label="Detection">{i.detection}</SectionBlock>
                <SectionBlock label="Root cause">{i.rootCause}</SectionBlock>
                <SectionBlock label="Fix">{i.fix}</SectionBlock>
              </div>

              <div className={cn("rounded-2xl border border-border/70 p-4", "bg-gradient-to-r from-brand/[0.10] to-brand2/[0.10]")}>
                <div className="text-xs font-semibold text-fg/80">Prevention</div>
                <ul className="mt-2 space-y-2" role="list">
                  {i.prevention.map((p) => (
                    <DotBullet key={p}>{p}</DotBullet>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="rounded-3xl border border-border/70 bg-card/70 p-5 text-xs text-muted shadow-soft backdrop-blur">
        Note: Examples are written without proprietary details. The goal is to demonstrate operational maturity:
        error budgets, safe rollouts, instrumentation, and recurrence prevention.
      </div>
    </div>
  );
}

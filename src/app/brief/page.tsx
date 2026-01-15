import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { caseStudies, signatureMetrics, professionalSummary } from "@/lib/content";

export const metadata: Metadata = {
  title: "Brief",
  // Avoid indexing tons of query variants
  robots: { index: false, follow: false }
};

type Search = { intent?: string; cs?: string | string[] };

function asArray(v: string | string[] | undefined) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default function BriefPage({ searchParams }: { searchParams: Search }) {
  const intent = (searchParams.intent ?? "RECRUITER").toUpperCase();
  const cs = asArray(searchParams.cs).slice(0, 3);

  const picked = cs
    .map((slug) => caseStudies.find((c) => c.slug === slug))
    .filter(Boolean);

  const headline =
    intent === "ENGINEER"
      ? "Engineering brief — decisions, tradeoffs, proof"
      : "Hiring brief — high signal in under 90 seconds";

  const nextSteps =
    intent === "ENGINEER"
      ? [
          { href: "/case-studies", label: "Open deep dives" },
          { href: "/console", label: "Engineering console" },
          { href: "/evidence", label: "Evidence / receipts" }
        ]
      : [
          { href: "/start", label: "2-minute tour" },
          { href: "/work", label: "Work timeline" },
          { href: "/evidence", label: "Evidence / receipts" }
        ];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs text-fg/70 shadow-soft backdrop-blur">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-brand2" />
          Shareable packet • {intent === "ENGINEER" ? "engineering" : "hiring"} mode
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-fg">{headline}</h1>
        <p className="max-w-3xl text-sm text-muted">{professionalSummary}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-fg">Selected case studies</div>
                <div className="mt-1 text-sm text-muted">Only the highest-signal projects.</div>
              </div>
              <Badge tone={picked.length ? "good" : "warn"}>{picked.length ? `${picked.length} included` : "none"}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {picked.length === 0 ? (
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4 text-sm text-muted">
                No case studies selected. Go back and generate a brief from the builder.
                <div className="mt-3">
                  <Link className="text-fg/70 hover:text-fg" href="/">
                    ← Back home
                  </Link>
                </div>
              </div>
            ) : (
              picked.map((c) => (
                <Link key={c!.slug} href={`/case-studies/${c!.slug}`} className="block">
                  <div className="rounded-2xl border border-border/70 bg-card/60 p-4 transition hover:bg-fg/[0.02]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-fg">{c!.title}</div>
                        <div className="mt-1 clamp-2 text-sm text-muted">{c!.summary}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {c!.tags.slice(0, 6).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-medium text-fg/70"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-fg/70">Open →</div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-fg">Signature metrics</div>
            <div className="mt-1 text-sm text-muted">Fast credibility anchors.</div>
          </CardHeader>
          <CardContent className="space-y-2">
            {signatureMetrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3"
              >
                <div className="text-xs text-muted">{m.label}</div>
                <div className="font-mono text-xs font-semibold text-fg">{m.value}</div>
              </div>
            ))}

            <div className="pt-2 text-xs text-muted">
              Next steps:
              <div className="mt-2 flex flex-col gap-2">
                {nextSteps.map((x) => (
                  <Link key={x.href} href={x.href} className="text-fg/70 hover:text-fg">
                    {x.label} →
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="text-xs text-muted">
        Tip: This page is intentionally <span className="font-mono text-fg/80">noindex</span> to avoid SEO duplicates from query variants.
      </div>
    </div>
  );
}

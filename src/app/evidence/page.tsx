import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { evidenceLinks } from "@/lib/content";
import { EvidenceClient } from "./sections";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Evidence" };

function getHost(u: string) {
  try {
    return new URL(u).host;
  } catch {
    // relative link
    return u.startsWith("/") ? "site" : u;
  }
}

function ExternalCard({ title, href }: { title: string; href: string }) {
  const host = getHost(href);
  const external = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn("block rounded-3xl outline-none", "focus-visible:ring-4 focus-visible:ring-brand/15")}
      aria-label={`Open ${title}${external ? ` (${host}) in a new tab` : ""}`}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-fg">{title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{host}</Badge>
                {external ? <Badge tone="neutral">external</Badge> : <Badge tone="neutral">internal</Badge>}
              </div>
            </div>

            <div className="shrink-0 text-xs font-semibold text-fg/70">
              <span className="inline-flex items-center gap-1">
                Open <span aria-hidden="true" className="transition group-hover:translate-x-0.5">↗</span>
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div className="text-sm text-muted">
            Performance audits, reports, and documentation
          </div>
          <div className="text-sm font-semibold text-fg/70">→</div>
        </CardContent>
      </Card>
    </a>
  );
}

export default function EvidencePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs text-fg/70 shadow-soft backdrop-blur">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-brand2" />
          Proof-first • observability • performance signals
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-fg">Evidence</h1>

        <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted">
          This page contains the proof: performance audits, live Web Vitals, and supporting artifacts. The rest of the portfolio stays focused—this is where you&apos;ll find the detailed evidence.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <div className="text-xs text-muted">What you can verify</div>
            <div className="mt-1 text-sm font-semibold text-fg">Performance and stability</div>
            <div className="mt-1 text-xs text-muted">Core Web Vitals and lab audits, presented clearly without clutter.</div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <div className="text-xs text-muted">How to use</div>
            <div className="mt-1 text-sm font-semibold text-fg">Optional deep dive</div>
            <div className="mt-1 text-xs text-muted">Browse the links first, then check live signals if you need more detail.</div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <div className="text-xs text-muted">Best practice</div>
            <div className="mt-1 text-sm font-semibold text-fg">Trust through artifacts</div>
            <div className="mt-1 text-xs text-muted">Evidence complements the case studies—it doesn&apos;t replace the narrative.</div>
          </div>
        </div>
      </header>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      <section className="space-y-4" aria-label="Evidence links">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">Artifacts</h2>
            <p className="mt-1 text-sm text-muted">Performance audits, reports, and supporting documentation.</p>
          </div>
          <div className="text-sm text-fg/70">Open ↗</div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
          {evidenceLinks.map((e) => (
            <ExternalCard key={e.href} title={e.title} href={e.href} />
          ))}
        </div>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      <section className="space-y-3" aria-label="Live evidence">
        <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">Live signals</h2>
            <p className="mt-1 text-sm text-muted">Web Vitals, lab audits, and field performance data. Capture a snapshot if you need shareable proof.</p>
        </div>

        {/* compact = no duplicate heading inside */}
        <EvidenceClient siteUrl={site.url} compact />
      </section>
    </div>
  );
}

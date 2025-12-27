"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { useIntent } from "@/components/IntentProvider";
import { caseStudies, professionalSummary, signatureMetrics, work } from "@/lib/content";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs text-fg/70 shadow-soft backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-brand2" />
      {children}
    </div>
  );
}

export function StartView() {
  const { intent } = useIntent();
  const featured = caseStudies.slice(0, 2);

  // Adapt content WITHOUT saying “recruiter/hiring manager lens”
  const focus =
    intent === "RECRUITER"
      ? {
          title: "Fast scan. High signal. Minimal noise.",
          bullets: [
            "Two deep dives show scale, reliability, and proof quickly.",
            "Work timeline is progressive disclosure — scan first, expand only if needed.",
            "Evidence is optional: live Web Vitals + audits + receipts."
          ]
        }
      : {
          title: "Clear decisions, tradeoffs, and proof.",
          bullets: [
            "Case studies explain constraints → design choices → outcomes → tradeoffs.",
            "Work timeline shows consistency across stacks and environments.",
            "Evidence provides live Web Vitals and supporting artifacts without clutter."
          ]
        };

  return (
    <div className="space-y-10">
      {/* HERO (looks like a product page, not a blog) */}
      <section className="grid gap-6 md:grid-cols-12 md:items-start">
        <div className="md:col-span-7 space-y-5">
          <Pill>2-minute scan • decisions • proof</Pill>

          <h1 className="text-4xl font-semibold tracking-tight text-fg md:text-5xl leading-[1.06] text-balance motion-safe:animate-fade-up">
            The fastest way to understand my work.
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-muted text-pretty">
            {professionalSummary}
          </p>

          <Card className="motion-safe:animate-fade-up">
            <CardHeader>
              <div className="text-sm font-semibold text-fg">{focus.title}</div>
              <div className="mt-1 text-sm text-muted">Designed for a confident decision in minutes.</div>
            </CardHeader>
            <CardContent className="text-sm text-fg/80">
              <ul className="list-disc space-y-1 pl-5">
                {focus.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-fg/70">
                <Link href="/case-studies" className="hover:text-fg">Case studies →</Link>
                <Link href="/work" className="hover:text-fg">Work →</Link>
                <Link href="/evidence" className="hover:text-fg">Evidence →</Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:col-span-5 md:sticky md:top-24 space-y-4">
          <Card>
            <CardHeader>
              <div className="text-sm font-semibold text-fg">Signature metrics</div>
              <div className="mt-1 text-sm text-muted">Consistent targets across environments.</div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {signatureMetrics.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 p-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs text-muted">{m.label}</div>
                    <div className="font-mono text-sm font-semibold text-fg">{m.value}</div>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-brand/[0.15] to-brand2/[0.12] border border-border/60" />
                </div>
              ))}
              <div className="pt-1 text-xs text-muted">
                Tip: press <span className="font-mono text-fg/80">Shift + D</span> for live metrics overlay.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* FEATURED DEEP DIVES */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">Featured deep dives</h2>
            <p className="mt-1 text-sm text-muted">Two projects that best show performance and rollout safety.</p>
          </div>
          <Link href="/case-studies" className="text-sm text-fg/70 hover:text-fg">
            View all →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 items-stretch [grid-auto-rows:1fr]">
          {featured.map((c) => (
            <CaseStudyCard
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              title={c.title}
              summary={c.summary}
              timeline={c.timeline}
              tags={c.tags}
              bullets={c.highlights}
            />
          ))}
        </div>
      </section>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* WORK TIMELINE (progressive disclosure) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">Work timeline</h2>
            <p className="mt-1 text-sm text-muted">Top signal first. Expand only if you need full detail.</p>
          </div>
          <Link href="/work" className="text-sm text-fg/70 hover:text-fg">
            Full timeline →
          </Link>
        </div>

        <div className="space-y-3">
          {work.map((w) => (
            <Card key={w.company + w.title}>
              <CardHeader>
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-fg">{w.title}</div>
                    <div className="text-sm text-muted">
                      {w.company}
                      {w.location ? ` • ${w.location}` : ""}
                    </div>
                  </div>
                  <div className="text-xs text-muted">
                    {w.start} — {w.end}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="text-sm text-fg/80">
                <ul className="list-disc space-y-1 pl-5">
                  {w.bullets.slice(0, 2).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-fg/70 hover:text-fg">
                    Show more
                  </summary>
                  <div className="mt-2 grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
                    <ul className="list-disc space-y-1 pl-5">
                      {w.bullets.slice(2).map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <div>
                      <div className="text-xs text-muted">Stack</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {w.stack.slice(0, 12).map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] font-medium text-fg/80"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

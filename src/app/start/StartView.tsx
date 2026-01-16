"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Reveal } from "@/components/ui/Reveal";
import { useIntent } from "@/components/IntentProvider";
import { caseStudies, professionalSummary, signatureMetrics, work } from "@/lib/content";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-r-btn border border-border bg-surface px-3 py-2 text-xs text-fg/70 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
        title: "Quick scan. High signal. Clear focus.",
        bullets: [
          "Two case studies demonstrate scale, reliability, and measurable outcomes.",
          "Work timeline uses progressive disclosure — scan the highlights first, expand for details when needed.",
          "Evidence is available when you want it: live Web Vitals, audits, and supporting documentation."
        ]
      }
      : {
        title: "Clear decisions, thoughtful tradeoffs, and measurable proof.",
        bullets: [
          "Case studies walk through constraints, design choices, outcomes, and tradeoffs.",
          "Work timeline demonstrates consistency across different stacks and environments.",
          "Evidence provides live Web Vitals and supporting artifacts in a focused format."
        ]
      };

  return (
    <div className="space-y-0">
      {/* HERO (looks like a product page, not a blog) */}
      <Reveal>
        <section className="grid gap-6 md:grid-cols-12 md:items-start py-16 md:py-24">
          <div className="md:col-span-7 space-y-5 sm:space-y-6">
            <Pill>2-minute overview • clear decisions • backed by proof</Pill>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-[1.07] text-balance max-w-prose relative pl-4">
              <div className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-gradient-to-b from-secondary to-warm" />
              <span className="relative">The fastest way to understand what I build and how I work.</span>
            </h1>

            <p className="text-[15px] sm:text-base leading-7 text-muted max-w-prose text-pretty mt-4">
              {professionalSummary}
            </p>

            <Card className="motion-safe:animate-fade-up border-primary/20 bg-primary-tint/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="text-sm font-semibold text-fg">{focus.title}</div>
                </div>
                <div className="mt-2 text-sm text-fg/80 leading-6">Designed to help you make a confident decision quickly.</div>
              </CardHeader>
              <CardContent className="text-sm text-fg/80 leading-7">
                <ul className="list-disc space-y-2 pl-5">
                  {focus.bullets.map((b) => (
                    <li key={b} className="break-words">{b}</li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-fg/70">
                  <Link href="/case-studies" className="relative hover:text-primary transition-colors duration-[280ms] ease-out">
                    Case studies →
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 bg-gradient-to-r from-transparent via-secondary/60 to-transparent transition-transform duration-[280ms] ease-out hover:scale-x-100" />
                  </Link>
                  <Link href="/work" className="relative hover:text-primary transition-colors duration-[280ms] ease-out">
                    Work →
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 bg-gradient-to-r from-transparent via-secondary/60 to-transparent transition-transform duration-[280ms] ease-out hover:scale-x-100" />
                  </Link>
                  <Link href="/evidence" className="relative hover:text-primary transition-colors duration-[280ms] ease-out">
                    Evidence →
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 bg-gradient-to-r from-transparent via-secondary/60 to-transparent transition-transform duration-[280ms] ease-out hover:scale-x-100" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:col-span-5 md:sticky md:top-24 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold text-fg">Signature metrics</div>
                <div className="mt-1 text-sm text-muted">Performance targets I consistently achieve across all environments.</div>
              </CardHeader>
              <CardContent className="grid gap-3">
                {signatureMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 sm:p-5"
                  >
                    <div className="space-y-1">
                      <div className="text-xs text-fg/80 leading-6">{m.label}</div>
                      <div className="font-mono text-sm font-semibold text-fg">{m.value}</div>
                    </div>
                    <div className="h-10 w-10 shrink-0 rounded-r-btn bg-primary-tint/10 border border-border" />
                  </div>
                ))}
                <div className="pt-4 text-xs text-fg/80 leading-6">
                  Tip: press <span className="font-mono text-fg">Shift + D</span> for live metrics overlay.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </Reveal>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      {/* FEATURED DEEP DIVES */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">Featured case studies</h2>
            <p className="mt-1 text-sm text-muted">Two projects that best demonstrate performance improvements and safe rollout practices.</p>
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
      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      {/* WORK TIMELINE (progressive disclosure) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4 mt-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">Work timeline</h2>
            <p className="mt-1 text-sm text-muted">Highlights first. Expand for full details when you need them.</p>
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

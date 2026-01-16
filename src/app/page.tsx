import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { IntentBanner } from "@/components/IntentBanner";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { caseStudies, professionalSummary, signatureMetrics } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center rounded-sm border border-border bg-surface px-2 py-0.5",
        "font-mono text-[11px] font-semibold text-fg/70"
      )}
    >
      {children}
    </kbd>
  );
}

function PrimaryCtaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-r-btn px-5 py-2.5",
        "text-sm font-semibold text-white transition-all duration-[280ms] ease-out",
        "bg-gradient-to-r from-primary to-secondary",
        "sheen",
        "motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-glow",
        "motion-safe:active:translate-y-[1px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      )}
    >
      {children}
    </Link>
  );
}

function SecondaryCtaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center rounded-r-btn px-5 py-2.5",
        "border border-border bg-surface text-sm font-semibold text-fg transition-all duration-[280ms] ease-out",
        "motion-safe:hover:-translate-y-[1px] motion-safe:hover:border-primary/25 motion-safe:hover:bg-surface-2 motion-safe:hover:shadow-sm",
        "motion-safe:active:translate-y-[1px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      )}
    >
      {children}
    </Link>
  );
}

function SignalTile({
  title,
  desc,
  href,
  meta,
  accent = "from-primary-tint/12 to-secondary-tint/8"
}: {
  title: string;
  desc: string;
  href: string;
  meta?: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="h-full group" interactive={false}>
      <Link href={href} className="block h-full" aria-label={`Open ${title}`}>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="text-base font-semibold text-fg leading-6 break-words">{title}</div>
              <div className="text-sm text-fg/80 leading-7 break-words">{desc}</div>
            </div>

            <div
              aria-hidden="true"
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-r-btn border border-primary/20 bg-primary-tint/5 text-fg/75 transition-all duration-[280ms] ease-out",
                "group-hover:bg-primary-tint/10 group-hover:border-primary/40 group-hover:text-primary"
              )}
            >
              →
            </div>
          </div>

          {meta ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-fg/70 leading-5">{meta}</div>
          ) : null}

          <div
            aria-hidden="true"
            className={cn("mt-5 h-2 w-full overflow-hidden rounded-full bg-fg/[0.06]")}
          >
            <div className={cn("h-full w-[55%] rounded-full bg-gradient-to-r", accent || "from-primary/70 to-secondary/60")} />
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default function HomePage() {
  const top = caseStudies.slice(0, 2);

  return (
    <div className="space-y-0">
      {/* HERO */}
      <Section className="grid gap-6 md:grid-cols-12 md:items-start" aria-label="Hero">
        <div className="space-y-6 md:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-r-btn border border-border bg-surface px-3 py-2 text-xs text-fg/70 shadow-sm">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
              Clear narrative • progressive proof • quick scanning
            </div>

            <div className="inline-flex items-center gap-2 rounded-r-btn border border-border bg-surface px-3 py-2 text-xs text-fg/70">
              Jump anywhere with <Kbd>⌘K</Kbd> / <Kbd>Ctrl+K</Kbd>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-[1.07] text-balance max-w-prose relative">
            <span className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-primary to-secondary" />
            <span className="relative">A portfolio built for speed — backed by measurable proof.</span>
          </h1>

          <p className="text-[15px] sm:text-base leading-7 text-muted max-w-prose text-pretty mt-4">
            {professionalSummary}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <PrimaryCtaLink href="/start">
              Take the 2-minute tour <span aria-hidden="true">→</span>
            </PrimaryCtaLink>

            <SecondaryCtaLink href="/case-studies">Browse case studies</SecondaryCtaLink>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted" aria-label="Quick links">
            <Link href="/work" className="relative hover:text-primary transition-colors duration-[280ms] ease-out">
              Work
              <span className="absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-transform duration-[280ms] ease-out group-hover:scale-x-100" />
            </Link>
            <Link href="/evidence" className="relative hover:text-primary transition-colors duration-[280ms] ease-out">
              Evidence
              <span className="absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-transform duration-[280ms] ease-out group-hover:scale-x-100" />
            </Link>
            <Link href="/postmortems" className="relative hover:text-primary transition-colors duration-[280ms] ease-out">
              Postmortems
              <span className="absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-transform duration-[280ms] ease-out group-hover:scale-x-100" />
            </Link>
            <Link href="/console" className="relative hover:text-primary transition-colors duration-[280ms] ease-out">
              Console
              <span className="absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-transform duration-[280ms] ease-out group-hover:scale-x-100" />
            </Link>
          </div>

          {/* "What to do next" strip (high-signal UX) */}
          <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-4">
            <div className="rounded-r-card border border-primary/20 bg-primary-tint/5 p-5 sm:p-6 hover:border-primary/30 hover:bg-primary-tint/10 transition-all duration-[280ms] ease-out">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <div className="text-xs text-fg/60 leading-6">Short on time?</div>
              </div>
              <div className="mt-2 text-sm font-semibold text-fg leading-6">Start with the first case study</div>
              <div className="mt-2 text-xs text-fg/80 leading-6">Quickest way to understand scope and outcomes.</div>
            </div>

            <div className="rounded-r-card border border-secondary/20 bg-secondary-tint/5 p-5 sm:p-6 hover:border-secondary/30 hover:bg-secondary-tint/10 transition-all duration-[280ms] ease-out">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <div className="text-xs text-fg/60 leading-6">Want the full picture?</div>
              </div>
              <div className="mt-2 text-sm font-semibold text-fg leading-6">Browse the Work timeline</div>
              <div className="mt-2 text-xs text-fg/80 leading-6">Progressive disclosure — expand for details when you need them.</div>
            </div>

            <div className="rounded-r-card border border-warm/20 bg-warm-tint/5 p-5 sm:p-6 hover:border-warm/30 hover:bg-warm-tint/10 transition-all duration-[280ms] ease-out">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-warm" />
                <div className="text-xs text-fg/60 leading-6">Need proof?</div>
              </div>
              <div className="mt-2 text-sm font-semibold text-fg leading-6">Check Evidence and Console</div>
              <div className="mt-2 text-xs text-fg/80 leading-6">Live vitals, performance audits, health checks, and build metadata.</div>
            </div>
          </div>
        </div>

        {/* RIGHT RAIL */}
        <div className="md:col-span-5 md:sticky md:top-24 space-y-4 sm:space-y-6">
          <Card className="relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-r from-primary/15 via-secondary/12 to-warm/10 blur-2xl motion-safe:animate-[float_10s_ease-in-out_infinite]"
            />
            <CardHeader>
              <div className="text-sm font-semibold text-fg">Signature metrics</div>
              <div className="mt-1 text-sm text-muted">Consistent performance patterns across all roles and projects.</div>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              {signatureMetrics.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between rounded-r-btn border border-secondary/20 bg-secondary-tint/5 px-4 py-3 hover:border-secondary/30 hover:bg-secondary-tint/10 transition-all duration-[280ms] ease-out"
                >
                  <div className="text-xs text-fg/80 leading-6">{m.label}</div>
                  <div className="font-mono text-xs font-semibold text-fg">{m.value}</div>
                </div>
              ))}

              <div className="pt-4 text-xs text-fg/80 leading-6">
                Tip: toggle live telemetry overlay with <Kbd>Shift</Kbd> + <Kbd>D</Kbd>.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm font-semibold text-fg">Navigate efficiently</div>
              <div className="mt-1 text-sm text-fg/80 leading-6">Designed to help you make confident decisions quickly.</div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/start"
                className="rounded-r-btn border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg/70 hover:text-primary hover:bg-surface-2 hover:border-primary/30 transition-all duration-[280ms] ease-out"
              >
                Start tour →
              </Link>
              <Link
                href="/case-studies"
                className="rounded-r-btn border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg/70 hover:text-primary hover:bg-surface-2 hover:border-primary/30 transition-all duration-[280ms] ease-out"
              >
                Deep dives →
              </Link>
              <Link
                href="/console"
                className="rounded-r-btn border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg/70 hover:text-primary hover:bg-surface-2 hover:border-primary/30 transition-all duration-[280ms] ease-out"
              >
                Console →
              </Link>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Audience guidance */}
      <Reveal delayMs={0}>
        <IntentBanner />
      </Reveal>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      {/* SIGNAL STRIP (advanced UX) */}
      <Section aria-label="High-signal navigation">
        <SectionHeader
          title="Quick navigation"
          description="Fastest paths to the most relevant information."
          accent="primary"
          action={
            <div className="text-sm text-muted leading-6">
              Tip: <Kbd>⌘K</Kbd> / <Kbd>Ctrl+K</Kbd> to jump
            </div>
          }
          className="mb-8 md:mb-12"
        />

        <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 items-stretch [grid-auto-rows:1fr]">
          <SignalTile
            title="Start tour"
            desc="Guided overview: outcomes first, with details available when you need them."
            href="/start"
            meta={
              <>
                <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-fg/80 leading-5">
                  2 minutes
                </span>
                <span className="text-fg/50">•</span>
                <span className="text-[11px] text-fg/70 leading-5">best first click</span>
              </>
            }
            accent="from-primary-tint/12 to-secondary-tint/8"
          />
          <SignalTile
            title="Case studies"
            desc="Deep dives: constraints, decisions, measurable outcomes, and tradeoffs."
            href="/case-studies"
            meta={
              <>
                <span className="rounded-full border border-secondary/30 bg-secondary-tint/8 px-2.5 py-1 text-[11px] font-semibold text-fg/80 leading-5">
                  deep dives
                </span>
                <span className="text-fg/50">•</span>
                <span className="text-[11px] text-fg/70 leading-5">highest signal</span>
              </>
            }
            accent="from-secondary-tint/12 to-warm-tint/8"
          />
          <SignalTile
            title="Evidence"
            desc="Proof: performance audits, live vitals, and supporting artifacts."
            href="/evidence"
            meta={
              <>
                <span className="rounded-full border border-secondary/30 bg-secondary-tint/8 px-2.5 py-1 text-[11px] font-semibold text-fg/80 leading-5">
                  receipts
                </span>
                <span className="text-fg/50">•</span>
                <span className="text-[11px] text-fg/70 leading-5">verify claims</span>
              </>
            }
            accent="from-warm-tint/12 to-primary-tint/8"
          />
          <SignalTile
            title="Console"
            desc="Operational dashboard: health checks, build metadata, and performance signals."
            href="/console"
            meta={
              <>
                <span className="rounded-full border border-secondary/30 bg-secondary-tint/8 px-2.5 py-1 text-[11px] font-semibold text-fg/80 leading-5">
                  ops
                </span>
                <span className="text-fg/50">•</span>
                <span className="text-[11px] text-fg/70 leading-5">product thinking</span>
              </>
            }
            accent="from-primary-tint/10 to-warm-tint/8"
          />
        </div>
      </Section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      {/* FEATURED DEEP DIVES */}
      <Section theme="secondary" aria-label="Featured case studies">
        <Reveal>
          <SectionHeader
            title="Featured case studies"
            description="Two projects that best demonstrate performance improvements and safe rollout practices."
            accent="secondary"
            action={
              <Link href="/case-studies" className="relative text-sm text-muted hover:text-primary transition-colors duration-[280ms] ease-out leading-6">
                View all →
                <span className="absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 bg-gradient-to-r from-transparent via-secondary/60 to-transparent transition-transform duration-[280ms] ease-out hover:scale-x-100" />
              </Link>
            }
            className="mb-8 md:mb-12"
          />
        </Reveal>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 items-stretch [grid-auto-rows:1fr]">
          {top.map((c, idx) => (
            <Reveal key={c.slug} delayMs={idx * 70}>
              <CaseStudyCard
                key={c.slug}
                href={`/case-studies/${c.slug}`}
                title={c.title}
                summary={c.summary}
                timeline={c.timeline}
                tags={c.tags}
                bullets={c.highlights}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      {/* PROOF / TRUST (advanced UX) */}
      <Section theme="warm" aria-label="Operational proof">
        <SectionHeader
          title="Operational proof"
          description="Beyond claims — verifiable performance signals and supporting artifacts."
          accent="warm"
          action={
            <Link href="/evidence" className="relative text-sm text-muted hover:text-primary transition-colors duration-[280ms] ease-out leading-6">
              Open Evidence →
              <span className="absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 bg-gradient-to-r from-transparent via-secondary/60 to-transparent transition-transform duration-[280ms] ease-out hover:scale-x-100" />
            </Link>
          }
          className="mb-8 md:mb-12"
        />

        <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
          <Card className="border-primary/20 bg-primary-tint/5 hover:border-primary/30 hover:bg-primary-tint/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <div className="text-sm font-semibold text-fg">Health checks</div>
              </div>
              <div className="mt-2 text-sm text-fg/80 leading-6">Real-time latency and status for deployed projects.</div>
            </CardHeader>
            <CardContent className="text-sm text-fg/80 leading-7">
              Check the <span className="font-semibold text-fg">Project health</span> panel in Console.
              <div className="mt-4">
                <Link className="text-sm font-semibold text-fg hover:text-primary transition-colors duration-[280ms] ease-out underline-offset-2 hover:underline decoration-secondary/60" href="/console">
                  Open Console →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-secondary-tint/5 hover:border-secondary/30 hover:bg-secondary-tint/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <div className="text-sm font-semibold text-fg">Build metadata</div>
              </div>
              <div className="mt-2 text-sm text-fg/80 leading-6">Branch, commit, and environment information available at runtime.</div>
            </CardHeader>
            <CardContent className="text-sm text-fg/80 leading-7">
              Shows CI/CD practices and environment awareness.
              <div className="mt-4">
                <Link className="text-sm font-semibold text-fg hover:text-secondary transition-colors duration-[280ms] ease-out underline-offset-2 hover:underline decoration-secondary/60" href="/console">
                  See Build panel →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-warm/20 bg-warm-tint/5 hover:border-warm/30 hover:bg-warm-tint/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-warm" />
                <div className="text-sm font-semibold text-fg">Performance signals</div>
              </div>
              <div className="mt-2 text-sm text-fg/80 leading-6">Live Web Vitals, lab audits, and field performance data.</div>
            </CardHeader>
            <CardContent className="text-sm text-fg/80 leading-7">
              All proof is available in Evidence: performance audits, telemetry, and supporting documentation.
              <div className="mt-4">
                <Link className="text-sm font-semibold text-fg hover:text-warm transition-colors duration-[280ms] ease-out underline-offset-2 hover:underline decoration-warm/60" href="/evidence">
                  Open Live signals →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      {/* EXPLORE */}
      <Reveal>
        <Section theme="blend">
          <SectionHeader
            title="Explore"
            accent="primary"
            className="mb-8 md:mb-12"
          />
          <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 items-stretch [grid-auto-rows:1fr]" aria-label="Explore sections">
            <Reveal key="/start" delayMs={1 * 70}>
              <Card className="h-full" interactive={false}>
                <Link href="/start" className="block h-full">
                  <CardHeader>
                    <div className="text-sm font-semibold text-fg">Start</div>
                    <div className="mt-1 text-sm text-fg/80 leading-6">Guided overview designed for quick decisions.</div>
                  </CardHeader>
                  <CardContent className="text-sm text-fg/70">Open →</CardContent>
                </Link>
              </Card>
            </Reveal>

            <Reveal key="/work" delayMs={2 * 70}>
              <Card className="h-full" interactive={false}>
                <Link href="/work" className="block h-full">
                  <CardHeader>
                    <div className="text-sm font-semibold text-fg">Work</div>
                    <div className="mt-1 text-sm text-fg/80 leading-6">Professional timeline with progressive disclosure.</div>
                  </CardHeader>
                  <CardContent className="text-sm text-fg/70">Open →</CardContent>
                </Link>
              </Card>
            </Reveal>

            <Reveal key="/postmortems" delayMs={3 * 70}>
              <Card className="h-full" interactive={false}>
                <Link href="/postmortems" className="block h-full">
                  <CardHeader>
                    <div className="text-sm font-semibold text-fg">Postmortems</div>
                    <div className="mt-1 text-sm text-fg/80 leading-6">Reliability analysis: root cause, fixes, and prevention.</div>
                  </CardHeader>
                  <CardContent className="text-sm text-fg/70">Open →</CardContent>
                </Link>
              </Card>
            </Reveal>

            <Reveal key="/evidence" delayMs={4 * 70}>
              <Card className="h-full" interactive={false}>
                <Link href="/evidence" className="block h-full">
                  <CardHeader>
                    <div className="text-sm font-semibold text-fg">Evidence</div>
                    <div className="mt-1 text-sm text-fg/80 leading-6">Performance audits, live signals, and supporting artifacts.</div>
                  </CardHeader>
                  <CardContent className="text-sm text-fg/70">Open →</CardContent>
                </Link>
              </Card>
            </Reveal>
          </div>
        </Section>
      </Reveal>
    </div>
  );
}

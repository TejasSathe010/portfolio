import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { IntentBanner } from "@/components/IntentBanner";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { caseStudies, professionalSummary, signatureMetrics } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center rounded-lg border border-border/70 bg-card/60 px-2 py-0.5",
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
        "relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 py-2.5",
        "text-sm font-semibold text-white shadow-soft transition",
        "motion-safe:hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0",
        "bg-gradient-to-r from-brand via-brand2 to-brand3",
        // state layer
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition",
        "hover:after:opacity-100 active:after:opacity-100 after:bg-white/[0.10] active:after:bg-white/[0.14]"
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
        "relative inline-flex min-h-[44px] items-center justify-center rounded-2xl px-4 py-2.5",
        "border border-border/70 bg-card/70 text-sm font-semibold text-fg shadow-soft transition",
        "motion-safe:hover:-translate-y-0.5 hover:shadow-lift",
        // state layer
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition",
        "hover:after:opacity-100 active:after:opacity-100 after:bg-fg/[0.05] active:after:bg-fg/[0.08]"
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
  accent = "from-brand/[0.12] to-brand2/[0.10]"
}: {
  title: string;
  desc: string;
  href: string;
  meta?: React.ReactNode;
  accent?: string;
}) {
  return (
    <Link href={href} className="group block h-full" aria-label={`Open ${title}`}>
      <Card className="h-full">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-fg">{title}</div>
              <div className="text-sm text-muted">{desc}</div>
            </div>

            <div
              aria-hidden="true"
              className={cn(
                "grid h-9 w-9 place-items-center rounded-2xl border border-border/70 bg-card/60 text-fg/80",
                "transition",
                "group-hover:bg-fg/[0.03]",
                "relative after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition",
                "group-hover:after:opacity-100 after:bg-fg/[0.04]"
              )}
            >
              →
            </div>
          </div>

          {meta ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-fg/70">{meta}</div>
          ) : null}

          <div
            aria-hidden="true"
            className={cn("mt-4 h-2 w-full overflow-hidden rounded-full bg-fg/[0.06]")}
          >
            <div className={cn("h-full w-[55%] rounded-full bg-gradient-to-r", accent)} />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const top = caseStudies.slice(0, 2);

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="grid gap-6 md:grid-cols-12 md:items-start" aria-label="Hero">
        <div className="space-y-6 md:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs text-fg/70 shadow-soft backdrop-blur">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-brand2" />
              Clean narrative • progressive proof • fast scan
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-xs text-fg/70">
              Jump anywhere with <Kbd>⌘K</Kbd> / <Kbd>Ctrl+K</Kbd>
            </div>
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            A portfolio designed for speed — and backed by proof.
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted">
            {professionalSummary}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <PrimaryCtaLink href="/start">
              Start 2-minute tour <span aria-hidden="true">→</span>
            </PrimaryCtaLink>

            <SecondaryCtaLink href="/case-studies">Browse case studies</SecondaryCtaLink>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg/70" aria-label="Quick links">
            <Link href="/work" className="hover:text-fg">
              Work
            </Link>
            <Link href="/evidence" className="hover:text-fg">
              Evidence
            </Link>
            <Link href="/postmortems" className="hover:text-fg">
              Postmortems
            </Link>
            <Link href="/console" className="hover:text-fg">
              Console
            </Link>
          </div>

          {/* “What to do next” strip (high-signal UX) */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
              <div className="text-xs text-muted">If you’re short on time</div>
              <div className="mt-1 text-sm font-semibold text-fg">Open the first deep dive</div>
              <div className="mt-1 text-xs text-muted">Fastest path to scope + outcomes.</div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
              <div className="text-xs text-muted">If you want breadth</div>
              <div className="mt-1 text-sm font-semibold text-fg">Scan Work timeline</div>
              <div className="mt-1 text-xs text-muted">Progressive disclosure; expand only when needed.</div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
              <div className="text-xs text-muted">If you want receipts</div>
              <div className="mt-1 text-sm font-semibold text-fg">Use Evidence + Console</div>
              <div className="mt-1 text-xs text-muted">Vitals, audits, health, build metadata.</div>
            </div>
          </div>
        </div>

        {/* RIGHT RAIL */}
        <div className="md:col-span-5 md:sticky md:top-24 space-y-4">
          <Card className="relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-r from-brand/20 via-brand2/18 to-brand3/18 blur-2xl motion-safe:animate-[float_10s_ease-in-out_infinite]"
            />
            <CardHeader>
              <div className="text-sm font-semibold text-fg">Signature metrics</div>
              <div className="mt-1 text-sm text-muted">Patterns that repeat across roles and projects.</div>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
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
                Tip: toggle live telemetry overlay with <Kbd>Shift</Kbd> + <Kbd>D</Kbd>.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm font-semibold text-fg">Navigate like a product</div>
              <div className="mt-1 text-sm text-muted">Designed for fast, confident decisions.</div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Link
                href="/start"
                className="rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
              >
                Start tour →
              </Link>
              <Link
                href="/case-studies"
                className="rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
              >
                Deep dives →
              </Link>
              <Link
                href="/console"
                className="rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
              >
                Console →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Audience guidance */}
      <Reveal delayMs={0}>
        <IntentBanner />
      </Reveal>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* SIGNAL STRIP (advanced UX) */}
      <section className="space-y-4" aria-label="High-signal navigation">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">High-signal shortcuts</h2>
            <p className="mt-1 text-sm text-muted">The fastest way to get to the best evidence.</p>
          </div>
          <div className="text-sm text-fg/70">
            Tip: <Kbd>⌘K</Kbd> / <Kbd>Ctrl+K</Kbd> to jump
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 items-stretch [grid-auto-rows:1fr]">
          <SignalTile
            title="Start tour"
            desc="Guided scan: outcomes first, details only when needed."
            href="/start"
            meta={
              <>
                <span className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-semibold">
                  2 minutes
                </span>
                <span className="text-fg/50">•</span>
                <span className="text-[11px]">best first click</span>
              </>
            }
            accent="from-brand/[0.16] to-brand2/[0.12]"
          />
          <SignalTile
            title="Case studies"
            desc="Constraints → decisions → measurable outcomes → tradeoffs."
            href="/case-studies"
            meta={
              <>
                <span className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-semibold">
                  deep dives
                </span>
                <span className="text-fg/50">•</span>
                <span className="text-[11px]">highest signal</span>
              </>
            }
            accent="from-brand2/[0.16] to-brand3/[0.12]"
          />
          <SignalTile
            title="Evidence"
            desc="Receipts: audits, live vitals, artifacts without clutter."
            href="/evidence"
            meta={
              <>
                <span className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-semibold">
                  receipts
                </span>
                <span className="text-fg/50">•</span>
                <span className="text-[11px]">verify claims</span>
              </>
            }
            accent="from-brand3/[0.16] to-brand/[0.12]"
          />
          <SignalTile
            title="Console"
            desc="Operational proof: health checks, build meta, performance signals."
            href="/console"
            meta={
              <>
                <span className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-semibold">
                  ops
                </span>
                <span className="text-fg/50">•</span>
                <span className="text-[11px]">product thinking</span>
              </>
            }
            accent="from-brand/[0.14] to-brand3/[0.12]"
          />
        </div>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* FEATURED DEEP DIVES */}
      <section className="space-y-4" aria-label="Featured case studies">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-fg">Featured deep dives</h2>
              <p className="mt-1 text-sm text-muted">Two projects that best show performance and rollout safety.</p>
            </div>
            <Link href="/case-studies" className="text-sm text-fg/70 hover:text-fg">
              View all →
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 items-stretch [grid-auto-rows:1fr]">
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
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* PROOF / TRUST (advanced UX) */}
      <section className="space-y-4" aria-label="Operational proof">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">Operational proof</h2>
            <p className="mt-1 text-sm text-muted">Not just claims — verifiable signals and artifacts.</p>
          </div>
          <Link href="/evidence" className="text-sm text-fg/70 hover:text-fg">
            Open Evidence →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
          <Card>
            <CardHeader>
              <div className="text-sm font-semibold text-fg">Health checks</div>
              <div className="mt-1 text-sm text-muted">Latency + status for deployed projects.</div>
            </CardHeader>
            <CardContent className="text-sm text-fg/70">
              View the <span className="font-semibold text-fg">Project health</span> panel in Console.
              <div className="mt-3">
                <Link className="text-sm font-semibold text-fg/80 hover:text-fg" href="/console">
                  Open Console →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm font-semibold text-fg">Build metadata</div>
              <div className="mt-1 text-sm text-muted">Branch/commit/env surfaced at runtime.</div>
            </CardHeader>
            <CardContent className="text-sm text-fg/70">
              Demonstrates CI/CD hygiene and environment awareness.
              <div className="mt-3">
                <Link className="text-sm font-semibold text-fg/80 hover:text-fg" href="/console">
                  See Build panel →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm font-semibold text-fg">Performance signals</div>
              <div className="mt-1 text-sm text-muted">Live vitals + lab audits + field p75.</div>
            </CardHeader>
            <CardContent className="text-sm text-fg/70">
              Proof lives in Evidence: audits, telemetry, and receipts.
              <div className="mt-3">
                <Link className="text-sm font-semibold text-fg/80 hover:text-fg" href="/evidence">
                  Open Live signals →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* EXPLORE */}
      <Reveal>
        <section className="grid gap-4 md:grid-cols-4 items-stretch [grid-auto-rows:1fr]" aria-label="Explore sections">
          <Reveal key="/start" delayMs={1 * 70}>
            <Link href="/start" className="block">
              <Card className="h-full">
                <CardHeader>
                  <div className="text-sm font-semibold text-fg">Start</div>
                  <div className="mt-1 text-sm text-muted">Guided scan built for fast decisions.</div>
                </CardHeader>
                <CardContent className="text-sm text-fg/70">Open →</CardContent>
              </Card>
            </Link>
          </Reveal>

          <Reveal key="/work" delayMs={2 * 70}>
            <Link href="/work" className="block">
              <Card className="h-full">
                <CardHeader>
                  <div className="text-sm font-semibold text-fg">Work</div>
                  <div className="mt-1 text-sm text-muted">Timeline with progressive disclosure.</div>
                </CardHeader>
                <CardContent className="text-sm text-fg/70">Open →</CardContent>
              </Card>
            </Link>
          </Reveal>

          <Reveal key="/postmortems" delayMs={3 * 70}>
            <Link href="/postmortems" className="block">
              <Card className="h-full">
                <CardHeader>
                  <div className="text-sm font-semibold text-fg">Postmortems</div>
                  <div className="mt-1 text-sm text-muted">Reliability thinking: RCA → fixes → prevention.</div>
                </CardHeader>
                <CardContent className="text-sm text-fg/70">Open →</CardContent>
              </Card>
            </Link>
          </Reveal>

          <Reveal key="/evidence" delayMs={3 * 70}>
            <Link href="/evidence" className="block">
              <Card className="h-full">
                <CardHeader>
                  <div className="text-sm font-semibold text-fg">Evidence</div>
                  <div className="mt-1 text-sm text-muted">Audits, live signals, artifacts, receipts.</div>
                </CardHeader>
                <CardContent className="text-sm text-fg/70">Open →</CardContent>
              </Card>
            </Link>
          </Reveal>
        </section>
      </Reveal>
    </div>
  );
}

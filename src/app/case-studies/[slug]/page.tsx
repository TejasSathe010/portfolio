import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { caseStudies } from "@/lib/content";
import { site } from "@/lib/site";
import { absoluteUrl, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ArchitectureSection } from "@/components/caseStudies/ArchitectureSection";
import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { IntentNote } from "./sections";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { deriveKeyMetrics } from "@/lib/keyMetrics";
import { KeyMetricsRow } from "@/components/caseStudies/KeyMetricsRow";
import { Button } from "@/components/ui/Button";
import type { CSSProperties } from "react";
import { VTLink } from "@/components/VTLink";

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cs = caseStudies.find((c) => c.slug === params.slug);
  if (!cs) return {};
  const url = absoluteUrl(`/case-studies/${cs.slug}`, site.url);
  return {
    title: cs.title,
    description: cs.summary,
    alternates: { canonical: url },
    openGraph: { title: cs.title, description: cs.summary, url }
  };
}

function HeaderRow({ title, desc, anchorId }: { title: string; desc?: string; anchorId: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <div className="text-sm font-semibold text-fg">{title}</div>
        {desc ? <div className="text-sm text-muted">{desc}</div> : null}
      </div>
      <CopyLinkButton anchorId={anchorId} />
    </div>
  );
}

function LinkButton({
  href,
  variant = "secondary",
  children
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex min-h-[44px] items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
        "shadow-soft motion-safe:hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition hover:after:opacity-100 active:after:opacity-100",
        variant === "primary" &&
          "text-white bg-gradient-to-r from-brand via-brand2 to-brand3 after:bg-white/[0.10] active:after:bg-white/[0.14]",
        variant === "secondary" &&
          "border border-border/70 bg-card/70 text-fg after:bg-fg/[0.05] active:after:bg-fg/[0.08]"
      )}
    >
      {children}
    </Link>
  );
}

function PillNav() {
  const items = [
    { href: "#overview", label: "Overview" },
    { href: "#intent", label: "Context" },
    { href: "#architecture", label: "Architecture" },
    { href: "#problem", label: "Problem" },
    { href: "#approach", label: "Approach" },
    { href: "#outcomes", label: "Outcomes" },
    { href: "#tradeoffs", label: "Tradeoffs" }
  ];

  return (
    <nav aria-label="On this page" className="mt-4">
      <div className="flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        {items.map((it) => (
          <a
            key={it.href}
            href={it.href}
            className="whitespace-nowrap rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-[11px] font-semibold text-fg/75 shadow-soft transition
                       hover:bg-fg/[0.03]"
          >
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = caseStudies.find((c) => c.slug === params.slug);
  if (!cs) return notFound();

  type VTStyle = CSSProperties & { viewTransitionName?: string };
  const heroStyle: VTStyle = { viewTransitionName: `cs-card-${cs.slug}` };
  const titleStyle: VTStyle = { viewTransitionName: `cs-title-${cs.slug}` };
  const tagsStyle: VTStyle = { viewTransitionName: `cs-tags-${cs.slug}` };

  const metrics = deriveKeyMetrics(cs);

  const idx = caseStudies.findIndex((c) => c.slug === cs.slug);
  const prev = idx > 0 ? caseStudies[idx - 1] : null;
  const next = idx >= 0 && idx < caseStudies.length - 1 ? caseStudies[idx + 1] : null;

  return (
    <div className="space-y-8">
      {/* HERO */}
      <header id="overview" className="space-y-4 scroll-mt-28" style={heroStyle}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 font-semibold text-fg/70">
            {cs.timeline}
          </span>
          <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 font-semibold text-fg/70">
            {cs.role}
          </span>
          <div className="ml-auto hidden sm:block">
            <CopyLinkButton anchorId="overview" label="Copy page link" />
          </div>
        </div>

        <h1 style={titleStyle} className="text-balance text-2xl font-semibold tracking-tight text-fg md:text-3xl lg:text-4xl leading-tight break-words">
          {cs.title}
        </h1>

        <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted break-words">{cs.summary}</p>

        <div className="flex flex-wrap items-center gap-2 pt-1" style={tagsStyle}>
          {cs.tags.slice(0, 10).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/70 bg-gradient-to-r from-brand/[0.10] to-brand2/[0.10] px-3 py-1 text-[11px] font-medium text-fg/80"
            >
              {t}
            </span>
          ))}
          {cs.tags.length > 10 ? (
            <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] font-medium text-fg/70">
              +{cs.tags.length - 10}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <EvidenceDrawer title="Evidence" items={cs.evidence} />
          {cs.pdfPath ? (
            <a
              href={cs.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-4 py-2.5 text-sm font-semibold text-fg transition shadow-soft hover:bg-fg/[0.03] hover:shadow-lift motion-safe:hover:-translate-y-0.5"
            >
              <span>📄</span>
              <span>View PDF</span>
              <span className="text-xs opacity-60">↗</span>
            </a>
          ) : null}
          <Button asChild variant="secondary">
            <Link href="/case-studies">Back to list</Link>
          </Button>
        </div>

        {/* Key metrics (auto-derived) */}
        <div className="pt-2">
          <KeyMetricsRow metrics={metrics} />
        </div>

        {/* On this page */}
        <PillNav />
      </header>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Intent notes */}
      <section id="intent" className="scroll-mt-28 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-fg">Context notes</div>
          <CopyLinkButton anchorId="intent" />
        </div>
        <IntentNote notes={cs.intentNotes} />
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* FULL-WIDTH architecture */}
      <section id="architecture" className="scroll-mt-28 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-fg">Architecture canvas</div>
          <CopyLinkButton anchorId="architecture" />
        </div>
        <ArchitectureSection slug={params.slug} />
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Content grid */}
      <div className="grid gap-4 md:grid-cols-2 items-stretch [grid-auto-rows:1fr]">
        <Card id="problem" className="scroll-mt-28 h-full">
          <CardHeader>
            <HeaderRow title="Problem" desc="What was failing or missing." anchorId="problem" />
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-fg/80 break-words">{cs.problem}</CardContent>
        </Card>

        <Card id="highlights" className="scroll-mt-28 h-full">
          <CardHeader>
            <HeaderRow title="Highlights" desc="Why this work mattered." anchorId="highlights" />
          </CardHeader>
          <CardContent className="text-sm text-fg/80">
            <ul className="space-y-2">
              {cs.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand2" />
                  <span className="text-pretty">{h}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card id="approach" className="scroll-mt-28">
        <CardHeader>
          <HeaderRow title="Approach" desc="How the solution was driven end-to-end." anchorId="approach" />
        </CardHeader>
        <CardContent className="text-sm text-fg/80">
          <ol className="space-y-3">
            {cs.approach.map((a, i) => (
              <li key={a} className="grid grid-cols-[28px,1fr] gap-3">
                <div className="grid h-7 w-7 place-items-center rounded-xl border border-border/70 bg-card/60 text-xs font-semibold text-fg/70">
                  {i + 1}
                </div>
                <div className="leading-relaxed text-pretty break-words">{a}</div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 items-stretch [grid-auto-rows:1fr]">
        <Card id="system" className="scroll-mt-28 h-full">
          <CardHeader>
            <HeaderRow title="System details" desc="Key components and invariants." anchorId="system" />
          </CardHeader>
          <CardContent className="text-sm text-fg/80">
            <ul className="space-y-2">
              {cs.architecture.map((a) => (
                <li key={a} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand2" />
                  <span className="text-pretty">{a}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card id="outcomes" className="scroll-mt-28 h-full">
          <CardHeader>
            <HeaderRow title="Outcomes" desc="What changed and how it was measured." anchorId="outcomes" />
          </CardHeader>
          <CardContent className="text-sm text-fg/80">
            <ul className="space-y-2">
              {cs.outcomes.map((o) => (
                <li key={o} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand2" />
                  <span className="text-pretty">{o}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card id="tradeoffs" className="scroll-mt-28">
        <CardHeader>
          <HeaderRow title="Tradeoffs" desc="What was intentionally not done (and why)." anchorId="tradeoffs" />
        </CardHeader>
        <CardContent className="text-sm text-fg/80">
          <ul className="space-y-2">
            {cs.tradeoffs.map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand2" />
                <span className="text-pretty">{t}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Prev / Next navigation */}
      <section aria-label="More case studies" className="grid gap-4 md:grid-cols-2">
        {prev ? (
          <VTLink href={`/case-studies/${prev.slug}`} className="block">
            <Card>
              <CardHeader>
                <div className="text-xs text-muted">Previous</div>
                <div className="mt-1 text-sm font-semibold text-fg line-clamp-2 break-words">{prev.title}</div>
                <div className="mt-1 text-sm text-muted line-clamp-2 break-words">{prev.summary}</div>
              </CardHeader>
              <CardContent className="text-sm text-fg/70">Open →</CardContent>
            </Card>
          </VTLink>
        ) : (
          <div />
        )}

        {next ? (
          <VTLink href={`/case-studies/${next.slug}`} className="block">
            <Card>
              <CardHeader>
                <div className="text-xs text-muted">Next</div>
                <div className="mt-1 text-sm font-semibold text-fg line-clamp-2 break-words">{next.title}</div>
                <div className="mt-1 text-sm text-muted line-clamp-2 break-words">{next.summary}</div>
              </CardHeader>
              <CardContent className="text-sm text-fg/70">Open →</CardContent>
            </Card>
          </VTLink>
        ) : null}
      </section>
    </div>
  );
}

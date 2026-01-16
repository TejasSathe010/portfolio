"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIntent } from "@/components/IntentProvider";

type SortKey = "recommended" | "relevance" | "recent" | "title";

function csHref(params?: { q?: string; tag?: string; sort?: SortKey }) {
  const sp = new URLSearchParams();
  const sort = params?.sort ?? "recommended";
  sp.set("sort", sort);

  const q = params?.q?.trim();
  const tag = params?.tag?.trim();

  if (q) sp.set("q", q);
  if (tag) sp.set("tag", tag);

  return `/case-studies?${sp.toString()}`;
}

function Bullet({ children }: { children: ReactNode }) {
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

function PrimaryLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold",
        "text-white shadow-soft transition",
        "motion-safe:hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0",
        "bg-gradient-to-r from-brand via-brand2 to-brand3",
        // state layer
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition",
        "hover:after:opacity-100 active:after:opacity-100 after:bg-white/[0.10] active:after:bg-white/[0.14]"
      )}
    >
      {label} <span aria-hidden="true">→</span>
    </Link>
  );
}

function SecondaryLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-border/70 bg-card/70 px-4 py-2.5 text-sm font-semibold text-fg",
        "shadow-soft transition",
        "motion-safe:hover:-translate-y-0.5 hover:shadow-lift",
        // state layer
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition",
        "hover:after:opacity-100 active:after:opacity-100 after:bg-fg/[0.05] active:after:bg-fg/[0.08]"
      )}
    >
      {label}
    </Link>
  );
}

function ChipLink({
  href,
  label,
  tone = "neutral"
}: {
  href: string;
  label: string;
  tone?: "neutral" | "brand";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition",
        "min-h-[32px]",
        tone === "brand"
          ? "border-border/70 bg-gradient-to-r from-brand/[0.14] to-brand2/[0.12] text-fg"
          : "border-border/70 bg-card/60 text-fg/70 hover:text-fg hover:bg-fg/[0.03]",
        // Material-ish state layer
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:opacity-0 after:transition",
        "hover:after:opacity-100 active:after:opacity-100 after:bg-fg/[0.05] active:after:bg-fg/[0.08]"
      )}
    >
      {label}
    </Link>
  );
}

export function IntentBanner() {
  const { intent } = useIntent();

  const recruiterFilters = [
    { label: "Recommended", href: csHref({ sort: "recommended" }), tone: "brand" as const },
    { label: "Newest", href: csHref({ sort: "recent" }) },
    { label: "Latency / SLO", href: csHref({ q: "p95 latency slo" as string, sort: "relevance" }) },
    { label: "Kubernetes", href: csHref({ tag: "Kubernetes", sort: "recommended" }) },
    { label: "AWS", href: csHref({ tag: "AWS", sort: "recommended" }) },
    { label: "Kafka", href: csHref({ tag: "Kafka", sort: "recommended" }) }
  ];

  const hmFilters = [
    { label: "Recommended", href: csHref({ sort: "recommended" }), tone: "brand" as const },
    { label: "Tradeoffs", href: csHref({ q: "tradeoffs", sort: "relevance" }) },
    { label: "Exactly-once / Outbox", href: csHref({ q: "exactly-once outbox idempotency", sort: "relevance" }) },
    { label: "Rollout safety", href: csHref({ q: "rollout canary rollback error budget", sort: "relevance" }) },
    { label: "Observability", href: csHref({ q: "observability otel metrics", sort: "relevance" }) },
    { label: "Kafka", href: csHref({ tag: "Kafka", sort: "recommended" }) }
  ];

  const content =
    intent === "RECRUITER"
      ? {
          badge: "Tailored emphasis",
          title: "Fast, high-signal overview",
          subtitle: "Designed for quick scanning. Case studies provide depth where it matters most. Evidence is available when you need it.",
          bullets: [
            "Start with the top two case studies for the clearest outcomes and scope.",
            "Use Work for a quick timeline overview and technical stack context.",
            "Open Evidence when you want performance proof and live signals."
          ],
          // On case-studies, these now *apply* useful states
          primary: { label: "Open recommended", href: csHref({ sort: "recommended" }) },
          secondary: { label: "Scan work", href: "/work" },
          asideTitle: "Quick filters",
          asideLead: "One click to the most relevant content.",
          asideBody: "These links filter the case studies by topic, tag, or sort order for faster navigation.",
          filters: recruiterFilters
        }
      : {
          badge: "Tailored emphasis",
          title: "Decision context and proof",
          subtitle: "Focus on tradeoffs, rollout safety, and measurable reliability. Supporting evidence is available when you need it.",
          bullets: [
            "Case studies explain constraints, design choices, and tradeoffs clearly and concretely.",
            "Evidence provides performance signals (lab and live) and artifacts without cluttering the narrative.",
            "Work demonstrates consistency and breadth across different environments."
          ],
          primary: { label: "Open recommended", href: csHref({ sort: "recommended" }) },
          secondary: { label: "Evidence", href: "/evidence" },
          asideTitle: "Quick filters",
          asideLead: "Start with key patterns, then verify.",
          asideBody: "Use these to jump directly to tradeoffs, rollout safety, and correctness patterns.",
          filters: hmFilters
        };

  return (
    <section
      aria-label="Audience guidance"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-soft backdrop-blur",
        "focus-within:ring-4 focus-within:ring-brand/15"
      )}
    >
      {/* Subtle highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-r from-brand/18 via-brand2/14 to-brand3/16 blur-3xl"
      />

      <div className="relative grid gap-5 p-6 md:grid-cols-12 md:items-start">
        {/* Main */}
        <div className="space-y-3 md:col-span-8">
          <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-1 text-xs text-fg/70">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-brand2" />
            {content.badge}
            <span className="text-fg/40">•</span>
            <span className="text-fg/60">{intent === "RECRUITER" ? "Recruiter view" : "Hiring manager view"}</span>
          </div>

          <h2 className="text-balance text-base font-semibold text-fg">{content.title}</h2>
          <p className="text-pretty text-sm text-muted">{content.subtitle}</p>

          <ul role="list" className="mt-3 space-y-2">
            {content.bullets.map((b) => (
              <Bullet key={b}>{b}</Bullet>
            ))}
          </ul>

          {/* Inline micro-actions (Google-style: keep it subtle, optional) */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <ChipLink href={csHref({ sort: "recommended" })} label="Recommended" tone="brand" />
            <ChipLink href={csHref({ sort: "recent" })} label="Newest" />
            <ChipLink href={csHref({ q: "p95 latency slo", sort: "relevance" })} label="Latency/SLO" />
            <ChipLink href={csHref({ q: "tradeoffs", sort: "relevance" })} label="Tradeoffs" />
          </div>
        </div>

        {/* Aside */}
        <aside className="md:col-span-4">
          <div className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-border/70 bg-gradient-to-b from-card/80 to-card/50 p-5">
            <div className="space-y-2">
              <div className="text-xs text-muted">{content.asideTitle}</div>
              <div className="text-sm font-semibold text-fg">{content.asideLead}</div>
              <p className="text-sm text-muted">{content.asideBody}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {content.filters.map((f) => (
                  <ChipLink key={f.label} href={f.href} label={f.label} tone={f.tone === "brand" ? "brand" : "neutral"} />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <PrimaryLink href={content.primary.href} label={content.primary.label} />
              <SecondaryLink href={content.secondary.href} label={content.secondary.label} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

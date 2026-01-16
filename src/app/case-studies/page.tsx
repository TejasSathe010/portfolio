import { Suspense } from "react";
import { CaseStudiesGrid } from "@/components/CaseStudiesGrid";
import { IntentBanner } from "@/components/IntentBanner";

export const metadata = { title: "Case Studies" };

function CaseStudiesGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 shadow-sm animate-pulse">
        <div className="h-10 bg-fg/5 rounded-md w-1/3" />
        <div className="mt-4 h-8 bg-fg/5 rounded-md w-2/3" />
      </div>
      <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[320px] rounded-lg border border-border bg-surface animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function CaseStudiesPage() {
  return (
    <div className="space-y-0">
      <header className="py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-[1.07] text-balance max-w-prose relative pl-4">
          <div className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-gradient-to-b from-primary to-secondary" />
          <span className="relative">Case Studies</span>
        </h1>
        <p className="text-[15px] sm:text-base leading-7 text-muted max-w-prose text-pretty mt-4">
          In-depth case studies designed for clarity: constraints, decisions, outcomes, and tradeoffs, with supporting evidence available when needed.
        </p>
      </header>

      <IntentBanner />

      <Suspense fallback={<CaseStudiesGridSkeleton />}>
        <CaseStudiesGrid />
      </Suspense>
    </div>
  );
}

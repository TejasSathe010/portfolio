import { CaseStudiesGrid } from "@/components/CaseStudiesGrid";
import { IntentBanner } from "@/components/IntentBanner";

export const metadata = { title: "Case Studies" };

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

      <CaseStudiesGrid />
    </div>
  );
}

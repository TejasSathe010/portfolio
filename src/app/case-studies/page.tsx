import { CaseStudiesGrid } from "@/components/CaseStudiesGrid";
import { IntentBanner } from "@/components/IntentBanner";

export const metadata = { title: "Case Studies" };

export default function CaseStudiesPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Case Studies</h1>
        <p className="max-w-2xl text-muted">
          Deep dives designed for clarity: constraints → decisions → outcomes → tradeoffs, with evidence available when needed.
        </p>
      </header>

      <IntentBanner />

      <CaseStudiesGrid />
    </div>
  );
}

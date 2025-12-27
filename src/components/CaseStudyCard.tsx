import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  title: string;
  summary: string;
  timeline?: string;
  tags: string[];
  bullets: string[];
};

function compactTimeline(t?: string) {
  if (!t) return "";
  return t.replace(/\s+/g, " ").replace("—", "–").replace(" - ", " – ").trim();
}

export function CaseStudyCard({ href, title, summary, timeline, tags, bullets }: Props) {
  const shownTags = tags.slice(0, 7);
  const more = Math.max(0, tags.length - shownTags.length);
  const time = compactTimeline(timeline);

  return (
    <Link href={href} className="group block h-full" aria-label={`Open case study: ${title}`}>
      <Card className="h-full">
        <div className="flex h-full min-h-[320px] flex-col">
          {/* Header */}
          <div className="px-6 pb-4 pt-6">
            <div className="grid grid-cols-[1fr,92px] items-start gap-4">
              <div className="space-y-2">
                <h3 className="clamp-2 text-[15px] font-semibold leading-snug text-fg">{title}</h3>
                <p className="clamp-2 text-sm leading-relaxed text-muted">{summary}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="clamp-2 w-[92px] text-right text-xs leading-snug text-muted">{time}</div>

                {/* Affordance */}
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
                  ↗
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col px-6 pb-6">
            {/* Tags */}
            <div className="min-h-[58px]">
              <div className="flex flex-wrap gap-2">
                {shownTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border/70 bg-gradient-to-r from-brand/[0.10] to-brand2/[0.10] px-3 py-1 text-[11px] font-medium text-fg/80"
                  >
                    {t}
                  </span>
                ))}
                {more > 0 ? (
                  <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] font-medium text-fg/70">
                    +{more}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Signal */}
            <div className="mt-5 min-h-[76px]">
              <div className="text-xs font-semibold text-fg/80">Top signal</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-fg/80">
                {bullets.slice(0, 2).map((b) => (
                  <li key={b} className="clamp-2">
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-5">
              <div
                className={cn(
                  "flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3",
                  "transition",
                  "group-hover:bg-fg/[0.02]"
                )}
              >
                <div className="text-sm font-semibold text-fg">Read case study</div>
                <div
                  aria-hidden="true"
                  className="h-2 w-16 rounded-full bg-gradient-to-r from-brand/60 via-brand2/60 to-brand3/60 opacity-70"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

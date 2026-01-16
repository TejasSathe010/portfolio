import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { VTLink } from "@/components/VTLink";
import type { CSSProperties } from "react";

type Props = {
  href: string;
  title: string;
  summary: string;
  timeline?: string;
  tags: string[];
  bullets: string[];
  pdfPath?: string;
};

function compactTimeline(t?: string) {
  if (!t) return "";
  return t.replace(/\s+/g, " ").replace("—", "–").replace(" - ", " – ").trim();
}

function slugFromHref(href: string) {
  // expects /case-studies/<slug>
  const m = href.match(/^\/case-studies\/([^/?#]+)$/);
  return m?.[1] ?? null;
}

function vt(name?: string): CSSProperties | undefined {
  if (!name) return undefined;
  // React CSSProperties doesn't include viewTransitionName yet
  return { viewTransitionName: name } as unknown as CSSProperties;
}

export function CaseStudyCard({ href, title, summary, timeline, tags, bullets, pdfPath }: Props) {
  const shownTags = tags.slice(0, 7);
  const more = Math.max(0, tags.length - shownTags.length);
  const time = compactTimeline(timeline);

  const slug = slugFromHref(href);

  const cardStyle = vt(slug ? `cs-card-${slug}` : undefined);
  const titleStyle = vt(slug ? `cs-title-${slug}` : undefined);
  const tagsStyle = vt(slug ? `cs-tags-${slug}` : undefined);

  return (
    <Card className="relative h-full overflow-hidden group" style={cardStyle} interactive={false}>
      {/* gradient stroke on hover/focus */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-180 z-10",
          "bg-gradient-to-r from-primary/[0.08] via-secondary/[0.06] to-warm/[0.05]",
          "group-hover:opacity-100"
        )}
      />
      <VTLink
        href={href}
        ariaLabel={`Open case study: ${title}`}
        className={cn(
          "block h-full relative z-20",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        )}
      >
        <article className="relative flex h-full min-h-[320px] flex-col">
          {/* Header */}
          <div className="px-5 sm:px-6 pb-4 pt-5 sm:pt-6">
            <div className="grid grid-cols-[1fr,92px] items-start gap-4">
              <div className="space-y-2">
                <h3
                  style={titleStyle}
                  className="clamp-2 text-lg font-semibold leading-[1.2] tracking-tight text-fg break-words"
                >
                  {title}
                </h3>

                <p className="clamp-2 text-sm leading-7 text-fg/80 mt-2 break-words">{summary}</p>

                {/* tiny meta row (high-signal, low-noise) */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-fg/80">
                  {time ? (
                    <span className="rounded-r-chip border border-secondary/30 bg-secondary-tint/8 px-2.5 py-1 font-medium leading-5">
                      {time}
                    </span>
                  ) : null}
                  <span className="rounded-r-chip border border-primary/30 bg-primary-tint/8 px-2.5 py-1 font-medium leading-5">
                    {tags.length} tags
                  </span>
                  <span className="rounded-full border border-accent3/30 bg-accent3-tint/5 px-2.5 py-1 font-medium leading-5">
                    {Math.min(bullets.length, 2)} key signals
                  </span>
                </div>
              </div>

              {/* Top-right affordance */}
              <div className="flex flex-col items-end gap-2">
                <div className="clamp-2 w-[92px] text-right text-xs leading-snug text-muted">{time}</div>

                <div
                  aria-hidden="true"
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-r-btn border border-secondary/30 bg-secondary-tint/8 text-fg/75",
                    "transition-all duration-[280ms] ease-out",
                    "group-hover:bg-secondary-tint/12 group-hover:border-secondary/50 group-hover:text-secondary",
                    "motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:rotate-3"
                  )}
                >
                  ↗
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col px-5 sm:px-6 pb-5 sm:pb-6">
            {/* Tags */}
            <div className="min-h-[58px]" style={tagsStyle}>
              <div className="flex flex-wrap gap-2">
                {shownTags.map((t) => (
                  <span
                    key={t}
                    className={cn(
                      "rounded-r-chip border border-secondary/35 px-3 py-1 text-[11px] font-medium text-fg/80",
                      "bg-secondary-tint/8",
                      "transition-all duration-[280ms] ease-out",
                      "group-hover:bg-secondary-tint/12 group-hover:border-secondary/50"
                    )}
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

            {/* Footer CTA */}
            <div className="mt-auto pt-5 space-y-2">
              <div
                  className={cn(
                    "flex items-center justify-between rounded-r-btn border border-primary/20 bg-primary-tint/5 px-4 py-3",
                    "transition-all duration-[280ms] ease-out",
                    "group-hover:bg-primary-tint/10 group-hover:border-primary/40",
                    "motion-safe:group-hover:-translate-y-[1px] motion-safe:group-hover:shadow-sm"
                  )}
              >
                <div className="text-sm font-semibold text-fg">Read case study</div>

                <div className="relative h-2 w-16 overflow-hidden rounded-full bg-fg/[0.06]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 via-secondary/40 to-warm/30 opacity-70"
                  />
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 translate-x-[-60%] bg-white/[0.25] blur-sm",
                      "motion-safe:group-hover:translate-x-[140%] motion-safe:transition-transform motion-safe:duration-700"
                    )}
                  />
                </div>
              </div>
              {pdfPath ? (
                <a
                  href={pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-r-btn border border-secondary/20 bg-secondary-tint/8 px-4 py-2.5 text-xs font-semibold text-fg/70",
                    "transition-all duration-[280ms] ease-out hover:bg-secondary-tint/12 hover:text-secondary hover:border-secondary/40",
                    "motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-sm motion-safe:active:translate-y-[1px]"
                  )}
                >
                  <span>📄</span>
                  <span>View PDF</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </a>
              ) : null}
            </div>
          </div>
        </article>
      </VTLink>
    </Card>
  );
}

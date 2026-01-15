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
    <VTLink
      href={href}
      ariaLabel={`Open case study: ${title}`}
      className={cn(
        "group block h-full rounded-3xl",
        // keyboard focus should be obvious (on the whole card)
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
      )}
    >
      <Card className="relative h-full overflow-hidden" style={cardStyle}>
        {/* gradient stroke on hover/focus */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition",
            "bg-gradient-to-r from-brand/[0.10] via-brand2/[0.08] to-brand3/[0.10]",
            "group-hover:opacity-100"
          )}
        />

        <article className="relative flex h-full min-h-[320px] flex-col">
          {/* Header */}
          <div className="px-6 pb-4 pt-6">
            <div className="grid grid-cols-[1fr,92px] items-start gap-4">
              <div className="space-y-2">
                <h3
                  style={titleStyle}
                  className="clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-fg"
                >
                  {title}
                </h3>

                <p className="clamp-2 text-sm leading-relaxed text-muted">{summary}</p>

                {/* tiny meta row (high-signal, low-noise) */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-muted">
                  {time ? (
                    <span className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 font-medium">
                      {time}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 font-medium">
                    {tags.length} tags
                  </span>
                  <span className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 font-medium">
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
                    "grid h-9 w-9 place-items-center rounded-2xl border border-border/70 bg-card/60 text-fg/80",
                    "transition",
                    "group-hover:bg-fg/[0.03]",
                    "relative after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition",
                    "group-hover:after:opacity-100 after:bg-fg/[0.04]",
                    // micro-interaction (transform only → safe for Web Vitals)
                    "motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:rotate-3"
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
            <div className="min-h-[58px]" style={tagsStyle}>
              <div className="flex flex-wrap gap-2">
                {shownTags.map((t) => (
                  <span
                    key={t}
                    className={cn(
                      "rounded-full border border-border/70 px-3 py-1 text-[11px] font-medium text-fg/80",
                      "bg-gradient-to-r from-brand/[0.10] to-brand2/[0.10]",
                      "transition",
                      "group-hover:from-brand/[0.12] group-hover:to-brand2/[0.12]"
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
                  "flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3",
                  "transition",
                  "group-hover:bg-fg/[0.02]",
                  "motion-safe:group-hover:-translate-y-0.5"
                )}
              >
                <div className="text-sm font-semibold text-fg">Read case study</div>

                <div className="relative h-2 w-16 overflow-hidden rounded-full bg-fg/[0.06]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-brand/60 via-brand2/60 to-brand3/60 opacity-80"
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
                    "flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-4 py-2.5 text-xs font-semibold text-fg/70",
                    "transition hover:bg-fg/[0.02] hover:text-fg hover:border-border",
                    "motion-safe:hover:-translate-y-0.5 shadow-soft hover:shadow-lift"
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
      </Card>
    </VTLink>
  );
}

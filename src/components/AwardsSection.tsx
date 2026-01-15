"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type Award = {
  title: string;
  detail: string;
};

function pickHeadlineMetric(detail: string) {
  const m =
    detail.match(/(\d+(?:\.\d+)?\s?(?:ms|s|%|x))/i)?.[0] ??
    detail.match(/(\d{1,3}(?:,\d{3})+(?:\.\d+)?)/)?.[0] ??
    detail.match(/(\d+(?:\.\d+)?\s?(?:k|m|b))/i)?.[0];
  return m?.replace(/\s+/g, "");
}

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M6 7H4c0 3 2 5 4 5M18 7h2c0 3-2 5-4 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M12 11v4M9 20h6M10 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PartyPopperIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20l6-2 10-10-4-4L6 14l-2 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 3v2M21 6h-2M19.5 4.5l1.5-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 18l-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AwardCard({ title, detail, idx }: { title: string; detail: string; idx: number }) {
  const metric = pickHeadlineMetric(detail);

  const accents = [
    "from-brand/[0.18] via-brand2/[0.14] to-brand3/[0.14]",
    "from-brand3/[0.16] via-brand/[0.14] to-brand2/[0.14]",
    "from-brand2/[0.16] via-brand3/[0.14] to-brand/[0.14]"
  ];
  const accent = accents[idx % accents.length];

  return (
    <Card className={cn("group relative h-full overflow-hidden", "achv-sheen achv-burst")}>
      {/* Accent top stroke */}
      <div aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r", accent)} />

      {/* Soft hover wash */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition duration-300",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          "bg-gradient-to-br",
          accent
        )}
        style={{ mixBlendMode: "soft-light" }}
      />

      {/* Sheen bar */}
      <div
        aria-hidden="true"
        className="achv-sheen__bar pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 opacity-0"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }}
      />

      {/* Confetti burst (no CLS — absolute positioned) */}
      <div aria-hidden="true" className="achv-burst__confetti">
        {[
          { dx: -52, dy: -26, r: -140 },
          { dx: -32, dy: -54, r: -40 },
          { dx: 0, dy: -62, r: 20 },
          { dx: 32, dy: -54, r: 60 },
          { dx: 52, dy: -26, r: 140 },
          { dx: -46, dy: 10, r: -200 },
          { dx: 46, dy: 10, r: 200 },
          { dx: 0, dy: -34, r: 90 }
        ].map((p, i) => (
          <span
            key={i}
            className="achv-burst__piece"
            style={
              {
                ["--dx" as any]: `${p.dx}px`,
                ["--dy" as any]: `${p.dy}px`,
                ["--rot" as any]: `${p.r}deg`
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              {/* Trophy (wiggle + float) */}
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-2xl border border-border/70",
                  "bg-card/60 text-fg/80 shadow-soft",
                  "achv-trophy"
                )}
              >
                <TrophyIcon />
              </span>

              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-fg">{title}</div>
                <div className="text-[11px] text-muted">Recognition • Leadership • Leverage</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Party popper (pop + tilt) */}
            <span
              className={cn(
                "grid h-9 w-9 place-items-center rounded-2xl border border-border/70",
                "bg-card/60 text-fg/80 shadow-soft",
                "achv-popper"
              )}
              title="Celebration"
            >
              <PartyPopperIcon />
            </span>

            {metric ? (
              <div className="shrink-0 rounded-2xl border border-border/70 bg-card/60 px-3 py-2 shadow-soft">
                <div className="text-[10px] font-semibold text-muted">Signal</div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-fg">{metric}</div>
              </div>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-sm text-fg/80">
        <p className="text-pretty leading-relaxed">{detail}</p>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3">
          <div className="text-xs font-semibold text-fg/80">Credibility signal</div>
          <div
            aria-hidden="true"
            className="h-2 w-16 rounded-full bg-gradient-to-r from-brand/60 via-brand2/60 to-brand3/60 opacity-70"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function AwardsSection({ awards }: { awards: ReadonlyArray<Award> }) {
  return (
    <section className="space-y-4 scroll-mt-28" id="awards" aria-label="Awards and leadership">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-fg">Awards & Leadership</h2>
        <p className="text-sm text-muted">Signals beyond output: recognition, initiative, and leverage.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
        {awards.map((a, idx) => (
          <AwardCard key={a.title} title={a.title} detail={a.detail} idx={idx} />
        ))}
      </div>
    </section>
  );
}

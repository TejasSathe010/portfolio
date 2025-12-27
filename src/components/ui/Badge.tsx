import { cn } from "@/lib/utils";
import type * as React from "react";

type Tone = "neutral" | "good" | "bad" | "warn";

export function Badge({
  tone = "neutral",
  children,
  className
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: "border-border/70 bg-card/60 text-fg/70",
    good: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
    bad: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-200",
    warn: "border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-200"
  } satisfies Record<Tone, string>;

  return (
    <span
      className={cn(
        "inline-flex select-none items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

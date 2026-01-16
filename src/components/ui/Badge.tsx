import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "good" | "bad" | "warn" | "primary" | "secondary" | "warm";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones = {
  neutral: "border-border bg-surface-2 text-muted",
  good: "border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  bad: "border-red-500/20 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  warn: "border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  /* Section-themed chips */
  primary: "border-primary/20 bg-primary-tint/8 text-primary",
  secondary: "border-secondary/20 bg-secondary-tint/8 text-secondary",
  warm: "border-warm/20 bg-warm-tint/6 text-warm"
} satisfies Record<Tone, string>;

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        /* Base: consistent padding + typography */
        "inline-flex items-center rounded-r-chip border px-2.5 py-1 text-xs font-medium chip",
        /* Buttery transitions */
        "transition-all duration-med ease-out",
        /* Tone */
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

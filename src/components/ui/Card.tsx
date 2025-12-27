import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  interactive = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-soft backdrop-blur",
        "transition",
        interactive && "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lift",
        // Keyboard focus should be obvious when a link/button inside is focused
        "focus-within:ring-4 focus-within:ring-brand/15",
        // hover glow (only when interactive)
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition",
        "before:bg-gradient-to-r before:from-brand/[0.10] before:via-brand2/[0.08] before:to-brand3/[0.08]",
        interactive && "group-hover:before:opacity-100",
        // inner stroke
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:shadow-insetStroke",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative z-10 p-6 pb-3", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative z-10 p-6 pt-3", className)} {...props} />;
}

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  interactive = true,
  featured = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        /* Surface model: card layer + micro-contrast border */
        "group relative overflow-hidden rounded-r-card border border-border bg-surface",
        /* Ambient shadow */
        "shadow-sm",
        /* Sheen effect on featured */
        featured && "sheen gradient-border",
        /* Two-stage hover for interactive cards */
        interactive && "card-interactive",
        /* Focus state */
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/20 focus-within:ring-offset-2 focus-within:ring-offset-bg",
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Header - consistent slot spacing
 * Anatomy: Title → Meta → Description
 */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 p-5 sm:p-6 pb-3",
        /* Slot spacing contract */
        "[&>*+*]:mt-2",
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Content - consistent slot spacing
 * Anatomy: Summary → Tags → CTA
 */
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 p-5 sm:p-6 pt-3",
        /* Slot spacing contract */
        "[&>*+*]:mt-3",
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Footer - for CTAs
 */
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 px-5 sm:px-6 pb-5 sm:pb-6 pt-2",
        "flex flex-wrap items-center gap-3",
        className
      )}
      {...props}
    />
  );
}

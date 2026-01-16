import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  type,
  disabled,
  ...props
}: Props) {
  const Comp = asChild ? Slot : "button";
  const safeProps = asChild ? props : { type: type ?? "button", disabled, ...props };

  return (
    <Comp
      className={cn(
        /* Base: consistent touch target + buttery motion */
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-r-btn font-semibold",
        "transition-all duration-med ease-out",
        "motion-safe:hover:-translate-y-[1px] motion-safe:active:translate-y-[1px] active:opacity-95",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",

        /* Size */
        size === "sm" ? "px-3 py-2 text-sm" : "px-5 py-2.5 text-sm",

        /* Primary: gradient + glow + sheen (two-stage hover) */
        variant === "primary" && cn(
          "sheen",
          "text-white bg-gradient-to-r from-primary to-secondary",
          "shadow-sm",
          "hover:border-primary/20",
          "motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-glow"
        ),

        /* Secondary: surface + border accent (two-stage hover) */
        variant === "secondary" && cn(
          "border border-border bg-surface text-fg",
          "hover:border-primary/25 hover:bg-surface-2",
          "motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-sm"
        ),

        /* Ghost: minimal (two-stage hover) */
        variant === "ghost" && cn(
          "bg-transparent text-muted",
          "hover:bg-surface-2 hover:text-fg"
        ),

        className
      )}
      {...safeProps}
    />
  );
}

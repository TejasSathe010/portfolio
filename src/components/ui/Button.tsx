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

  // Avoid passing button-only props onto <a> when using asChild
  const safeProps = asChild ? props : { type: type ?? "button", disabled, ...props };

  return (
    <Comp
      className={cn(
        "relative inline-flex min-h-[40px] items-center justify-center gap-2 rounded-2xl font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        // State layer (hover/pressed)
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition",
        "hover:after:opacity-100 active:after:opacity-100",
        // Focus (so buttons still get a clear ring even if globals change)
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20",
        size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-sm",

        variant === "primary" &&
          cn(
            "text-white shadow-soft",
            "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lift active:translate-y-0",
            "bg-gradient-to-r from-brand via-brand2 to-brand3",
            "after:bg-white/[0.10] active:after:bg-white/[0.14]"
          ),

        variant === "secondary" &&
          cn(
            "border border-border/70 bg-card/70 text-fg shadow-soft",
            "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lift",
            "after:bg-fg/[0.05] active:after:bg-fg/[0.08]"
          ),

        variant === "ghost" &&
          cn(
            "bg-transparent text-fg/70",
            "after:bg-fg/[0.05] active:after:bg-fg/[0.08]",
            "hover:text-fg"
          ),

        className
      )}
      {...safeProps}
    />
  );
}

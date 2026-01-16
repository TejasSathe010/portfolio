import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /* Section theming */
  accent?: "primary" | "secondary" | "warm";
  showDivider?: boolean;
}

export function SectionHeader({
  title,
  description,
  action,
  size = "md",
  accent = "primary",
  showDivider = true,
  className,
  ...props
}: SectionHeaderProps) {
  const accentColors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    warm: "bg-warm"
  };

  const dividerGradients = {
    primary: "from-transparent via-primary/25 to-transparent",
    secondary: "from-transparent via-secondary/25 to-transparent",
    warm: "from-transparent via-warm/25 to-transparent"
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Accent mark (left bar) - section theming */}
          <div className={cn("mt-1.5 h-5 w-1 rounded-full", accentColors[accent])} />

          <div className="space-y-1">
            <h2
              className={cn(
                size === "sm" && "text-lg sm:text-xl font-semibold tracking-[-0.01em]",
                size === "md" && "text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[-0.02em]",
                size === "lg" && "text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em]"
              )}
            >
              {title}
            </h2>
            {description && (
              <p className="text-[15px] sm:text-base leading-7 text-muted max-w-prose text-pretty">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Gradient hairline divider - micro-contrast */}
      {showDivider && (
        <div className={cn("h-px bg-gradient-to-r", dividerGradients[accent])} />
      )}
    </div>
  );
}

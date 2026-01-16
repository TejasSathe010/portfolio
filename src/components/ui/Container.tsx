import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Container width variant */
  size?: "default" | "wide" | "narrow";
  /** As semantic element */
  as?: "div" | "section" | "article" | "main";
}

/**
 * Container component for consistent layout
 * Default: 1120px max-width with responsive gutters
 */
export function Container({
  className,
  size = "default",
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "default" && "max-w-container",    /* 1120px */
        size === "wide" && "max-w-[1280px]",        /* 1280px */
        size === "narrow" && "max-w-prose",         /* 65ch */
        className
      )}
      {...props}
    />
  );
}

/**
 * Section component with consistent spacing
 */
export function Section({
  className,
  theme,
  ...props
}: HTMLAttributes<HTMLElement> & {
  theme?: "primary" | "secondary" | "warm" | "blend";
}) {
  const themeClasses = {
    primary: "section-primary",
    secondary: "section-secondary",
    warm: "section-warm",
    blend: "section-blend"
  };

  return (
    <section
        className={cn(
          /* Consistent section rhythm: py-16 mobile, py-24 md+ */
          "py-16 md:py-24",
          /* Section theming */
          theme && themeClasses[theme],
          className
        )}
      {...props}
    />
  );
}

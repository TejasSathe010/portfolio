import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
    /** Theme color for gradient divider */
    accent?: "primary" | "secondary" | "warm" | "neutral";
    /** Spacing above and below */
    spacing?: "sm" | "md" | "lg";
}

const accentGradients = {
    primary: "from-transparent via-primary/25 to-transparent",
    secondary: "from-transparent via-secondary/25 to-transparent",
    warm: "from-transparent via-warm/20 to-transparent",
    neutral: "from-transparent via-border to-transparent"
};

const spacingClasses = {
    sm: "my-4",
    md: "my-8",
    lg: "my-12"
};

/**
 * Gradient hairline divider
 * Consistent 1px height with themed gradient
 */
export function Divider({
    accent = "neutral",
    spacing = "md",
    className,
    ...props
}: DividerProps) {
    return (
        <div
            role="separator"
            aria-hidden="true"
            className={cn(
                "h-px w-full bg-gradient-to-r",
                accentGradients[accent],
                spacingClasses[spacing],
                className
            )}
            {...props}
        />
    );
}

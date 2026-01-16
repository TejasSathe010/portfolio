import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    /** Width of skeleton (can be Tailwind class or inline) */
    width?: string;
    /** Height of skeleton */
    height?: string;
    /** Rounded variant */
    rounded?: "sm" | "md" | "lg" | "full";
}

/**
 * Skeleton loader for content placeholders
 * Uses CSS animation that respects prefers-reduced-motion
 */
export function Skeleton({
    className,
    width = "w-full",
    height = "h-4",
    rounded = "md",
    ...props
}: SkeletonProps) {
    const roundedClasses = {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full"
    };

    return (
        <div
            className={cn(
                "skeleton",
                width,
                height,
                roundedClasses[rounded],
                className
            )}
            aria-hidden="true"
            {...props}
        />
    );
}

/**
 * Skeleton card for loading states
 */
export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("rounded-r-card border border-border bg-surface p-5 sm:p-6 space-y-4", className)}>
            <Skeleton height="h-5" width="w-3/4" />
            <Skeleton height="h-4" width="w-1/2" />
            <div className="space-y-2 pt-2">
                <Skeleton height="h-3" />
                <Skeleton height="h-3" />
                <Skeleton height="h-3" width="w-2/3" />
            </div>
            <div className="flex gap-2 pt-2">
                <Skeleton height="h-6" width="w-16" rounded="full" />
                <Skeleton height="h-6" width="w-20" rounded="full" />
                <Skeleton height="h-6" width="w-14" rounded="full" />
            </div>
        </div>
    );
}

/**
 * Skeleton text line
 */
export function SkeletonText({
    lines = 3,
    className
}: {
    lines?: number;
    className?: string;
}) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height="h-4"
                    width={i === lines - 1 ? "w-2/3" : "w-full"}
                />
            ))}
        </div>
    );
}

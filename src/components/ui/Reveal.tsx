"use client";

import type React from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms (default 70ms per item for smooth cascade) */
  delayMs?: number;
  /** IntersectionObserver root margin */
  rootMargin?: string;
};

export function Reveal({
  children,
  className,
  delayMs = 0,
  rootMargin = "0px 0px -10% 0px"
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInViewOnce(ref, { rootMargin });

  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "reveal-on", className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

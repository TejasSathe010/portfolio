"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms (default 70ms per item for smooth cascade) */
  delayMs?: number;
  /** Only animate once (default true) */
  once?: boolean;
  /** IntersectionObserver root margin */
  rootMargin?: string;
};

export function Reveal({
  children,
  className,
  delayMs = 0,
  once = true,
  rootMargin = "120px 0px -10% 0px"
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Respect reduced motion: show immediately.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      setInView(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root: null, rootMargin, threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin]);

  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "reveal-in", className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

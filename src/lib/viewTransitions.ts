export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function canUseViewTransition(): boolean {
  return typeof document !== "undefined" && "startViewTransition" in document;
}

export function startViewTransition(run: () => void) {
  if (!canUseViewTransition() || prefersReducedMotion()) {
    run();
    return;
  }

  // TS-safe: startViewTransition is still experimental in types
  const doc = document as Document & {
    startViewTransition?: (cb: () => void | Promise<void>) => void;
  };

  doc.startViewTransition?.(() => {
    run();
  });
}

import { useEffect, useState } from "react";
import type { RefObject } from "react";

type Options = {
  rootMargin?: string;
  threshold?: number;
};

export function useInViewOnce(
  ref: RefObject<Element>,
  { rootMargin = "0px 0px -10% 0px", threshold = 0.12 }: Options = {}
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
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
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [inView, ref, rootMargin, threshold]);

  return inView;
}

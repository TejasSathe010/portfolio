"use client";

import { useId, useMemo, useRef } from "react";
import { intents } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useIntent } from "./IntentProvider";

export function IntentSwitch() {
  const { intent, setIntent } = useIntent();
  const groupId = useId();

  const idx = Math.max(0, intents.findIndex((i) => i.key === intent));
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const hint = useMemo(() => intents.find((i) => i.key === intent)?.hint ?? "", [intent]);

  function move(delta: -1 | 1) {
    const nextIdx = Math.max(0, Math.min(intents.length - 1, idx + delta));
    const next = intents[nextIdx]?.key;
    if (!next) return;
    setIntent(next);
    btnRefs.current[nextIdx]?.focus();
  }

  // indicator sizing for N intents (not just 2)
  const count = Math.max(1, intents.length);
  const indicatorWidth = `calc((100% - 8px) / ${count})`; // minus container padding (p-1 left/right)
  const indicatorTransform = `translateX(${idx * 100}%)`;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "relative flex w-[240px] select-none items-center rounded-2xl border border-border/70 bg-card/70 p-1 shadow-soft backdrop-blur",
          "focus-within:ring-4 focus-within:ring-brand/15"
        )}
        role="radiogroup"
        aria-label="Audience"
        aria-describedby={`${groupId}-hint`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            move(-1);
          }
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            move(1);
          }
        }}
      >
        {/* Sliding indicator */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute left-1 top-1 h-[calc(100%-8px)] rounded-xl",
            "bg-gradient-to-r from-brand via-brand2 to-brand3",
            "motion-safe:transition-transform motion-safe:duration-300"
          )}
          style={{ width: indicatorWidth, transform: indicatorTransform }}
        />

        {intents.map((i, j) => {
          const active = i.key === intent;

          return (
            <button
              key={i.key}
              ref={(el) => {
                btnRefs.current[j] = el;
              }}
              type="button"
              onClick={() => setIntent(i.key)}
              tabIndex={active ? 0 : -1}
              className={cn(
                "relative z-10 flex-1 rounded-xl px-3 py-2 text-xs font-semibold",
                "min-h-[44px] transition-colors duration-200 focus-visible:outline-none",
                "after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-200",
                "hover:after:opacity-100 active:after:opacity-100",
                active
                  ? "text-white after:bg-white/[0.10] active:after:bg-white/[0.14]"
                  : "text-fg/70 hover:text-fg after:bg-fg/[0.05] active:after:bg-fg/[0.08]"
              )}
              role="radio"
              aria-checked={active}
              aria-label={`${i.label}. ${i.hint}`}
              title={i.hint}
            >
              {i.label}
            </button>
          );
        })}
      </div>

      <div id={`${groupId}-hint`} className="text-[11px] text-muted">
        {hint}
      </div>
    </div>
  );
}

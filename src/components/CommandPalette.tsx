// src/components/CommandPalette.tsx
"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { caseStudies } from "@/lib/content";

type Item = {
  group: "Actions" | "Pages" | "Work" | "Insights" | "Case Studies";
  label: string;
  href?: string;
  hint?: string;
  onSelect?: () => void;
};

function getFocusable(container: HTMLElement | null) {
  if (!container) return [];
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )
  );
  return nodes.filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function CommandPalette() {
  const router = useRouter();
  const listboxId = useId();

  const items: Item[] = useMemo(
    () => [
      { group: "Actions", label: "Start tour", href: "/start", hint: "2-minute guided scan" },
      { group: "Actions", label: "Open console", href: "/console", hint: "Engineering dashboard" },

      { group: "Pages", label: "Home", href: "/", hint: "Overview" },
      { group: "Pages", label: "Case studies", href: "/case-studies", hint: "Deep dives" },
      { group: "Pages", label: "Work", href: "/work", hint: "Experience timeline" },
      { group: "Pages", label: "Evidence", href: "/evidence", hint: "Live metrics + receipts" },

      { group: "Work", label: "Projects", href: "/work#projects", hint: "Work section" },
      { group: "Work", label: "Awards", href: "/work#awards", hint: "Work section" },
      { group: "Work", label: "Education", href: "/work#education", hint: "Work section" },

      { group: "Insights", label: "Postmortems", href: "/postmortems", hint: "RCA + fixes" },
      { group: "Insights", label: "Highlights", href: "/highlights", hint: "PR / review snapshots" },

      ...caseStudies.map((c) => ({
        group: "Case Studies" as const,
        label: c.title,
        href: `/case-studies/${c.slug}`,
        hint: "Case study"
      }))
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setSelectedIndex(0);
  }, []);

  const run = useCallback(
    (item: Item) => {
      item.onSelect?.();
      if (item.href) router.push(item.href);
      close();
    },
    [router, close]
  );

  const filteredFlat = useMemo(() => {
    const s = normalize(q);
    if (!s) return items;

    // Slightly better matching: all tokens must appear somewhere
    const parts = s.split(/\s+/g).filter(Boolean);
    return items.filter((i) => {
      const hay = normalize(`${i.group} ${i.label} ${i.hint ?? ""}`);
      return parts.every((p) => hay.includes(p));
    });
  }, [items, q]);

  const grouped = useMemo(() => {
    const order: Array<Item["group"]> = ["Actions", "Pages", "Work", "Insights", "Case Studies"];
    const m = new Map<Item["group"], Item[]>();
    for (const it of filteredFlat) {
      const arr = m.get(it.group) ?? [];
      arr.push(it);
      m.set(it.group, arr);
    }
    return order
      .map((g) => ({ group: g, items: m.get(g) ?? [] }))
      .filter((x) => x.items.length > 0);
  }, [filteredFlat]);

  // Global hotkey (⌘K / Ctrl+K)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      const isK = e.key.toLowerCase() === "k";
      if (meta && isK) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  // Scroll-lock + focus input on open
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Keep selection valid when filter changes
  useEffect(() => {
    if (!open) return;
    setSelectedIndex((i) => {
      if (filteredFlat.length === 0) return 0;
      return Math.min(i, filteredFlat.length - 1);
    });
  }, [filteredFlat.length, open]);

  // Ensure selected item visible
  useEffect(() => {
    if (!open) return;
    const id = `${listboxId}-opt-${selectedIndex}`;
    const el = document.getElementById(id);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, selectedIndex, listboxId]);

  if (!open) return null;

  const activeId = `${listboxId}-opt-${selectedIndex}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onKeyDown={(e) => {
        // Focus trap (Tab cycles within panel)
        if (e.key === "Tab") {
          const focusables = getFocusable(panelRef.current);
          if (focusables.length === 0) return;

          const first = focusables[0]!;
          const last = focusables[focusables.length - 1]!;
          const current = document.activeElement as HTMLElement | null;

          if (e.shiftKey) {
            if (!current || current === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (!current || current === last) {
              e.preventDefault();
              first.focus();
            }
          }
          return;
        }

        // List navigation
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (filteredFlat.length === 0) return;
          setSelectedIndex((i) => (i + 1) % filteredFlat.length);
          return;
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (filteredFlat.length === 0) return;
          setSelectedIndex((i) => (i - 1 + filteredFlat.length) % filteredFlat.length);
          return;
        }

        if (e.key === "Enter") {
          e.preventDefault();
          const item = filteredFlat[selectedIndex];
          if (!item) return;
          run(item);
        }
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-lift backdrop-blur"
      >
        <div className="border-b border-border/70 p-3">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search…"
            className={cn(
              "w-full rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-sm outline-none",
              "focus-visible:ring-4 focus-visible:ring-brand/20"
            )}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={filteredFlat.length ? activeId : undefined}
          />
        </div>

        <div className="max-h-[380px] overflow-auto p-2">
          {filteredFlat.length === 0 ? (
            <div className="p-4 text-sm text-muted">No results.</div>
          ) : (
            <div id={listboxId} role="listbox" aria-label="Results" className="space-y-2">
              {grouped.map((g) => (
                <div key={g.group} className="space-y-1">
                  <div className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {g.group}
                  </div>

                  <div className="space-y-1">
                    {g.items.map((it) => {
                      const idx = filteredFlat.indexOf(it);
                      const active = idx === selectedIndex;
                      const id = `${listboxId}-opt-${idx}`;

                      return (
                        <button
                          key={`${it.group}-${it.label}-${idx}`}
                          id={id}
                          role="option"
                          aria-selected={active}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => run(it)}
                          className={cn(
                            "relative flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition",
                            // state layer
                            "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition",
                            active
                              ? "bg-gradient-to-r from-brand/[0.14] to-brand2/[0.12] text-fg after:bg-fg/[0.02]"
                              : "text-fg/80 hover:after:opacity-100 after:bg-fg/[0.04]"
                          )}
                        >
                          <span className="font-semibold">{it.label}</span>
                          {it.hint ? <span className="text-xs text-muted">{it.hint}</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border/70 px-4 py-3 text-xs text-muted">
          <span className="font-mono">↑</span>/<span className="font-mono">↓</span> navigate •{" "}
          <span className="font-mono">Enter</span> open • <span className="font-mono">Esc</span> close •{" "}
          <span className="font-mono">⌘K</span>/<span className="font-mono">Ctrl+K</span> toggle
        </div>
      </div>
    </div>
  );
}

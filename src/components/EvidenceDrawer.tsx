"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Matches your src/lib/content EvidenceItem shape
export type EvidenceItem = {
  title: string;
  type: "PR" | "DOC" | "DASHBOARD" | "SCREENSHOT" | "REPO" | "DEMO" | "CERT";
  href: string;
  note?: string;
};

function safeCopy(text: string) {
  if (!text) return;
  void navigator.clipboard?.writeText(text).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  });
}

export function EvidenceDrawer({
  title = "Evidence",
  items
}: {
  title?: string;
  items: ReadonlyArray<EvidenceItem>;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const modal =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[100]">
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black/35 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* panel */}
            <div className="absolute right-0 top-0 h-full w-full sm:w-[560px] md:w-[720px]">
              <div className="flex h-full flex-col border-l border-border/70 bg-card/80 shadow-lift backdrop-blur">
                {/* header */}
                <div className="flex items-start justify-between gap-3 border-b border-border/70 p-5">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-fg">{title}</div>
                    <div className="mt-1 text-sm text-muted">
                      Evidence links open in a new tab (no popups).
                    </div>
                  </div>

                  <button
                    ref={closeBtnRef}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-sm font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
                  >
                    Close
                  </button>
                </div>

                {/* body */}
                <div className="flex-1 overflow-auto p-5">
                  {rows.length === 0 ? (
                    <Card className="p-5">
                      <div className="text-sm font-semibold text-fg">No evidence items</div>
                      <div className="mt-1 text-sm text-muted">
                        Add items to <span className="font-mono text-fg/80">cs.evidence</span>.
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {rows.map((r) => (
                        <Card key={r.title} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-semibold text-fg/70">
                                  {r.type}
                                </span>
                                <div className="truncate text-sm font-semibold text-fg">{r.title}</div>
                              </div>

                              {r.note ? <div className="text-sm text-muted">{r.note}</div> : null}

                              <div className="truncate text-xs text-muted">
                                <span className="font-mono">{r.href}</span>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                onClick={() => safeCopy(r.href)}
                                className="rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
                              >
                                Copy
                              </button>
                              <a
                                href={r.href}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-2xl px-3 py-2 text-xs font-semibold text-white shadow-soft hover:shadow-lift hover:-translate-y-0.5 bg-gradient-to-r from-brand via-brand2 to-brand3"
                              >
                                Open ↗
                              </a>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* footer */}
                <div className="border-t border-border/70 p-5">
                  <div className="text-xs text-muted">
                    Add dashboards, traces, PRs, benchmarks, and screenshots here for maximum credibility.
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        {title}
      </Button>
      {modal}
    </>
  );
}

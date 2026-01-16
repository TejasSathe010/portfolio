"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = "status" | "a11y" | "tokens" | "layout";

type A11yReport = {
  hasH1: boolean;
  imagesMissingAlt: number;
  buttonsMissingName: number;
  linksMissingName: number;
  inputsMissingLabel: number;
};

function getCssVar(name: string) {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  } catch {
    return "";
  }
}

function accessibleName(el: Element): string {
  // fast + good-enough heuristic for a quick audit panel
  const aria = el.getAttribute("aria-label")?.trim();
  if (aria) return aria;

  const labelledBy = el.getAttribute("aria-labelledby")?.trim();
  if (labelledBy) {
    const node = document.getElementById(labelledBy);
    const txt = node?.textContent?.trim();
    if (txt) return txt;
  }

  // button/a inner text
  const txt = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  if (txt) return txt;

  // input placeholder (not ideal, but a signal)
  if (el instanceof HTMLInputElement) {
    return (el.placeholder ?? "").trim();
  }

  return "";
}

function runA11yAudit(): A11yReport {
  const hasH1 = !!document.querySelector("main h1, h1");

  const imgs = Array.from(document.querySelectorAll("img"));
  const imagesMissingAlt = imgs.filter((img) => !img.hasAttribute("alt")).length;

  const buttons = Array.from(document.querySelectorAll("button,[role='button']"));
  const buttonsMissingName = buttons.filter((b) => !accessibleName(b)).length;

  const links = Array.from(document.querySelectorAll("a,[role='link']"));
  const linksMissingName = links.filter((a) => !accessibleName(a)).length;

  const inputs = Array.from(document.querySelectorAll("input,select,textarea")).filter(
    (x) => !(x instanceof HTMLInputElement && x.type === "hidden")
  );
  const inputsMissingLabel = inputs.filter((el) => {
    const id = (el as HTMLElement).id;
    const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
    if (aria) return false;
    if (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) return false;
    // wrapped label
    if (el.closest("label")) return false;
    return true;
  }).length;

  return { hasH1, imagesMissingAlt, buttonsMissingName, linksMissingName, inputsMissingLabel };
}

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

export function EngineeringMode() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("status");

  const [grid, setGrid] = useState(false);
  const [hitboxes, setHitboxes] = useState(false);

  const [vp, setVp] = useState({ w: 0, h: 0, dpr: 1 });
  const [net, setNet] = useState<string>("");

  const [a11y, setA11y] = useState<A11yReport | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Hotkey: Cmd/Ctrl + .
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === ".") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Viewport snapshot
  useEffect(() => {
    const calc = () => setVp({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio ?? 1 });
    calc();
    window.addEventListener("resize", calc, { passive: true });
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Network hint
  useEffect(() => {
    const c = (navigator as any).connection;
    if (c?.effectiveType) setNet(`${c.effectiveType}${c.downlink ? ` • ${c.downlink}Mbps` : ""}`);
  }, []);

  // Apply overlays safely via dataset
  useEffect(() => {
    const root = document.documentElement;
    if (grid) root.dataset.grid = "1";
    else delete root.dataset.grid;

    if (hitboxes) root.dataset.hitboxes = "1";
    else delete root.dataset.hitboxes;
  }, [grid, hitboxes]);

  // Focus + scroll lock only when open
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => closeRef.current?.focus(), 0);

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Reset audit when route changes (so it reflects current DOM)
  useEffect(() => {
    setA11y(null);
  }, [pathname]);

  const tokens = useMemo(() => {
    const keys = ["--bg", "--fg", "--muted", "--card", "--border", "--brand", "--brand2", "--brand3", "--ring"] as const;
    return keys.map((k) => ({ k, v: getCssVar(k) }));
  }, [open]); // refresh when opened

  if (!open) return null;

  const panel = (
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-hidden="true" />

      {/* drawer */}
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full sm:w-[540px] border-l border-border/70 bg-card/88 shadow-lift backdrop-blur"
        role="dialog"
        aria-modal="true"
        aria-label="Engineering Mode"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 border-b border-border/70 p-5">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-fg">Engineering Mode</div>
            <div className="mt-1 text-sm text-muted">
              Internal-quality tooling: a11y, tokens, layout QA. Toggle: <span className="font-mono text-fg/80">⌘/Ctrl + .</span>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            className={cn(
              "rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-sm font-semibold text-fg/70",
              "hover:text-fg hover:bg-fg/[0.03]",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
            )}
          >
            Close
          </button>
        </div>

        {/* tabs */}
        <div className="flex gap-2 p-4">
          {([
            ["status", "Status"],
            ["a11y", "A11y"],
            ["tokens", "Tokens"],
            ["layout", "Layout"]
          ] as const).map(([k, label]) => {
            const active = tab === k;
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={cn(
                  "relative inline-flex min-h-[44px] items-center rounded-2xl px-3 text-sm font-semibold transition-colors duration-200",
                  "border border-border/70 bg-card/60",
                  "hover:bg-fg/[0.03]",
                  active && "text-fg",
                  !active && "text-fg/70"
                )}
              >
                {label}
                {active ? (
                  <span className="absolute -bottom-[6px] left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-brand via-brand2 to-brand3" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* body */}
        <div className="h-[calc(100%-168px)] overflow-auto px-5 pb-6">
          {tab === "status" ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                <div className="text-xs text-muted">Route</div>
                <div className="mt-1 font-mono text-sm font-semibold text-fg">{pathname}</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                  <div className="text-xs text-muted">Viewport</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-fg">
                    {vp.w}×{vp.h}
                  </div>
                  <div className="mt-1 text-xs text-muted">DPR: {vp.dpr}</div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                  <div className="text-xs text-muted">Network</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-fg">{net || "unknown"}</div>
                  <div className="mt-1 text-xs text-muted">from navigator.connection</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-gradient-to-r from-brand/[0.10] to-brand2/[0.10] p-4">
                <div className="text-xs font-semibold text-fg/80">Why this matters</div>
                <div className="mt-2 text-sm text-fg/80">
                  This panel demonstrates design-systems discipline, a11y awareness, and performance-safe interaction design.
                </div>
              </div>
            </div>
          ) : null}

          {tab === "a11y" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-fg">Quick accessibility audit</div>
                  <div className="mt-1 text-sm text-muted">Fast DOM checks (not a replacement for Lighthouse/Axe).</div>
                </div>
                <button
                  onClick={() => setA11y(runA11yAudit())}
                  className="rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-sm font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
                >
                  Run audit
                </button>
              </div>

              {a11y ? (
                <div className="space-y-2">
                  <Row label="Has H1" value={a11y.hasH1 ? "Yes" : "No"} tone={a11y.hasH1 ? "good" : "bad"} />
                  <Row label="Images missing alt" value={`${a11y.imagesMissingAlt}`} tone={a11y.imagesMissingAlt ? "warn" : "good"} />
                  <Row label="Buttons missing accessible name" value={`${a11y.buttonsMissingName}`} tone={a11y.buttonsMissingName ? "bad" : "good"} />
                  <Row label="Links missing accessible name" value={`${a11y.linksMissingName}`} tone={a11y.linksMissingName ? "warn" : "good"} />
                  <Row label="Inputs missing label/aria-label" value={`${a11y.inputsMissingLabel}`} tone={a11y.inputsMissingLabel ? "bad" : "good"} />
                </div>
              ) : (
                <div className="rounded-2xl border border-border/70 bg-card/60 p-4 text-sm text-muted">
                  Click <span className="font-semibold text-fg/80">Run audit</span> to scan the current page.
                </div>
              )}
            </div>
          ) : null}

          {tab === "tokens" ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-fg">Design tokens</div>
                  <div className="mt-1 text-sm text-muted">Live CSS variables from :root.</div>
                </div>
                <button
                  onClick={() => safeCopy(tokens.map((t) => `${t.k}: ${t.v}`).join("\n"))}
                  className="rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-sm font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
                >
                  Copy
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border/70">
                <div className="grid grid-cols-[1fr,1fr] bg-card/60 px-4 py-3 text-xs font-semibold text-muted">
                  <div>Token</div>
                  <div>Value</div>
                </div>
                <div className="divide-y divide-border/70 bg-card/40">
                  {tokens.map((t) => (
                    <div key={t.k} className="grid grid-cols-[1fr,1fr] px-4 py-3">
                      <div className="font-mono text-xs text-fg/80">{t.k}</div>
                      <div className="font-mono text-xs text-fg">{t.v || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted">
                This is the kind of “design system transparency” teams love.
              </div>
            </div>
          ) : null}

          {tab === "layout" ? (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-fg">Layout QA overlays</div>
              <div className="text-sm text-muted">Safe, non-invasive debugging overlays.</div>

              <Toggle
                label="Baseline grid overlay"
                checked={grid}
                onChange={setGrid}
                hint="Great for rhythm/spacing polish."
              />

              <Toggle
                label="Interactive hitboxes outline"
                checked={hitboxes}
                onChange={setHitboxes}
                hint="Shows tap targets & interactive boundaries."
              />

              <div className="rounded-2xl border border-border/70 bg-gradient-to-r from-brand/[0.10] to-brand2/[0.10] p-4 text-sm text-fg/80">
                Pro tip: Turn on hitboxes and tab through the page — it’s a subtle way to demonstrate keyboard-first UX.
              </div>
            </div>
          ) : null}
        </div>

        {/* footer */}
        <div className="border-t border-border/70 p-5 text-xs text-muted">
          Built-in tooling signals frontend maturity: accessibility, design systems, and performance-safe interaction design.
        </div>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}

function Row({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "good" | "warn" | "bad";
}) {
  const cls =
    tone === "good"
      ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-900"
      : tone === "warn"
      ? "border-amber-200/70 bg-amber-50/70 text-amber-900"
      : "border-rose-200/70 bg-rose-50/70 text-rose-900";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3">
      <div className="text-sm font-semibold text-fg">{label}</div>
      <div className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold", cls)}>{value}</div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-left",
        "hover:bg-fg/[0.02]"
      )}
      aria-pressed={checked}
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-fg">{label}</div>
        <div className="mt-1 text-xs text-muted">{hint}</div>
      </div>
      <span
        className={cn(
          "inline-flex h-6 w-11 items-center rounded-full border border-border/70 bg-card/70 p-1 transition",
          checked ? "justify-end" : "justify-start"
        )}
        aria-hidden="true"
      >
        <span className={cn("h-4 w-4 rounded-full", checked ? "bg-gradient-to-r from-brand via-brand2 to-brand3" : "bg-fg/30")} />
      </span>
    </button>
  );
}

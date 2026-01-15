"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { caseStudies, signatureMetrics } from "@/lib/content";
import { cn } from "@/lib/utils";

type BriefIntent = "RECRUITER" | "ENGINEER";

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

export function BriefBuilder({ className }: { className?: string }) {
  const router = useRouter();

  const [intent, setIntent] = useState<BriefIntent>("RECRUITER");
  const [selected, setSelected] = useState<string[]>(() => caseStudies.slice(0, 2).map((c) => c.slug));

  const maxPick = 3;

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const items = useMemo(
    () =>
      caseStudies.map((c) => ({
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        tags: c.tags ?? []
      })),
    []
  );

  function toggle(slug: string) {
    setSelected((prev) => {
      const has = prev.includes(slug);
      if (has) return prev.filter((s) => s !== slug);
      if (prev.length >= maxPick) return prev; // hard cap (keeps brief short)
      return [...prev, slug];
    });
  }

  function buildUrl() {
    const u = new URL("/brief", window.location.origin);
    u.searchParams.set("intent", intent);
    // stable order
    selected.forEach((s) => u.searchParams.append("cs", s));
    return u.toString();
  }

  function openBrief() {
    // no window needed; SPA navigation
    const params = new URLSearchParams();
    params.set("intent", intent);
    selected.forEach((s) => params.append("cs", s));
    router.push(`/brief?${params.toString()}`);
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-fg">Shareable hiring brief</div>
            <div className="text-sm text-muted">
              Build a 60–90s decision packet: selected case studies + metrics + links.
            </div>
          </div>
          <Badge tone="good">Elite UX</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* intent */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIntent("RECRUITER")}
            className={cn(
              "rounded-2xl border px-3 py-2 text-xs font-semibold transition",
              intent === "RECRUITER"
                ? "border-border/70 bg-gradient-to-r from-brand/[0.16] to-brand2/[0.14] text-fg"
                : "border-border/70 bg-card/60 text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
            )}
          >
            Recruiter brief
          </button>

          <button
            type="button"
            onClick={() => setIntent("ENGINEER")}
            className={cn(
              "rounded-2xl border px-3 py-2 text-xs font-semibold transition",
              intent === "ENGINEER"
                ? "border-border/70 bg-gradient-to-r from-brand/[0.16] to-brand2/[0.14] text-fg"
                : "border-border/70 bg-card/60 text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
            )}
          >
            Engineer brief
          </button>

          <div className="ml-auto text-xs text-muted">
            Pick up to <span className="font-mono text-fg/80">{maxPick}</span>
          </div>
        </div>

        {/* case studies pick */}
        <div className="grid gap-2">
          {items.map((c) => {
            const on = selectedSet.has(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggle(c.slug)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15",
                  on
                    ? "border-border/70 bg-gradient-to-r from-brand/[0.12] to-brand2/[0.10]"
                    : "border-border/70 bg-card/60 hover:bg-fg/[0.02]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-fg">{c.title}</div>
                    <div className="mt-1 clamp-2 text-sm text-muted">{c.summary}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(c.tags ?? []).slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-medium text-fg/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Badge tone={on ? "good" : "neutral"}>{on ? "included" : "add"}</Badge>
                </div>
              </button>
            );
          })}
        </div>

        {/* metrics preview */}
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
          <div className="text-xs font-semibold text-fg/80">Signature metrics (auto-included)</div>
          <div className="mt-3 grid gap-2">
            {signatureMetrics.slice(0, 4).map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <div className="text-xs text-muted">{m.label}</div>
                <div className="font-mono text-xs font-semibold text-fg">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={openBrief} disabled={selected.length === 0}>
            Open brief →
          </Button>

          <Button
            variant="secondary"
            onClick={() => safeCopy(buildUrl())}
            disabled={selected.length === 0}
          >
            Copy share link
          </Button>

          <div className="ml-auto text-xs text-muted">
            Great for sending to a recruiter/HM as a single URL.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

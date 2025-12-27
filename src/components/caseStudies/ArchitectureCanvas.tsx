"use client";

import { useEffect, useMemo, useState } from "react";
import type { ArchitectureModel, ArchEdge, ArchNode } from "@/lib/architectures";
import { Card } from "@/components/ui/Card";

function toneClasses(tone?: ArchNode["tone"]) {
  if (tone === "accent") return "border-brand/30 bg-gradient-to-r from-brand/[0.12] to-brand2/[0.10]";
  if (tone === "warn") return "border-amber-200/70 bg-amber-50/60";
  return "border-border/70 bg-card/60";
}

function laneStroke(lane?: ArchEdge["lane"]) {
  if (lane === "request") return "stroke-[3] opacity-80";
  if (lane === "async") return "stroke-[2] opacity-60";
  return "stroke-[2] opacity-45";
}

function CanvasInner({
  model,
  scenario,
  setScenario,
  height
}: {
  model: ArchitectureModel;
  scenario: ArchitectureModel["scenarios"][number]["id"];
  setScenario: (s: ArchitectureModel["scenarios"][number]["id"]) => void;
  height: number;
}) {
  const active = useMemo(() => model.scenarios.find((s) => s.id === scenario)!, [model, scenario]);
  const focus = new Set(active.focusEdgeLanes ?? []);
  const nodes = model.nodes;
  const edges = model.edges;

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const cols = [110, 340, 570];
    const rows = [90, 200, 310];
    nodes.forEach((n, i) => {
      const c = i % 3;
      const r = Math.floor(i / 3);
      map.set(n.id, { x: cols[c] ?? 110, y: rows[r] ?? 90 + r * 110 });
    });
    return map;
  }, [nodes]);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-fg">Architecture</div>
          <div className="text-sm text-muted">{model.title}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {model.scenarios.map((s) => {
            const on = s.id === scenario;
            return (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={[
                  "rounded-full border px-3 py-1 text-[11px] font-semibold transition",
                  on
                    ? "border-transparent text-white bg-gradient-to-r from-brand via-brand2 to-brand3"
                    : "border-border/70 bg-card/60 text-fg/70 hover:text-fg hover:bg-fg/[0.03]"
                ].join(" ")}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 text-sm text-fg/80">{active.note}</div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-border/70 bg-card/50">
        <div className="relative w-full" style={{ height }}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 420" aria-hidden="true">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" className="fill-fg/30" />
              </marker>
            </defs>

            {edges.map((e, idx) => {
              const a = positions.get(e.from);
              const b = positions.get(e.to);
              if (!a || !b) return null;

              const x1 = a.x + 80;
              const y1 = a.y;
              const x2 = b.x - 80;
              const y2 = b.y;

              const mx = (x1 + x2) / 2;
              const path = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;

              const emphasized = focus.size === 0 ? true : focus.has(e.lane);
              return (
                <g key={idx}>
                  <path
                    d={path}
                    className={[
                      "fill-none stroke-fg/25",
                      laneStroke(e.lane),
                      emphasized ? "opacity-100" : "opacity-25"
                    ].join(" ")}
                    markerEnd="url(#arrow)"
                  />
                  {e.label ? (
                    <text
                      x={mx}
                      y={(y1 + y2) / 2 - 6}
                      className={emphasized ? "fill-fg/60" : "fill-fg/30"}
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {e.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>

          <div className="absolute inset-0">
            {nodes.map((n) => {
              const p = positions.get(n.id)!;
              return (
                <div
                  key={n.id}
                  className={[
                    "absolute w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-3 shadow-soft",
                    toneClasses(n.tone)
                  ].join(" ")}
                  style={{ left: p.x, top: p.y }}
                >
                  <div className="text-xs font-semibold text-fg">{nodeById.get(n.id)?.title}</div>
                  <div className="mt-1 text-xs text-muted">{nodeById.get(n.id)?.subtitle}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted">Scenario emphasis highlights the path that matters.</div>
    </div>
  );
}

export function ArchitectureCanvas({ model }: { model: ArchitectureModel }) {
  const [scenario, setScenario] = useState<ArchitectureModel["scenarios"][number]["id"]>("baseline");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
    }
    if (expanded) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  return (
    <>
      <Card>
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="text-sm font-semibold text-fg">Interactive architecture</div>
          <button
            onClick={() => setExpanded(true)}
            className="rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03] transition"
          >
            Expand
          </button>
        </div>

        <CanvasInner model={model} scenario={scenario} setScenario={setScenario} height={380} />
      </Card>

      {expanded ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-fg/30 backdrop-blur-sm"
            onClick={() => setExpanded(false)}
          />

          <div className="absolute inset-0 p-4 md:p-8">
            <div className="mx-auto h-full max-w-6xl">
              <Card className="h-full">
                <div className="flex items-center justify-between px-6 pt-6">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-fg">Architecture (expanded)</div>
                    <div className="text-sm text-muted">Press Esc to close.</div>
                  </div>

                  <button
                    onClick={() => setExpanded(false)}
                    className="rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.03] transition"
                  >
                    Close
                  </button>
                </div>

                <CanvasInner model={model} scenario={scenario} setScenario={setScenario} height={Math.min(720, window.innerHeight - 220)} />
              </Card>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

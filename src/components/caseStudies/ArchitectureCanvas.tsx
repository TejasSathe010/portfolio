"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import type { ArchitectureModel, ArchEdge, ArchNode } from "@/lib/architectures";
import { Card } from "@/components/ui/Card";
import { FlowAnimator } from "./FlowAnimator";
import { useGuidedController } from "./useGuidedController";
import { GroupContainer } from "./GroupContainer";
import { FlowCommentary } from "./FlowCommentary";
import { exportAsSVG, exportAsPNG, downloadDataURL } from "./exportUtils";

function toneClasses(tone?: ArchNode["tone"]) {
  if (tone === "accent") {
    return "border-2 border-brand/50 bg-gradient-to-br from-brand/[0.18] via-brand2/[0.15] to-brand3/[0.12] shadow-xl shadow-brand/20 backdrop-blur-md";
  }
  if (tone === "warn") {
    return "border-2 border-amber-400/60 bg-gradient-to-br from-amber-50/90 via-amber-100/70 to-amber-50/90 shadow-xl shadow-amber-500/20 backdrop-blur-md";
  }
  return "border-2 border-border/90 bg-gradient-to-br from-card/95 via-card/90 to-card/95 shadow-lg shadow-fg/8 backdrop-blur-sm";
}

function laneStroke(lane?: ArchEdge["lane"]) {
  if (lane === "request") return "stroke-[3.5]";
  if (lane === "async") return "stroke-[2.5]";
  return "stroke-[2]";
}

function laneColor(lane?: ArchEdge["lane"], emphasized: boolean = true) {
  if (!emphasized) return "stroke-fg/15";
  if (lane === "request") return "stroke-brand/70";
  if (lane === "async") return "stroke-brand2/65";
  return "stroke-amber-500/60";
}

function ExportButtons({ model }: { model: ArchitectureModel }) {
  const handleExportSVG = useCallback(async () => {
    const svg = document.querySelector('svg[data-canvas-svg]') as SVGSVGElement;
    const container = svg?.closest('.relative[style*="minWidth"]') as HTMLElement;
    if (!svg || !container) return;
    
    try {
      const svgString = await exportAsSVG(svg, container);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      downloadDataURL(URL.createObjectURL(blob), `${model.title.replace(/\s+/g, "-")}-architecture.svg`);
    } catch (error) {
      console.error("SVG export failed:", error);
    }
  }, [model.title]);

  const handleExportPNG = useCallback(async () => {
    const container = document.querySelector('.relative[style*="minWidth"]') as HTMLElement || 
                     document.querySelector('.relative[ref]') as HTMLElement;
    if (!container) return;
    
    try {
      const dataURL = await exportAsPNG(container, 2200, 1000);
      downloadDataURL(dataURL, `${model.title.replace(/\s+/g, "-")}-architecture.png`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "PNG export failed";
      alert(message);
      console.error("PNG export failed:", error);
    }
  }, [model.title]);

  return (
    <>
      <button
        onClick={handleExportSVG}
        className="rounded-lg border border-border/60 bg-card/60 px-2.5 py-1 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.05] transition-all"
        aria-label="Export as SVG"
      >
        Export SVG
      </button>
      <button
        onClick={handleExportPNG}
        className="rounded-lg border border-border/60 bg-card/60 px-2.5 py-1 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.05] transition-all"
        aria-label="Export as PNG"
      >
        Export PNG
      </button>
    </>
  );
}

function CanvasInner({
  model,
  scenario,
  setScenario,
  height,
  mode = "static",
  speed = 1,
  visibleLanes = new Set(["request", "async", "control"]),
  onExport,
  guidedControllerRef
}: {
  model: ArchitectureModel;
  scenario: ArchitectureModel["scenarios"][number]["id"];
  setScenario: (s: ArchitectureModel["scenarios"][number]["id"]) => void;
  height: number;
  mode?: "ambient" | "guided" | "static";
  speed?: number;
  visibleLanes?: Set<ArchEdge["lane"]>;
  onExport?: (type: "svg" | "png") => void;
  guidedControllerRef?: React.MutableRefObject<ReturnType<typeof useGuidedController> | null>;
}) {
  const active = useMemo(() => model.scenarios.find((s) => s.id === scenario)!, [model, scenario]);
  const focus = new Set(active.focusEdgeLanes ?? []);
  const nodes = model.nodes;
  const edges = model.edges;
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const timeline = active.timeline || [];
  const guidedController = useGuidedController({
    timeline,
    speed,
    onStepChange: () => {}
  });

  useEffect(() => {
    if (guidedControllerRef) {
      guidedControllerRef.current = guidedController;
    }
  }, [guidedController, guidedControllerRef]);

  const activeEdgeIds = mode === "guided" ? guidedController.activeEdgeIds : new Set<string>();
  const visitedEdgeIds = mode === "guided" ? guidedController.visitedEdgeIds : new Set<string>();

  const ambientActiveEdges = mode === "ambient" 
    ? new Set(edges.filter(e => focus.has(e.lane)).map(e => e.id || `${e.from}-${e.to}`))
    : new Set<string>();
  
  const finalActiveEdgeIds = mode === "guided" ? activeEdgeIds : ambientActiveEdges;

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();

    const incomingCount = new Map<string, number>();
    const outgoingCount = new Map<string, number>();
    nodes.forEach(n => {
      incomingCount.set(n.id, 0);
      outgoingCount.set(n.id, 0);
    });
    
    edges.forEach(e => {
      incomingCount.set(e.to, (incomingCount.get(e.to) ?? 0) + 1);
      outgoingCount.set(e.from, (outgoingCount.get(e.from) ?? 0) + 1);
    });

    const depthMap = new Map<string, number>();
    const roots = nodes.filter(n => (incomingCount.get(n.id) ?? 0) === 0);
    if (roots.length === 0 && nodes.length > 0) {
      depthMap.set(nodes[0]!.id, 0);
    } else {
      roots.forEach(n => depthMap.set(n.id, 0));
    }
    
    let changed = true;
    let iterations = 0;
    while (changed && iterations < 30) {
      changed = false;
      iterations++;
      edges.forEach(e => {
        const fromDepth = depthMap.get(e.from);
        if (fromDepth !== undefined) {
          const currentToDepth = depthMap.get(e.to);
          const newDepth = fromDepth + 1;
          if (currentToDepth === undefined || newDepth > currentToDepth) {
            depthMap.set(e.to, newDepth);
            changed = true;
          }
        }
      });
    }

    const nodesByDepth = new Map<number, typeof nodes>();
    nodes.forEach(n => {
      const depth = depthMap.get(n.id) ?? 0;
      if (!nodesByDepth.has(depth)) nodesByDepth.set(depth, []);
      nodesByDepth.get(depth)!.push(n);
    });

    const maxDepth = Math.max(...Array.from(depthMap.values()), 0);
    const canvasWidth = 2200; 
    const canvasHeight = 1000; 
    const horizontalPadding = 200;
    const verticalPadding = 160;
    const availableWidth = canvasWidth - horizontalPadding * 2;
    const availableHeight = canvasHeight - verticalPadding * 2;

    const minColSpacing = 420;
    const colSpacing = maxDepth > 0 
      ? Math.max(minColSpacing, availableWidth / (maxDepth + 1))
      : availableWidth / 2;
    const startX = horizontalPadding;
    const startY = verticalPadding;
    
    nodesByDepth.forEach((depthNodes, depth) => {
      const nodeCount = depthNodes.length;

      let rowSpacing: number;
      if (nodeCount === 1) {
        rowSpacing = 0;
      } else if (nodeCount <= 3) {
        
        rowSpacing = Math.max(260, Math.min(availableHeight / (nodeCount + 2), 300));
      } else {
        
        rowSpacing = Math.max(240, Math.min(availableHeight / (nodeCount + 1), 280));
      }
      
      const totalHeight = nodeCount > 1 ? (nodeCount - 1) * rowSpacing : 0;
      const centerY = startY + availableHeight / 2;
      const offsetY = centerY - totalHeight / 2;
      
      depthNodes.forEach((n, idx) => {
        const x = startX + depth * colSpacing;
        const y = nodeCount === 1 ? centerY : offsetY + idx * rowSpacing;
        map.set(n.id, { x, y });
      });
    });
    
    return map;
  }, [nodes, edges]);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const edgePaths = useMemo(() => {
    const map = new Map<string, string>();
    edges.forEach((e) => {
      const a = positions.get(e.from);
      const b = positions.get(e.to);
      if (!a || !b) return;

      const nodeWidth = 160;
      const nodeHeight = 70;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const angle = Math.atan2(dy, dx);
      const halfWidth = nodeWidth / 2;
      const halfHeight = nodeHeight / 2;
      const x1 = a.x + halfWidth * Math.cos(angle);
      const y1 = a.y + halfHeight * Math.sin(angle);
      const x2 = b.x - halfWidth * Math.cos(angle);
      const y2 = b.y - halfHeight * Math.sin(angle);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const curvature = Math.min(distance * 0.45, 150);
      const cp1x = x1 + curvature;
      const cp1y = y1;
      const cp2x = x2 - curvature;
      const cp2y = y2;
      const path = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
      map.set(e.id || `${e.from}-${e.to}`, path);
    });
    return map;
  }, [edges, positions]);

  const activeNodeIds = useMemo(() => {
    const ids = new Set<string>();
    finalActiveEdgeIds.forEach((edgeId) => {
      const edge = edges.find(e => (e.id || `${e.from}-${e.to}`) === edgeId);
      if (edge) {
        ids.add(edge.from);
        ids.add(edge.to);
      }
    });
    return ids;
  }, [finalActiveEdgeIds, edges]);

  const edgeRenderingData = useMemo(() => {
    return edges.map((e) => {
      const a = positions.get(e.from);
      const b = positions.get(e.to);
      if (!a || !b) return null;
      
      const edgeId = e.id || `${e.from}-${e.to}`;
      const nodeWidth = 160;
      const nodeHeight = 70;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const angle = Math.atan2(dy, dx);
      const halfWidth = nodeWidth / 2;
      const halfHeight = nodeHeight / 2;
      const x1 = a.x + halfWidth * Math.cos(angle);
      const y1 = a.y + halfHeight * Math.sin(angle);
      const x2 = b.x - halfWidth * Math.cos(angle);
      const y2 = b.y - halfHeight * Math.sin(angle);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const curvature = Math.min(distance * 0.45, 150);
      const cp1x = x1 + curvature;
      const cp1y = y1;
      const cp2x = x2 - curvature;
      const cp2y = y2;
      const path = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      
      return { edge: e, edgeId, path, mx, my };
    }).filter((d): d is NonNullable<typeof d> => d !== null);
  }, [edges, positions]);

  const handleExportSVG = useCallback(async () => {
    if (!svgRef.current || !canvasRef.current) return;
    try {
      const svgString = await exportAsSVG(svgRef.current, canvasRef.current);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      downloadDataURL(URL.createObjectURL(blob), `${model.title.replace(/\s+/g, "-")}-architecture.svg`);
      onExport?.("svg");
    } catch (error) {
      console.error("SVG export failed:", error);
    }
  }, [model.title, onExport]);

  const handleExportPNG = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const dataURL = await exportAsPNG(canvasRef.current, 2200, 1000);
      downloadDataURL(dataURL, `${model.title.replace(/\s+/g, "-")}-architecture.png`);
      onExport?.("png");
    } catch (error) {
      console.error("PNG export failed:", error);
    }
  }, [model.title, onExport]);

  useEffect(() => {
    
  }, [handleExportSVG, handleExportPNG]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-4">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-fg">Architecture</div>
          <div className="text-sm text-muted break-words line-clamp-2">{model.title}</div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {model.scenarios.map((s) => {
            const on = s.id === scenario;
            return (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={[
                  "rounded-full border-2 px-3 py-1 text-xs font-bold transition-all duration-200 shadow-sm",
                  on
                    ? "border-transparent text-white bg-gradient-to-r from-brand via-brand2 to-brand3 shadow-md shadow-brand/30 hover:shadow-lg hover:scale-105"
                    : "border-border/80 bg-card/70 text-fg/70 hover:text-fg hover:bg-fg/[0.05] hover:border-border hover:scale-105"
                ].join(" ")}
                aria-label={`Switch to ${s.label} scenario`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-border/60 bg-gradient-to-br from-card/90 via-card/85 to-card/90 p-4 text-sm text-fg/90 break-words leading-relaxed shadow-md backdrop-blur-sm">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand via-brand2 to-brand3" />
          <div className="flex-1 space-y-1">
            <span className="font-medium">{active.note}</span>
            {mode === "guided" && active.timeline && active.timeline.length > 0 && (
              <div className="text-xs text-muted/70 pt-1">
                <span className="font-semibold">Guided mode:</span> Use Play to step through {active.timeline.length} steps. Each step shows what&apos;s happening in the system flow.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border-2 border-border/90 bg-gradient-to-br from-card/98 via-card/95 to-card/98 shadow-2xl backdrop-blur-md relative">
        {}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          {}
          <div 
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(var(--fg)) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(var(--fg)) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
          {}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.02] via-transparent to-brand2/[0.02] pointer-events-none" />
        </div>
        
        <div ref={canvasRef} className="relative" style={{ width: '100%', minWidth: 2200, height, minHeight: 1000 }}>
          {}
          {model.groups?.map((group) => (
            <GroupContainer
              key={group.id}
              group={group}
              nodePositions={positions}
              nodeWidth={160}
              nodeHeight={70}
              canvasWidth={2200}
              canvasHeight={1000}
            />
          ))}
          
          {}
          <svg 
            ref={svgRef}
            data-canvas-svg
            className="absolute inset-0 h-full w-full z-0" 
            viewBox="0 0 2200 1000" 
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', minWidth: 2200, pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <defs>
              <marker 
                id="arrow-request" 
                markerWidth="10" 
                markerHeight="10" 
                refX="9" 
                refY="5" 
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L10,5 L0,10 Z" className="fill-brand" />
              </marker>
              <marker 
                id="arrow-async" 
                markerWidth="10" 
                markerHeight="10" 
                refX="9" 
                refY="5" 
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L10,5 L0,10 Z" className="fill-brand2" />
              </marker>
              <marker 
                id="arrow-control" 
                markerWidth="10" 
                markerHeight="10" 
                refX="9" 
                refY="5" 
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L10,5 L0,10 Z" className="fill-amber-500" />
              </marker>
              <marker 
                id="arrow-dimmed" 
                markerWidth="8" 
                markerHeight="8" 
                refX="7" 
                refY="4" 
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L8,4 L0,8 Z" className="fill-fg/20" />
              </marker>
            </defs>

            {edgeRenderingData.map(({ edge: e, edgeId, path, mx, my }) => {
              const isActive = finalActiveEdgeIds.has(edgeId);
              const isVisited = visitedEdgeIds.has(edgeId);
              const isVisible = visibleLanes.has(e.lane);
              const emphasized = (focus.size === 0 || focus.has(e.lane)) && isVisible;

              const edgeEmphasis = isActive ? 1.3 : isVisited ? 1.1 : 1.0;
              const strokeWidth = emphasized 
                ? (e.lane === "request" ? 8 : e.lane === "async" ? 7 : 6.5) * edgeEmphasis
                : 5;
              
              const arrowId = emphasized
                ? (e.lane === "request" ? "arrow-request" : e.lane === "async" ? "arrow-async" : "arrow-control")
                : "arrow-dimmed";

              const strokeColor = emphasized
                ? (e.lane === "request" ? "#7c3aed" : e.lane === "async" ? "#d946ef" : "#f59e0b")
                : "#666666";
              
              const opacity = isActive ? 1 : isVisited ? 0.75 : emphasized ? 0.9 : 0.35;

              const activeStrokeWidth = isActive ? strokeWidth * 1.2 : strokeWidth;
              
              return (
                <g key={edgeId}>
                  {}
                  {emphasized && (
                    <>
                      <path
                        d={path}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth + 12}
                        opacity="0.3"
                        markerEnd="none"
                        style={{ filter: 'blur(10px)' }}
                      />
                      <path
                        d={path}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth + 8}
                        opacity="0.4"
                        markerEnd="none"
                        style={{ filter: 'blur(6px)' }}
                      />
                    </>
                  )}
                  {}
                  <path
                    data-edge-id={edgeId}
                    d={path}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={activeStrokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd={`url(#${arrowId})`}
                    opacity={opacity}
                    style={{
                      filter: isActive 
                        ? `drop-shadow(0 4px 12px ${strokeColor}40)` 
                        : emphasized 
                        ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))' 
                        : 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))',
                      transition: prefersReducedMotion ? 'none' : 'opacity 300ms ease-out, stroke-width 300ms ease-out'
                    }}
                  />
                  {e.label ? (
                    <g>
                      {}
                      <rect
                        x={mx - (e.label.length * 4.2 + 10)}
                        y={my - 12}
                        width={e.label.length * 8.4 + 20}
                        height={20}
                        rx={5}
                        className={emphasized 
                          ? "fill-white/95 dark:fill-card/98 stroke-2 stroke-border/70 shadow-lg backdrop-blur-sm" 
                          : "fill-white/85 dark:fill-card/90 stroke stroke-border/50 shadow-md backdrop-blur-sm"}
                        strokeWidth={emphasized ? 1.5 : 1}
                        style={{
                          filter: emphasized ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))'
                        }}
                      />
                    <text
                      x={mx}
                        y={my + 1}
                        className={emphasized ? "fill-fg/95" : "fill-fg/60"}
                        fontSize="10"
                        fontWeight={emphasized ? "700" : "600"}
                      textAnchor="middle"
                        dominantBaseline="middle"
                        letterSpacing="0.03em"
                        style={{
                          textShadow: emphasized ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                      {e.label}
                    </text>
                    </g>
                  ) : null}
                </g>
              );
            })}
          </svg>

          {}
          {mode !== "static" && (
            <FlowAnimator
              edges={edges}
              edgePaths={edgePaths}
              activeEdgeIds={finalActiveEdgeIds}
              visitedEdgeIds={visitedEdgeIds}
              mode={mode}
              speed={speed}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}

          {}
          <div className="absolute inset-0 z-20">
            {nodes.map((n) => {
              const p = positions.get(n.id);
              if (!p) return null;
              
              const isActive = activeNodeIds.has(n.id);
              const node = nodeById.get(n.id);
              return (
                <div
                  key={n.id}
                  className={[
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 p-5 shadow-2xl transition-all duration-500 ease-out",
                    "hover:scale-115 hover:z-30 hover:shadow-3xl hover:-translate-y-1",
                    "backdrop-blur-md",
                    "group",
                    isActive ? "ring-2 ring-brand/50 ring-offset-2 ring-offset-card" : "",
                    toneClasses(n.tone)
                  ].join(" ")}
                  style={{ 
                    left: `${(p.x / 2200) * 100}%`, 
                    top: `${(p.y / 1000) * 100}%`,
                    width: '160px',
                    maxWidth: '160px',
                    minHeight: '70px'
                  }}
                >
                  {}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: n.tone === "accent" 
                        ? "radial-gradient(circle at 50% 30%, rgba(var(--brand), 0.15), transparent 75%)"
                        : n.tone === "warn"
                        ? "radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.15), transparent 75%)"
                        : "radial-gradient(circle at 50% 30%, rgba(var(--fg), 0.08), transparent 75%)"
                    }}
                  />
                  
                  {}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden"
                  >
                    <div 
                      className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"
                      style={{
                        animation: 'shimmer 2s infinite'
                      }}
                    />
                  </div>
                  
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-extrabold text-fg line-clamp-2 break-words leading-tight tracking-tight flex-1">
                        {node?.title}
                      </div>
                      {n.badge && (
                        <div className="shrink-0 px-2 py-0.5 rounded-md bg-brand/20 border border-brand/40 text-[10px] font-bold text-brand">
                          {n.badge}
                        </div>
                      )}
                    </div>
                    {node?.subtitle && (
                      <div className="text-[11px] text-muted/95 line-clamp-2 break-words leading-snug font-semibold">
                        {node.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-gradient-to-r from-card/50 via-card/40 to-card/50 px-4 py-2.5 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand/80 shadow-sm shadow-brand/30" />
            <div>
              <span className="font-semibold text-fg/90">Request</span>
              <span className="text-[10px] text-muted/70 ml-1.5">HTTP/API calls</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand2/80 shadow-sm shadow-brand2/30" />
            <div>
              <span className="font-semibold text-fg/90">Async</span>
              <span className="text-[10px] text-muted/70 ml-1.5">Message queues, streams</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/30" />
            <div>
              <span className="font-semibold text-fg/90">Control</span>
              <span className="text-[10px] text-muted/70 ml-1.5">Coordination, transactions</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-muted/70">
            <div className="h-1 w-1 rounded-full bg-muted/50" />
            <span className="text-[11px] font-medium">Scenario emphasis highlights active paths</span>
          </div>
        </div>

        {}
        {mode === "guided" && active.timeline && active.timeline.length > 0 && (
          <FlowCommentary
            model={model}
            currentStep={guidedController.currentStep}
            activeEdgeIds={guidedController.activeEdgeIds}
            timeline={active.timeline}
            mode={mode}
          />
        )}
      </div>
    </div>
  );
}

export function ArchitectureCanvas({ model }: { model: ArchitectureModel }) {
  const [scenario, setScenario] = useState<ArchitectureModel["scenarios"][number]["id"]>("baseline");
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<"ambient" | "guided" | "static">("static");
  const [speed, setSpeed] = useState(1);
  const [visibleLanes, setVisibleLanes] = useState<Set<ArchEdge["lane"]>>(new Set(["request", "async", "control"]));
  const guidedControllerRef = useRef<ReturnType<typeof useGuidedController> | null>(null);
  const [playButtonState, setPlayButtonState] = useState(false);

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
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-sm font-bold text-fg">Interactive Architecture</div>
              <div className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                Beta v1
              </div>
            </div>
            <div className="text-xs text-muted">Explore system flows and scenarios</div>
            <div className="text-[10px] text-muted/70 italic">Note: Beta version - may have some issues. Working on fixes.</div>
          </div>
          <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(true)}
              className="rounded-xl border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.05] hover:border-border hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Expand architecture diagram"
          >
            Expand
          </button>
          </div>
        </div>

        {}
        <div className="px-5 pt-4 pb-3 border-b border-border/40 bg-gradient-to-br from-card/50 via-card/40 to-card/50">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-fg/90">Mode:</span>
              <div className="flex rounded-xl border border-border/60 bg-card/60 p-1 shadow-sm">
                {(["static", "ambient", "guided"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      if (m !== "guided" && guidedControllerRef.current) {
                        guidedControllerRef.current.reset();
                        setPlayButtonState(false);
                      }
                    }}
                    className={[
                      "px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200",
                      mode === m
                        ? "bg-gradient-to-r from-brand via-brand2 to-brand3 text-white shadow-md shadow-brand/30"
                        : "text-fg/60 hover:text-fg/90 hover:bg-fg/[0.05]"
                    ].join(" ")}
                    aria-label={`Set mode to ${m}`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {mode === "guided" && (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (guidedControllerRef.current) {
                        if (guidedControllerRef.current.isPlaying) {
                          guidedControllerRef.current.pause();
                          setPlayButtonState(false);
                        } else {
                          if (guidedControllerRef.current.currentStep < 0) {
                            guidedControllerRef.current.goToStep(0);
                          }
                          guidedControllerRef.current.play();
                          setPlayButtonState(true);
                        }
                      }
                    }}
                    className="rounded-xl border-2 border-border/70 bg-card/70 px-3 py-1.5 text-xs font-bold text-fg/80 hover:text-fg hover:bg-fg/[0.08] hover:border-border transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5"
                    aria-label={playButtonState ? "Pause" : "Play guided animation"}
                  >
                    <span className="text-sm">{playButtonState ? "⏸" : "▶"}</span>
                    <span>{playButtonState ? "Pause" : "Play"}</span>
                  </button>
                  <button
                    onClick={() => {
                      guidedControllerRef.current?.stepBack();
                      setPlayButtonState(false);
                    }}
                    className="rounded-xl border border-border/60 bg-card/60 px-2.5 py-1.5 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.05] transition-all shadow-sm"
                    aria-label="Step back"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => {
                      guidedControllerRef.current?.stepForward();
                      setPlayButtonState(false);
                    }}
                    className="rounded-xl border border-border/60 bg-card/60 px-2.5 py-1.5 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.05] transition-all shadow-sm"
                    aria-label="Step forward"
                  >
                    ⏭
                  </button>
                  <button
                    onClick={() => {
                      guidedControllerRef.current?.reset();
                      setPlayButtonState(false);
                    }}
                    className="rounded-xl border border-border/60 bg-card/60 px-2.5 py-1.5 text-xs font-semibold text-fg/70 hover:text-fg hover:bg-fg/[0.05] transition-all shadow-sm"
                    aria-label="Reset animation"
                  >
                    ↺ Reset
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-fg/90">Speed:</span>
                  <div className="flex rounded-xl border border-border/60 bg-card/60 p-1 shadow-sm">
                    {[0.5, 1, 1.5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={[
                          "px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-200",
                          speed === s
                            ? "bg-brand/20 text-brand shadow-sm"
                            : "text-fg/60 hover:text-fg/90 hover:bg-fg/[0.05]"
                        ].join(" ")}
                        aria-label={`Set speed to ${s}x`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
                {guidedControllerRef.current && guidedControllerRef.current.totalSteps > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted/70">
                    <span>Step {guidedControllerRef.current.currentStep + 1} / {guidedControllerRef.current.totalSteps}</span>
                  </div>
                )}
              </>
            )}

            <div className="ml-auto flex items-center gap-2">
              <ExportButtons model={model} />
            </div>
          </div>
        </div>

        <CanvasInner 
          model={model} 
          scenario={scenario} 
          setScenario={setScenario} 
          height={1000}
          mode={mode}
          speed={speed}
          visibleLanes={visibleLanes}
          guidedControllerRef={guidedControllerRef}
        />
      </Card>

      {expanded ? (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-fg/30 backdrop-blur-sm"
            onClick={() => setExpanded(false)}
          />

          <div className="absolute inset-0 flex flex-col p-4 md:p-8">
            <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col min-h-0">
              <Card className="flex-1 flex flex-col min-h-0 shadow-2xl">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/60 shrink-0">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-fg">Architecture (expanded)</div>
                    <div className="text-xs text-muted">Press Esc to close.</div>
                  </div>

                  <button
                    onClick={() => setExpanded(false)}
                    className="rounded-xl border-2 border-border/80 bg-card/80 px-4 py-2 text-xs font-bold text-fg/80 hover:text-fg hover:bg-fg/[0.05] hover:border-border hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    aria-label="Close architecture view"
                  >
                    Close
                  </button>
                </div>

                <div className="flex-1 overflow-auto min-h-0">
                  <CanvasInner 
                    model={model} 
                    scenario={scenario} 
                    setScenario={setScenario} 
                    height={Math.min(1400, typeof window !== 'undefined' ? window.innerHeight - 180 : 1200)} 
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { ArchEdge } from "@/lib/architectures";

type Particle = {
  id: string;
  progress: number;
  pathLength: number;
};

type FlowAnimatorProps = {
  edges: ArchEdge[];
  edgePaths: Map<string, string>;
  activeEdgeIds: Set<string>;
  visitedEdgeIds: Set<string>;
  mode: "ambient" | "guided" | "static";
  speed: number;
  prefersReducedMotion: boolean;
};

export function FlowAnimator({
  edges,
  edgePaths,
  activeEdgeIds,
  visitedEdgeIds,
  mode,
  speed,
  prefersReducedMotion
}: FlowAnimatorProps) {
  const [particles, setParticles] = useState<Map<string, Particle>>(new Map());
  const rafRef = useRef<number>();
  const pathLengthsRef = useRef<Map<string, number>>(new Map());
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timeout = setTimeout(() => {
      const svg = document.querySelector('svg[data-canvas-svg]') as SVGSVGElement;
      if (!svg) return;

      const lengths = new Map<string, number>();

      edges.forEach((edge) => {
        const edgeId = edge.id || `${edge.from}-${edge.to}`;
        const pathEl = svg.querySelector(`path[data-edge-id="${edgeId}"]`) as SVGPathElement;
        if (pathEl) {
          try {
            const length = pathEl.getTotalLength();
            lengths.set(edgeId, length);
          } catch {
            lengths.set(edgeId, 200);
          }
        } else {
          lengths.set(edgeId, 200);
        }
      });

      pathLengthsRef.current = lengths;
    }, 100);

    return () => clearTimeout(timeout);
  }, [edges, prefersReducedMotion]);

  const activeEdgeIdsRef = useRef(activeEdgeIds);
  const visitedEdgeIdsRef = useRef(visitedEdgeIds);
  const modeRef = useRef(mode);
  const speedRef = useRef(speed);
  
  useEffect(() => {
    activeEdgeIdsRef.current = activeEdgeIds;
    visitedEdgeIdsRef.current = visitedEdgeIds;
    modeRef.current = mode;
    speedRef.current = speed;
  }, [activeEdgeIds, visitedEdgeIds, mode, speed]);

  useEffect(() => {
    if (prefersReducedMotion || mode === "static") {
      setParticles(new Map());
      return;
    }

    const animate = () => {
      setParticles((prev) => {
        const next = new Map(prev);
        const currentActive = activeEdgeIdsRef.current;
        const currentVisited = visitedEdgeIdsRef.current;
        const currentMode = modeRef.current;
        const currentSpeed = speedRef.current;

        edges.forEach((edge) => {
          const edgeId = edge.id || `${edge.from}-${edge.to}`;
          const isActive = currentActive.has(edgeId);
          const isVisited = currentVisited.has(edgeId);
          const shouldAnimate = (currentMode === "ambient" && (isActive || isVisited)) || (currentMode === "guided" && isActive);

          if (shouldAnimate) {
            const current = next.get(edgeId);
            const pathLength = pathLengthsRef.current.get(edgeId) || 200;
            const baseSpeed = currentMode === "ambient" ? 0.3 : 1.0;
            const delta = (baseSpeed * currentSpeed * 16) / pathLength; 

            if (current) {
              let newProgress = current.progress + delta;
              if (newProgress >= 1) {
                if (currentMode === "ambient") {
                  newProgress = 0; 
                } else {
                  newProgress = 1; 
                }
              }
              next.set(edgeId, { ...current, progress: newProgress });
            } else {
              next.set(edgeId, { id: edgeId, progress: 0, pathLength });
            }
          } else {
            next.delete(edgeId);
          }
        });

        return next;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [edges, prefersReducedMotion]);

  const getPointOnPath = (edgeId: string, progress: number): { x: number; y: number } | null => {
    if (prefersReducedMotion) return null;

    const svg = document.querySelector('svg[data-canvas-svg]') as SVGSVGElement;
    if (!svg) return null;

    const pathEl = svg.querySelector(`path[data-edge-id="${edgeId}"]`) as SVGPathElement;
    if (!pathEl) return null;

    try {
      const length = pathEl.getTotalLength();
      const point = pathEl.getPointAtLength(length * progress);
      return { x: point.x, y: point.y };
    } catch {
      return null;
    }
  };

  if (prefersReducedMotion || mode === "static") {
    return null;
  }

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 h-full w-full z-10 pointer-events-none"
      viewBox="0 0 2200 1000"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', minWidth: 2200 }}
      aria-hidden="true"
    >
      {Array.from(particles.entries()).map(([edgeId, particle]) => {
        const edge = edges.find(e => (e.id || `${e.from}-${e.to}`) === edgeId);
        if (!edge) return null;

        const point = getPointOnPath(edgeId, particle.progress);
        if (!point) return null;

        const strokeColor = edge.lane === "request" ? "#7c3aed" : edge.lane === "async" ? "#d946ef" : "#f59e0b";

        return (
          <circle
            key={`particle-${edgeId}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={strokeColor}
            opacity={0.9}
            style={{
              filter: `drop-shadow(0 0 4px ${strokeColor})`,
              transition: prefersReducedMotion ? 'none' : 'opacity 200ms'
            }}
          />
        );
      })}
    </svg>
  );
}

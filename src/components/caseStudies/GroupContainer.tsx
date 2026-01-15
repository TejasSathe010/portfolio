"use client";

import { useMemo } from "react";
import type { ArchNode } from "@/lib/architectures";

type GroupContainerProps = {
  group: {
    id: string;
    title: string;
    caption?: string;
    nodeIds: string[];
  };
  nodePositions: Map<string, { x: number; y: number }>;
  nodeWidth: number;
  nodeHeight: number;
  canvasWidth: number;
  canvasHeight: number;
};

export function GroupContainer({
  group,
  nodePositions,
  nodeWidth,
  nodeHeight,
  canvasWidth,
  canvasHeight
}: GroupContainerProps) {
  const bounds = useMemo(() => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    group.nodeIds.forEach((nodeId) => {
      const pos = nodePositions.get(nodeId);
      if (!pos) return;

      const left = pos.x - nodeWidth / 2;
      const right = pos.x + nodeWidth / 2;
      const top = pos.y - nodeHeight / 2;
      const bottom = pos.y + nodeHeight / 2;

      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, right);
      maxY = Math.max(maxY, bottom);
    });

    if (minX === Infinity) {
      return null;
    }

    const padding = 20;
    return {
      x: minX - padding,
      y: minY - padding - 30, 
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2 + 30
    };
  }, [group.nodeIds, nodePositions, nodeWidth, nodeHeight]);

  if (!bounds) return null;

  return (
    <div
      className="absolute rounded-2xl border-2 border-border/50 bg-gradient-to-br from-card/40 via-card/30 to-card/40 backdrop-blur-md pointer-events-none z-5 shadow-lg"
      style={{
        left: `${(bounds.x / canvasWidth) * 100}%`,
        top: `${(bounds.y / canvasHeight) * 100}%`,
        width: `${(bounds.width / canvasWidth) * 100}%`,
        height: `${(bounds.height / canvasHeight) * 100}%`,
      }}
    >
      {}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/[0.03] via-transparent to-brand2/[0.03] pointer-events-none" />
      
      <div className="absolute -top-7 left-4 px-3 py-1.5 rounded-xl bg-gradient-to-r from-card/95 via-card/90 to-card/95 border border-border/70 backdrop-blur-md shadow-md">
        <div className="text-xs font-bold text-fg/95 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-brand/60" />
          {group.title}
        </div>
        {group.caption && (
          <div className="text-[10px] text-muted/80 mt-1 font-medium">{group.caption}</div>
        )}
      </div>
    </div>
  );
}

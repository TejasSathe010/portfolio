"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function CopyLinkButton({
  anchorId,
  label = "Copy link",
  className
}: {
  anchorId: string;
  label?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin;
    return `${base}${pathname}#${anchorId}`;
  }, [pathname, anchorId]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function onCopy() {
    try {
      const target = url || `${window.location.origin}${pathname}#${anchorId}`;
      await navigator.clipboard.writeText(target);
      setCopied(true);
    } catch {
      // fallback: do nothing (still safe)
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`${label}: ${anchorId}`}
      className={cn(
        "group inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-semibold",
        "text-fg/70 hover:text-fg hover:bg-fg/[0.03] transition",
        className
      )}
    >
      <span className="grid h-6 w-6 place-items-center rounded-xl border border-border/70 bg-card/60">
        {copied ? "✓" : "⧉"}
      </span>
      <span className="hidden sm:inline">{copied ? "Copied" : "Link"}</span>
    </button>
  );
}

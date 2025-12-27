"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type BuildMeta = {
  bootedAt: string;
  node: string;
  env: "vercel" | "local";
  commit: string | null;
  branch: string | null;
};

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3">
      <div className="text-muted">{k}</div>
      <div className="font-mono font-semibold text-fg">{v}</div>
    </div>
  );
}

export function BuildPanel() {
  const [data, setData] = useState<BuildMeta | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/meta/build", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        setData(j);
        setFailed(false);
      })
      .catch(() => {
        setFailed(true);
        setData(null);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-fg">Build & runtime</div>
            <div className="mt-1 text-sm text-muted">Proves CI/CD and environment awareness.</div>
          </div>
          <Badge tone={failed ? "warn" : data?.env === "vercel" ? "good" : "neutral"}>
            {failed ? "unavailable" : data?.env ?? "…"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <Row k="Node" v={data?.node ?? "—"} />
        <Row k="Branch" v={data?.branch ?? "—"} />
        <Row k="Commit" v={data?.commit?.slice(0, 8) ?? "—"} />

        <div className="text-xs text-muted">
          Booted: <span className="font-mono text-fg/80">{data?.bootedAt ?? "—"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

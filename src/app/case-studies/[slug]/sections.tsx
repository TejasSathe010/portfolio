"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import type { Intent } from "@/lib/site";
import { useIntent } from "@/components/IntentProvider";

type Notes = Partial<Record<Intent, { focus: string; whatToAskMe: string[] }>>;

export function IntentNote({ notes }: { notes: Notes }) {
  const { intent } = useIntent();
  const n = notes[intent];
  if (!n) return null;

  return (
    <Card>
      <CardHeader>
        <div className="inline-flex items-center gap-2 text-xs text-fg/70">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-brand2" />
          Reviewer lens
          <span className="text-fg/35">•</span>
          <span className="text-muted">{intent === "RECRUITER" ? "Recruiter view" : "Hiring manager view"}</span>
        </div>

        <div className="mt-2 text-sm font-semibold text-fg">What to focus on in this case</div>
        <div className="mt-1 text-sm text-muted">This section adapts based on your selected lens.</div>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
          <div className="text-xs font-semibold text-muted">Focus</div>
          <div className="mt-2 text-sm font-medium text-fg/85">{n.focus}</div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
          <div className="text-xs font-semibold text-muted">Good questions</div>
          <ul role="list" className="mt-3 space-y-2 text-sm text-fg/80">
            {n.whatToAskMe.map((q) => (
              <li key={q} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand2" />
                <span className="text-pretty">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

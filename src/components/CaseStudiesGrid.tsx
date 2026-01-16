"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { caseStudies } from "@/lib/content";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { useIntent } from "@/components/IntentProvider";

type SortKey = "recommended" | "relevance" | "recent" | "title";
const SORT_KEYS: SortKey[] = ["recommended", "relevance", "recent", "title"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function monthIndex(m: string) {
  const map: Record<string, number> = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12
  };
  return map[m.toLowerCase().slice(0, 3)] ?? 0;
}

function parseTimelineEndYYYYMM(timeline?: string) {
  if (!timeline) return 0;

  const s = timeline.replace("—", "–");
  if (/present|current|now/i.test(s)) return 999999;

  const re = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/gi;
  const matches = [...s.matchAll(re)];
  const last = matches.at(-1);
  if (!last) return 0;

  const mon = last[1];
  const year = last[2];
  if (!mon || !year) return 0;

  const m = monthIndex(mon);
  const y = Number(year);
  if (!m || !Number.isFinite(y)) return 0;

  return y * 100 + m;
}

function scoreQueryMatch(hay: string, q: string) {
  const qq = normalize(q);
  if (!qq) return 0;

  let score = 0;
  if (hay.includes(qq)) score += 50;

  const parts = qq.split(/\s+/g).filter(Boolean);
  for (const p of parts) {
    if (p.length <= 1) continue;
    if (hay.includes(p)) score += 10;
  }
  return score;
}

function impactSignals(text: string) {
  const n = (text.match(/\b\d+(\.\d+)?\b/g) ?? []).length;
  const kpi =
    (text.match(/\b(p95|p99|latency|uptime|rps|throughput|errors?|slo|sli|mttr|rollout|scale)\b/gi) ?? []).length;
  const strongUnits =
    (text.match(/\b(ms|s|%|k\s*rps|rps|calls|queries|records|events)\b/gi) ?? []).length;

  return n * 2 + kpi * 3 + strongUnits * 4;
}

function systemsSignals(text: string) {
  const sys =
    (text.match(
      /\b(tradeoffs?|invariants?|idempotenc|outbox|exactly-once|replay|rollback|canary|error budget|retry|backpressure|consisten|schema|otel|observability|kafka|kubernetes|envoy|nginx|raft)\b/gi
    ) ?? []).length;

  const safety =
    (text.match(/\b(staged|safe(?:ty)?|guardrails?|blast radius|de-risk|rollback|monitor|alert|slo)\b/gi) ?? [])
      .length;

  return sys * 4 + safety * 3;
}

function coerceSort(v: string | null): SortKey {
  if (!v) return "recommended";
  const x = v as SortKey;
  return SORT_KEYS.includes(x) ? x : "recommended";
}

function useDebouncedValue<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function CaseStudiesGrid() {
  const router = useRouter();
  const sp = useSearchParams();
  const { intent } = useIntent();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // ---- URL -> state (so /case-studies?sort=recommended actually applies) ----
  const hydratedRef = useRef(false);

  useEffect(() => {
    const urlQ = sp.get("q") ?? "";
    const urlTag = sp.get("tag");
    const urlSort = coerceSort(sp.get("sort"));

    setQ((prev) => (prev === urlQ ? prev : urlQ));
    setActiveTag((prev) => (prev === urlTag ? prev : urlTag));
    setSort((prev) => (prev === urlSort ? prev : urlSort));

    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  // ---- state -> URL (so your UI stays shareable + back button works) ----
  const qDebounced = useDebouncedValue(q, 150);
  const lastUrlRef = useRef<string>("");

  useEffect(() => {
    if (!hydratedRef.current) return;

    const usp = new URLSearchParams();
    usp.set("sort", sort);

    const qq = qDebounced.trim();
    if (qq) usp.set("q", qq);
    if (activeTag) usp.set("tag", activeTag);

    const next = `/case-studies?${usp.toString()}`;
    if (next === lastUrlRef.current) return;

    lastUrlRef.current = next;
    router.replace(next, { scroll: false });
  }, [qDebounced, activeTag, sort, router]);

  // Precompute per-case-study signals once
  const index = useMemo(() => {
    return caseStudies.map((c) => {
      const hay = normalize(
        [
          c.title,
          c.summary,
          c.timeline ?? "",
          c.role ?? "",
          c.tags.join(" "),
          c.problem,
          c.constraints?.join(" ") ?? "",
          c.approach?.join(" ") ?? "",
          c.architecture?.join(" ") ?? "",
          c.outcomes?.join(" ") ?? "",
          c.tradeoffs?.join(" ") ?? ""
        ].join(" ")
      );

      const recruiterScore = impactSignals(
        normalize([c.title, c.summary, ...(c.highlights ?? []), ...(c.outcomes ?? [])].join(" "))
      );

      const hmScore = systemsSignals(
        normalize([c.problem, ...(c.constraints ?? []), ...(c.architecture ?? []), ...(c.tradeoffs ?? [])].join(" "))
      );

      const yyyymm = parseTimelineEndYYYYMM(c.timeline);

      return { c, hay, recruiterScore, hmScore, yyyymm };
    });
  }, []);

  // Keyboard helpers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.getAttribute("contenteditable") === "true";

      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }

      if (e.key === "Escape") {
        if (q || activeTag) {
          e.preventDefault();
          setQ("");
          setActiveTag(null);
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, activeTag]);

  const topTags = useMemo(() => {
    const m = new Map<string, number>();
    for (const cs of caseStudies) {
      for (const t of cs.tags) m.set(t, (m.get(t) ?? 0) + 1);
    }
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([t]) => t);
  }, []);

  const filtered = useMemo(() => {
    const s = normalize(q);

    const list = index
      .map((x) => {
        const tagOk = activeTag ? x.c.tags.includes(activeTag) : true;

        const qScore = scoreQueryMatch(x.hay, s);
        const qOk = !s ? true : qScore > 0 || x.hay.includes(s);

        const lensScore = intent === "RECRUITER" ? x.recruiterScore : x.hmScore;

        return { ...x, tagOk, qOk, qScore, lensScore };
      })
      .filter((x) => x.tagOk && x.qOk);

    const cmpTitle = (a: string, b: string) => a.localeCompare(b);

    if (sort === "title") {
      list.sort((a, b) => cmpTitle(a.c.title, b.c.title));
    } else if (sort === "recent") {
      list.sort((a, b) => (b.yyyymm ?? 0) - (a.yyyymm ?? 0) || cmpTitle(a.c.title, b.c.title));
    } else if (sort === "relevance") {
      list.sort(
        (a, b) =>
          (b.qScore - a.qScore) ||
          (b.lensScore - a.lensScore) ||
          (b.yyyymm - a.yyyymm) ||
          cmpTitle(a.c.title, b.c.title)
      );
    } else {
      // recommended
      if (s) {
        list.sort(
          (a, b) =>
            (b.qScore - a.qScore) ||
            (b.lensScore - a.lensScore) ||
            (b.yyyymm - a.yyyymm) ||
            cmpTitle(a.c.title, b.c.title)
        );
      } else {
        list.sort(
          (a, b) =>
            (b.lensScore - a.lensScore) ||
            (b.yyyymm - a.yyyymm) ||
            (intent === "RECRUITER" ? b.recruiterScore - a.recruiterScore : b.hmScore - a.hmScore) ||
            cmpTitle(a.c.title, b.c.title)
        );
      }
    }

    return list.map((x) => x.c);
  }, [q, activeTag, sort, intent, index]);

  const activeLabel = activeTag ? `Tag: ${activeTag}` : q ? `Search: “${q.trim()}”` : "All";

  const lensHint =
    intent === "RECRUITER"
      ? "Ordered by measurable outcomes + recency. Scan highlights first."
      : "Ordered by system design depth + tradeoffs. Open Architecture + Tradeoffs first.";

  const showClearAll = Boolean(q || activeTag);

  return (
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-fg">Find a case study</div>
                <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-fg/80 leading-5">
                {intent === "RECRUITER" ? "Recruiter lens" : "Hiring manager lens"}
              </span>
            </div>
              <div className="text-xs text-fg/80 leading-6">
                Press <span className="font-mono text-fg">/</span> to focus •{" "}
                <span className="font-mono text-fg">Esc</span> to clear •{" "}
              <span className="text-fg/70">{lensHint}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by keyword, tag, system, or outcome…"
                className="w-full md:w-[420px] rounded-md border border-border bg-surface px-4 py-2.5 pr-10 text-sm outline-none
                           focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                aria-label="Search case studies"
              />
              {q ? (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border bg-surface px-2 py-1 text-xs font-semibold text-fg/70
                             hover:text-fg hover:bg-surface-2 transition-all duration-180"
                  aria-label="Clear search"
                  title="Clear"
                >
                  ×
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-muted" htmlFor="cs-sort">
                Sort
              </label>
              <select
                id="cs-sort"
                value={sort}
                onChange={(e) => setSort(coerceSort(e.target.value))}
                className="min-h-[44px] rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none
                           focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                aria-label="Sort case studies"
              >
                <option value="recommended">Recommended</option>
                <option value="relevance">Relevance</option>
                <option value="recent">Recent</option>
                <option value="title">Title</option>
              </select>
            </div>

            {showClearAll ? (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setActiveTag(null);
                  setSort("recommended");
                  inputRef.current?.focus();
                }}
                className="min-h-[44px] rounded-md border border-border bg-surface px-3 text-xs font-semibold text-fg/70
                           hover:text-fg hover:bg-surface-2 hover:border-border-accent transition-all duration-180"
              >
                Clear all
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-180 leading-5",
              !activeTag
                ? "border-accent/40 bg-accent-tint/10 text-fg"
                : "border-border bg-surface text-fg/70 hover:text-fg hover:bg-accent2-tint/5 hover:border-accent2/30"
            )}
            aria-pressed={!activeTag}
          >
            All
          </button>

          {topTags.map((t) => {
            const on = activeTag === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTag(on ? null : t)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-180 leading-5",
                  on
                    ? "border-accent/40 bg-accent-tint/10 text-fg"
                    : "border-border bg-surface text-fg/70 hover:text-fg hover:bg-accent2-tint/5 hover:border-accent2/30"
                )}
                aria-pressed={on}
              >
                {t}
              </button>
            );
          })}

          <div className="ml-auto text-xs text-fg/60 leading-6">
            <span className="font-semibold text-fg">{filtered.length}</span> results •{" "}
            <span className="text-fg/70">{activeLabel}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 items-stretch [grid-auto-rows:1fr]">
        {filtered.map((c) => (
          <CaseStudyCard
            key={c.slug}
            href={`/case-studies/${c.slug}`}
            title={c.title}
            summary={c.summary}
            timeline={c.timeline}
            tags={c.tags}
            bullets={c.highlights}
            pdfPath={c.pdfPath}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-border/70 bg-card/70 p-6 text-sm text-muted shadow-soft backdrop-blur">
          No matches. Try a technology (Kafka, EKS, Redis) or a goal (latency, rollout, reliability).
        </div>
      ) : null}
    </div>
  );
}

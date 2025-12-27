import type { CaseStudy } from "@/lib/content";

export type KeyMetric = { label: string; value: string; source?: "outcomes" | "highlights" };

const reLatency = /(\bsub-?\s*)?(\d+(\.\d+)?)(ms|s)\s*(p\d{2})?/i;
const reRps = /(\d+(\.\d+)?)(\s?K|\s?M|\s?B)?\s*(RPS|req\/s|requests\/s)/i;
const reScale =
  /(\d+(\.\d+)?)(\s?K|\s?M|\s?B)\s*(monthly|weekly|daily)?\s*(calls|queries|records|events|writes)/i;
const rePercent = /(<\s*)?(\d+(\.\d+)?)%\s*(uptime|coverage|error|errors|availability)?/i;

function normalizeCount(n: string, suffix?: string) {
  const s = (suffix ?? "").trim().toUpperCase();
  return `${n}${s ? s : ""}`;
}

function addUnique(found: KeyMetric[], seen: Set<string>, label: string, value: string, source: KeyMetric["source"]) {
  if (!label || !value) return;
  if (seen.has(label)) return;
  seen.add(label);
  found.push({ label, value, source });
}

function pickFirst(texts: Array<{ s: string; source: KeyMetric["source"] }>) {
  const found: KeyMetric[] = [];
  const seen = new Set<string>();

  for (const { s, source } of texts) {
    // Latency
    const latency = s.match(reLatency);
    if (latency) {
      const n = latency[2];
      const unit = latency[4];
      if (n && unit) {
        const p =
          latency[5] ? ` ${latency[5]}` : s.toLowerCase().includes("p95") ? " p95" : "";
        addUnique(
          found,
          seen,
          "Latency",
          `${n}${unit}${p}`.replace(/\s+/g, " ").trim(),
          source
        );
      }
    }

    // Throughput (RPS)
    const rps = s.match(reRps);
    if (rps) {
      const n = rps[1];
      const suf = (rps[3] ?? "").trim().replace(/\s+/g, "");
      if (n) addUnique(found, seen, "Throughput", `${normalizeCount(n, suf)} RPS`, source);
    }

    // Scale
    const scale = s.match(reScale);
    if (scale) {
      const n = scale[1];
      const suf = (scale[3] ?? "").trim().replace(/\s+/g, "");
      const noun = scale[5];
      if (n && noun) addUnique(found, seen, "Scale", `${normalizeCount(n, suf)} ${noun}`, source);
    }

    // Percent signals (reliability/coverage/error)
    const pct = s.match(rePercent);
    if (pct) {
      const lt = (pct[1] ?? "").trim(); // "< "
      const n = pct[2];
      const kind = (pct[4] ?? "").toLowerCase();
      if (n) {
        if (kind.includes("uptime") || kind.includes("availability")) {
          addUnique(found, seen, "Reliability", `${n}%`, source);
        } else if (kind.includes("coverage")) {
          addUnique(found, seen, "Coverage", `${n}%`, source);
        } else if (kind.includes("error")) {
          addUnique(found, seen, "Error rate", `${lt ? "< " : ""}${n}%`, source);
        } else {
          // fallback heuristics
          const low = s.toLowerCase();
          if (low.includes("error")) addUnique(found, seen, "Error rate", `${lt ? "< " : ""}${n}%`, source);
          if (low.includes("uptime") || low.includes("availability"))
            addUnique(found, seen, "Reliability", `${n}%`, source);
        }
      }
    }

    if (found.length >= 4) break;
  }

  return found;
}

export function deriveKeyMetrics(cs: CaseStudy): KeyMetric[] {
  const texts = [
    ...cs.outcomes.map((s) => ({ s, source: "outcomes" as const })),
    ...cs.highlights.map((s) => ({ s, source: "highlights" as const }))
  ];

  const found = pickFirst(texts);

  // Strict-safe split indexing
  const roleFirst = (cs.role.split("•")[0] ?? cs.role).trim();

  const fallback: KeyMetric[] = [
    { label: "Focus", value: roleFirst, source: "highlights" },
    { label: "Timeline", value: cs.timeline, source: "highlights" }
  ];

  const merged: KeyMetric[] = [...found];
  for (const f of fallback) {
    if (merged.length >= 4) break;
    if (!merged.some((m) => m.label === f.label)) merged.push(f);
  }

  return merged.slice(0, 4);
}

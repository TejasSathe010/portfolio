// A tiny, dependency-free `clsx`-style helper.
// - accepts strings, arrays, objects
// - keeps your current call-sites working
export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [k: string]: unknown }
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const push = (x: ClassValue) => {
    if (!x) return;

    if (typeof x === "string") {
      out.push(x);
      return;
    }
    if (typeof x === "number") {
      if (Number.isFinite(x)) out.push(String(x));
      return;
    }
    if (Array.isArray(x)) {
      for (const v of x) push(v);
      return;
    }
    if (typeof x === "object") {
      for (const [k, v] of Object.entries(x)) {
        if (v) out.push(k);
      }
    }
  };

  for (const i of inputs) push(i);

  // preserve ordering; avoid accidental double spaces
  return out.join(" ").replace(/\s+/g, " ").trim();
}

export function absoluteUrl(path: string, base: string) {
  try {
    return new URL(path, base).toString();
  } catch {
    return path;
  }
}

export function formatMs(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n >= 1000 ? `${(n / 1000).toFixed(2)}s` : `${Math.round(n)}ms`;
}

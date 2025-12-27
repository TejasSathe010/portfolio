"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Intent } from "@/lib/site";
import { intents } from "@/lib/site";

type IntentCtx = { intent: Intent; setIntent: (intent: Intent) => void };

const IntentContext = createContext<IntentCtx | null>(null);
const STORAGE_KEY = "portfolio.intent";

function isValidIntent(x: unknown): x is Intent {
  return typeof x === "string" && intents.some((i) => i.key === x);
}

export function IntentProvider({ children }: { children: React.ReactNode }) {
  const [intent, setIntentState] = useState<Intent>("RECRUITER");

  // Load persisted intent (client-only)
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isValidIntent(saved)) setIntentState(saved);
  }, []);

  // Expose intent to CSS / analytics / debugging without prop drilling
  useEffect(() => {
    document.documentElement.setAttribute("data-intent", intent);
  }, [intent]);

  // Sync across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      if (isValidIntent(e.newValue)) setIntentState(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setIntent = useCallback((next: Intent) => {
    setIntentState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ intent, setIntent }), [intent, setIntent]);

  return <IntentContext.Provider value={value}>{children}</IntentContext.Provider>;
}

export function useIntent() {
  const ctx = useContext(IntentContext);
  if (!ctx) throw new Error("useIntent must be used within IntentProvider");
  return ctx;
}

"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

type RumPayload = {
  id: string;
  name: Metric["name"];
  value: number;
  rating?: string;
  delta?: number;
  navigationType?: string;
  url: string;
  ts: number;
};

function emitLocal(metric: Metric) {
  window.dispatchEvent(
    new CustomEvent("rum:vital", {
      detail: { name: metric.name, value: metric.value, rating: (metric as any).rating }
    })
  );
}

function sendToRum(metric: Metric) {
  const payload: RumPayload = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: (metric as any).rating,
    delta: (metric as any).delta,
    navigationType: (metric as any).navigationType,
    url: window.location.href,
    ts: Date.now()
  };

  try {
    navigator.sendBeacon?.("/api/rum", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  } catch {
    // ignore
  }
}

export function VitalsReporter() {
  useEffect(() => {
    const wrap = (m: Metric) => {
      emitLocal(m);
      sendToRum(m);
    };
    onCLS(wrap);
    onFCP(wrap);
    onINP(wrap);
    onLCP(wrap);
    onTTFB(wrap);
  }, []);

  return null;
}

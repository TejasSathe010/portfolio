export type ArchNode = {
  id: string;
  title: string;
  subtitle?: string;
  tone?: "neutral" | "accent" | "warn";
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
  lane?: "request" | "async" | "control";
};

export type ArchitectureModel = {
  title: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  scenarios: {
    id: "baseline" | "spike" | "failover" | "cache";
    label: string;
    focusEdgeLanes?: Array<ArchEdge["lane"]>;
    note: string;
  }[];
};

export const architecturesBySlug: Record<string, ArchitectureModel> = {
  // Match these keys to your existing slugs in caseStudies
  "shipment-apis-at-scale": {
    title: "Shipment APIs at Scale — request path + rollout safety",
    nodes: [
      { id: "client", title: "Client / UI", subtitle: "Requests + pagination", tone: "neutral" },
      { id: "edge", title: "Edge", subtitle: "Nginx + Envoy routing", tone: "accent" },
      { id: "api", title: "Shipment API", subtitle: "TypeScript/Express", tone: "accent" },
      { id: "cache", title: "Redis cache", subtitle: "hot keys + TTL", tone: "neutral" },
      { id: "db", title: "Postgres", subtitle: "indexed queries", tone: "neutral" },
      { id: "kafka", title: "Kafka", subtitle: "events + outbox", tone: "warn" },
      { id: "workers", title: "Workers", subtitle: "exactly-once processing", tone: "warn" }
    ],
    edges: [
      { from: "client", to: "edge", label: "HTTPS", lane: "request" },
      { from: "edge", to: "api", label: "Route + policy", lane: "control" },
      { from: "api", to: "cache", label: "read-through", lane: "request" },
      { from: "api", to: "db", label: "query", lane: "request" },
      { from: "api", to: "kafka", label: "outbox write", lane: "async" },
      { from: "kafka", to: "workers", label: "consume", lane: "async" },
      { from: "workers", to: "db", label: "update state", lane: "async" }
    ],
    scenarios: [
      {
        id: "baseline",
        label: "Baseline",
        focusEdgeLanes: ["request", "async", "control"],
        note: "Balanced request path + async pipelines. Use this to understand the full system quickly."
      },
      {
        id: "spike",
        label: "Traffic spike",
        focusEdgeLanes: ["request"],
        note: "Focus on edge routing + cache hot path. Goal: protect DB and keep p95 stable."
      },
      {
        id: "cache",
        label: "Cache warm-up",
        focusEdgeLanes: ["request"],
        note: "Shows read-through behavior and the impact of hot keys + TTL strategy on p95."
      },
      {
        id: "failover",
        label: "Safe rollout",
        focusEdgeLanes: ["control"],
        note: "Highlights control-plane routing policy changes and staged rollout guardrails."
      }
    ]
  },

  "voice-ai-orchestration": {
    title: "Voice AI Orchestration — SIP + inference + observability",
    nodes: [
      { id: "sip", title: "SIP ingress", subtitle: "call setup", tone: "neutral" },
      { id: "orch", title: "Orchestrator", subtitle: "Node control plane", tone: "accent" },
      { id: "asr", title: "Transcription", subtitle: "streaming ASR", tone: "accent" },
      { id: "gpu", title: "GPU inference", subtitle: "Flask endpoints", tone: "warn" },
      { id: "otel", title: "Tracing", subtitle: "OpenTelemetry", tone: "neutral" }
    ],
    edges: [
      { from: "sip", to: "orch", label: "session", lane: "control" },
      { from: "orch", to: "asr", label: "stream audio", lane: "request" },
      { from: "orch", to: "gpu", label: "inference", lane: "request" },
      { from: "orch", to: "otel", label: "spans/metrics", lane: "control" },
      { from: "asr", to: "otel", label: "latency signals", lane: "control" },
      { from: "gpu", to: "otel", label: "SLO tracking", lane: "control" }
    ],
    scenarios: [
      {
        id: "baseline",
        label: "Baseline",
        focusEdgeLanes: ["request", "control"],
        note: "Control-plane orchestration plus streaming paths. Track p95 latency under sustained load."
      },
      {
        id: "spike",
        label: "Peak load",
        focusEdgeLanes: ["request"],
        note: "Focus on GPU concurrency and backpressure protection to prevent p95 blowups."
      },
      {
        id: "failover",
        label: "Failure mode",
        focusEdgeLanes: ["control"],
        note: "Observability-first: identify hotspots quickly via traces and isolate the bottleneck."
      },
      {
        id: "cache",
        label: "Warm path",
        focusEdgeLanes: ["request"],
        note: "Models warm-start effects and stable routing to reduce tail latency."
      }
    ]
  }
};

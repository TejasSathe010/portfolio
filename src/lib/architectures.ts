export type ArchNode = {
  id: string;
  title: string;
  subtitle?: string;
  tone?: "neutral" | "accent" | "warn";
  // Extended fields (optional, backward compatible)
  groupId?: string;
  badge?: string;
  details?: string;
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
  lane?: "request" | "async" | "control";
  // Extended fields (optional, backward compatible)
  id?: string;
  stepKey?: string;
  durationMs?: number;
  parallelGroup?: string;
  details?: string;
};

export type TimelineStep =
  | { kind: "edge"; edgeId: string }
  | { kind: "parallel"; edges: string[] };

export type ArchitectureModel = {
  title: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  scenarios: {
    id: "baseline" | "spike" | "failover" | "cache";
    label: string;
    focusEdgeLanes?: Array<ArchEdge["lane"]>;
    note: string;
    // Extended fields (optional, backward compatible)
    timeline?: TimelineStep[];
  }[];
  // Extended fields (optional, backward compatible)
  groups?: {
    id: string;
    title: string;
    caption?: string;
    nodeIds: string[];
  }[];
};

export const architecturesBySlug: Record<string, ArchitectureModel> = {
  "exactly-once-semantics-centiro": {
    title: "Distributed Consistency: Kafka Exactly-Once Semantics (EOS)",
    nodes: [
      { id: "upstream", title: "Upstream Producer", subtitle: "Idempotent producer (acks=all)", tone: "neutral" },
      { id: "source-topic", title: "Kafka Topic: source-events", subtitle: "Partitioned log", tone: "neutral" },
      { id: "processor", title: "Processing Service", subtitle: "Consumer + Transactional Producer", tone: "accent" },
      { id: "coordinator", title: "Transaction Coordinator", subtitle: "Epoch fencing + Producer ID", tone: "warn" },
      { id: "sink-topic", title: "Kafka Topic: sink-events", subtitle: "Output stream", tone: "neutral" },
      { id: "redis", title: "Redis SETNX", subtitle: "Inbox idempotency gate", tone: "accent" },
      { id: "postgres", title: "PostgreSQL", subtitle: "Idempotent UPSERT", tone: "neutral" },
      { id: "downstream", title: "Downstream Consumer", subtitle: "External Carrier Gateway", tone: "neutral" }
    ],
    edges: [
      { id: "produce-events", from: "upstream", to: "source-topic", label: "A) Produce events (acks=all)", lane: "request" },
      { id: "read-committed", from: "source-topic", to: "processor", label: "B) read_committed", lane: "async" },
      { id: "init-txn", from: "processor", to: "coordinator", label: "1) initTransactions()", lane: "control" },
      { id: "produce-output", from: "processor", to: "sink-topic", label: "2) Produce output records", lane: "async" },
      { id: "redis-dedupe", from: "processor", to: "redis", label: "3a) SETNX inbox key", lane: "control", parallelGroup: "side-effects" },
      { id: "db-upsert", from: "processor", to: "postgres", label: "3b) PostgreSQL UPSERT", lane: "async", parallelGroup: "side-effects" },
      { id: "send-offsets", from: "processor", to: "coordinator", label: "4) sendOffsetsToTransaction()", lane: "control" },
      { id: "commit-txn", from: "coordinator", to: "sink-topic", label: "5) commitTransaction()", lane: "control" },
      { id: "downstream-read", from: "sink-topic", to: "downstream", label: "6) read_committed", lane: "request" }
    ],
    groups: [
      {
        id: "kafka-control",
        title: "Kafka Control Plane",
        caption: "Transaction coordination & fencing",
        nodeIds: ["coordinator"]
      },
      {
        id: "kafka-data",
        title: "Kafka Data Plane",
        caption: "Source & sink topics",
        nodeIds: ["source-topic", "sink-topic"]
      },
      {
        id: "side-effects",
        title: "Side Effects (Idempotency)",
        caption: "External state management",
        nodeIds: ["redis", "postgres"]
      }
    ],
    scenarios: [
      {
        id: "baseline",
        label: "Baseline",
        focusEdgeLanes: ["async", "request", "control"],
        note: "Full transactional flow: Upstream initiates transaction → Coordinator fences zombie producers → Consumer processes atomically → Redis deduplicates → Database commits → Carrier API called.",
        timeline: [
          { kind: "edge", edgeId: "produce-events" },
          { kind: "edge", edgeId: "read-committed" },
          { kind: "edge", edgeId: "init-txn" },
          { kind: "edge", edgeId: "produce-output" },
          { kind: "parallel", edges: ["redis-dedupe", "db-upsert"] },
          { kind: "edge", edgeId: "send-offsets" },
          { kind: "edge", edgeId: "commit-txn" },
          { kind: "edge", edgeId: "downstream-read" }
        ]
      },
      {
        id: "spike",
        label: "Zombie Producer Fencing",
        focusEdgeLanes: ["control"],
        note: "Epoch-based fencing prevents zombie producers from committing duplicates during GC pauses. Coordinator assigns unique producerId + epoch and invalidates older epochs for the same transactional.id.",
        timeline: [
          { kind: "edge", edgeId: "init-txn" },
          { kind: "edge", edgeId: "produce-output" }
        ]
      },
      {
        id: "failover",
        label: "Idempotency Guarantees",
        focusEdgeLanes: ["control", "async"],
        note: "Redis SETNX + PostgreSQL UPSERT ensure idempotent side effects. Even if Kafka transaction retries, external state remains consistent. read_committed isolation ensures only committed records are visible.",
        timeline: [
          { kind: "edge", edgeId: "redis-dedupe" },
          { kind: "edge", edgeId: "db-upsert" },
          { kind: "edge", edgeId: "send-offsets" }
        ]
      }
    ]
  },

  "fault-tolerance-centiro-intern": {
    title: "Fault Tolerance: Netty + Bounded Pool + Resilience4j Bulkheads",
    nodes: [
      { id: "inbound", title: "Inbound Traffic", subtitle: "HTTP requests", tone: "neutral" },
      { id: "netty", title: "Netty Event Loop", subtitle: "Non-blocking I/O", tone: "accent" },
      { id: "router", title: "Request Router", subtitle: "Fast dispatch", tone: "accent" },
      { id: "worker", title: "Global Bounded Worker Pool", subtitle: "Bounded queue + backpressure", tone: "warn" },
      { id: "bulkhead1", title: "Carrier Client: UPS", subtitle: "Bulkhead(10) + TimeLimiter + CB", tone: "accent", badge: "10" },
      { id: "bulkhead2", title: "Carrier Client: FedEx", subtitle: "Bulkhead(10) + TimeLimiter + CB", tone: "accent", badge: "10" },
      { id: "bulkhead3", title: "Carrier Client: Carrier C", subtitle: "Bulkhead(N) + TimeLimiter + CB", tone: "accent" },
      { id: "api1", title: "External API: UPS", subtitle: "Downstream gateway", tone: "neutral" },
      { id: "api2", title: "External API: FedEx", subtitle: "Downstream gateway", tone: "neutral" },
      { id: "api3", title: "External API: Carrier C", subtitle: "Downstream gateway", tone: "neutral" },
      { id: "aggregator", title: "Response Aggregator", subtitle: "Merge responses", tone: "accent" }
    ],
    edges: [
      { id: "accept", from: "inbound", to: "netty", label: "Accept connection", lane: "request" },
      { id: "dispatch", from: "netty", to: "router", label: "Dispatch (fast)", lane: "request" },
      { id: "enqueue", from: "router", to: "worker", label: "Offload to bounded pool", lane: "request" },
      { id: "isolated-1", from: "worker", to: "bulkhead1", label: "Isolated path", lane: "control", parallelGroup: "bulkheads" },
      { id: "isolated-2", from: "worker", to: "bulkhead2", label: "Isolated path", lane: "control", parallelGroup: "bulkheads" },
      { id: "isolated-3", from: "worker", to: "bulkhead3", label: "Isolated path", lane: "control", parallelGroup: "bulkheads" },
      { id: "bounded-1", from: "bulkhead1", to: "api1", label: "Bounded call", lane: "request" },
      { id: "bounded-2", from: "bulkhead2", to: "api2", label: "Bounded call", lane: "request" },
      { id: "bounded-3", from: "bulkhead3", to: "api3", label: "Bounded call", lane: "request" },
      { id: "aggregate", from: "api1", to: "aggregator", label: "Response", lane: "async", parallelGroup: "responses" },
      { id: "aggregate-2", from: "api2", to: "aggregator", label: "Response", lane: "async", parallelGroup: "responses" },
      { id: "aggregate-3", from: "api3", to: "aggregator", label: "Response", lane: "async", parallelGroup: "responses" },
      { id: "write-response", from: "aggregator", to: "netty", label: "Write response", lane: "request" }
    ],
    groups: [
      {
        id: "server-runtime",
        title: "Server Runtime",
        caption: "Non-blocking I/O + bounded execution",
        nodeIds: ["netty", "router", "worker"]
      },
      {
        id: "dependency-isolation",
        title: "Dependency Isolation",
        caption: "Per-dependency bulkheads prevent cascading failures",
        nodeIds: ["bulkhead1", "bulkhead2", "bulkhead3", "api1", "api2", "api3", "aggregator"]
      }
    ],
    scenarios: [
      {
        id: "baseline",
        label: "Baseline",
        focusEdgeLanes: ["request", "control"],
        note: "Normal flow: Inbound traffic → Netty event loop → Global worker pool (G1GC managed) → Dependency-specific bulkheads → External carrier APIs. Each bulkhead limits concurrency to prevent cascading failures.",
        timeline: [
          { kind: "edge", edgeId: "accept" },
          { kind: "edge", edgeId: "dispatch" },
          { kind: "edge", edgeId: "enqueue" },
          { kind: "parallel", edges: ["isolated-1", "isolated-2", "isolated-3"] },
          { kind: "parallel", edges: ["bounded-1", "bounded-2", "bounded-3"] },
          { kind: "parallel", edges: ["aggregate", "aggregate-2", "aggregate-3"] },
          { kind: "edge", edgeId: "write-response" }
        ]
      },
      {
        id: "spike",
        label: "Slow I/O + Timeout",
        focusEdgeLanes: ["request", "control"],
        note: "When one carrier API slows down, its bulkhead isolates the failure. TimeLimiter fires timeout, CircuitBreaker opens if threshold exceeded. Other bulkheads continue processing normally, preventing thread pool saturation.",
        timeline: [
          { kind: "edge", edgeId: "enqueue" },
          { kind: "edge", edgeId: "isolated-1" },
          { kind: "edge", edgeId: "bounded-1" }
        ]
      },
      {
        id: "failover",
        label: "Bulkhead Rejection",
        focusEdgeLanes: ["control"],
        note: "When bulkhead permits exhausted (queue full), request is rejected immediately with 429. Bounded worker pool prevents saturation. G1GC tuning (MaxGCPauseMillis=150ms) reduces pause spikes.",
        timeline: [
          { kind: "edge", edgeId: "enqueue" },
          { kind: "edge", edgeId: "isolated-2" }
        ]
      }
    ]
  },

  "rag-tail-latency-jambonz": {
    title: "RAG Optimization: Voice AI Retrieval with Time Budgets",
    nodes: [
      { id: "device", title: "User Device", subtitle: "WebSocket PCM + JSON", tone: "neutral" },
      { id: "gateway", title: "Gateway Service", subtitle: "VAD + Silence detection", tone: "accent" },
      { id: "asr", title: "ASR / Transcript Stage", subtitle: "Utterance finalization", tone: "accent" },
      { id: "orchestrator", title: "Retrieval Orchestrator", subtitle: "Bounded concurrency + time budget", tone: "warn" },
      { id: "embedding", title: "Embedding Service", subtitle: "GPU-backed inference", tone: "accent" },
      { id: "state", title: "State Hydration", subtitle: "Redis session + profile", tone: "accent" },
      { id: "pgvector", title: "Vector Store: pgvector", subtitle: "HNSW + int8 quantization", tone: "warn" },
      { id: "prompt", title: "Prompt Constructor", subtitle: "Success path < 400ms", tone: "accent" },
      { id: "fallback", title: "Fallback Context", subtitle: "Cached topK + last-known-good", tone: "neutral" },
      { id: "llm", title: "LLM Streaming Service", subtitle: "Token streaming", tone: "accent" }
    ],
    edges: [
      { id: "ws-session", from: "device", to: "gateway", label: "WebSocket session", lane: "request" },
      { id: "silence-detect", from: "gateway", to: "asr", label: "1) Silence detected / Utterance finalized", lane: "control" },
      { id: "transcript", from: "asr", to: "orchestrator", label: "2) Final transcript text", lane: "request" },
      { id: "acquire-permit", from: "orchestrator", to: "orchestrator", label: "3) Acquire permit (bounded pool)", lane: "control" },
      { id: "parallel-embed", from: "orchestrator", to: "embedding", label: "4a) Parallel: Embedding", lane: "request", parallelGroup: "retrieval-parallel" },
      { id: "parallel-state", from: "orchestrator", to: "state", label: "4b) Parallel: State hydration", lane: "request", parallelGroup: "retrieval-parallel" },
      { id: "vector-search", from: "embedding", to: "pgvector", label: "5) HNSW topK similarity", lane: "request" },
      { id: "context-merge", from: "state", to: "pgvector", label: "5) Context merge", lane: "request" },
      { id: "success-path", from: "pgvector", to: "prompt", label: "6) Success < 400ms", lane: "request" },
      { id: "timeout-path", from: "pgvector", to: "fallback", label: "6) Timeout / Error", lane: "control" },
      { id: "streaming", from: "prompt", to: "llm", label: "7) LLM streaming", lane: "request" },
      { id: "fallback-stream", from: "fallback", to: "llm", label: "7) Fallback streaming", lane: "request" },
      { id: "device-response", from: "llm", to: "gateway", label: "8) Stream to device", lane: "request" }
    ],
    groups: [
      {
        id: "realtime-edge",
        title: "Realtime Edge",
        caption: "WebSocket + VAD + ASR",
        nodeIds: ["device", "gateway", "asr"]
      },
      {
        id: "retrieval-core",
        title: "Retrieval Core",
        caption: "Bounded concurrency + parallel execution",
        nodeIds: ["orchestrator", "embedding", "state"]
      },
      {
        id: "knowledge-store",
        title: "Knowledge Store",
        caption: "Vector search with HNSW",
        nodeIds: ["pgvector"]
      },
      {
        id: "generation",
        title: "Generation",
        caption: "Prompt construction + LLM streaming",
        nodeIds: ["prompt", "fallback", "llm"]
      }
    ],
    scenarios: [
      {
        id: "baseline",
        label: "Baseline",
        focusEdgeLanes: ["request", "control"],
        note: "Full retrieval path: User device → Gateway detects silence → Retrieval service (bounded pool) → Parallel embedding + state hydration → pgvector HNSW search → Prompt construction → LLM streaming. Bounded concurrency prevents overload.",
        timeline: [
          { kind: "edge", edgeId: "ws-session" },
          { kind: "edge", edgeId: "silence-detect" },
          { kind: "edge", edgeId: "transcript" },
          { kind: "edge", edgeId: "acquire-permit" },
          { kind: "parallel", edges: ["parallel-embed", "parallel-state"] },
          { kind: "parallel", edges: ["vector-search", "context-merge"] },
          { kind: "edge", edgeId: "success-path" },
          { kind: "edge", edgeId: "streaming" },
          { kind: "edge", edgeId: "device-response" }
        ]
      },
      {
        id: "spike",
        label: "High Load + Timeout",
        focusEdgeLanes: ["request", "control"],
        note: "Bounded pool and backpressure protect the system. When retrieval exceeds capacity or time budget (400ms) expires, requests fallback to cached context. HNSW graph search maintains low latency even under load.",
        timeline: [
          { kind: "edge", edgeId: "acquire-permit" },
          { kind: "parallel", edges: ["parallel-embed", "parallel-state"] },
          { kind: "edge", edgeId: "timeout-path" },
          { kind: "edge", edgeId: "fallback-stream" }
        ]
      },
      {
        id: "cache",
        label: "Optimized Path < 400ms",
        focusEdgeLanes: ["request"],
        note: "With HNSW graph + int8 quantization, vector search completes in < 400ms. Index kept in OS page cache reduces p99 disk wait from 400ms to 45ms while maintaining NDCG above 99.5%. Parallel embedding + state hydration minimizes latency.",
        timeline: [
          { kind: "edge", edgeId: "parallel-embed" },
          { kind: "edge", edgeId: "parallel-state" },
          { kind: "edge", edgeId: "vector-search" },
          { kind: "edge", edgeId: "success-path" },
          { kind: "edge", edgeId: "streaming" }
        ]
      }
    ]
  },
  "node-esm-loader-gap-analysis": {
    title: "Architectural Walls: Node.js ESM Loader Blob Imports",
    nodes: [
      { id: "userland", title: "User-land context", subtitle: "import(blobUrl) call", tone: "neutral" },
      { id: "registry", title: "Protocol Registry", subtitle: "get_format.js (Whitelist)", tone: "warn" },
      { id: "loader", title: "ESM Loader (Worker)", subtitle: "load.js execution path", tone: "accent" },
      { id: "binding", title: "C++ Blob Binding", subtitle: "node_blob.cc", tone: "accent" },
      { id: "tls", title: "Thread-Local Registry", subtitle: "TLS storage (Isolated)", tone: "warn" },
      { id: "workaround", title: "JimmyWarting Workaround", subtitle: "MessageChannel + module.register", tone: "neutral" }
    ],
    edges: [
      { id: "call", from: "userland", to: "registry", label: "1) Schema lookup", lane: "request" },
      { id: "block", from: "registry", to: "registry", label: "Wall: Rejected protocol", lane: "control" },
      { id: "fetch", from: "loader", to: "binding", label: "2) Sync source fetch", lane: "request" },
      { id: "isolate", from: "binding", to: "tls", label: "Wall: Thread isolation", lane: "control" },
      { id: "bridge", from: "workaround", to: "loader", label: "Bridge: Cross-thread port", lane: "async" }
    ],
    groups: [
      {
        id: "js-layer",
        title: "JavaScript internals",
        caption: "Loader registry & execution",
        nodeIds: ["registry", "loader"]
      },
      {
        id: "cpp-layer",
        title: "C++ internals",
        caption: "Thread-local storage",
        nodeIds: ["binding", "tls"]
      }
    ],
    scenarios: [
      {
        id: "baseline",
        label: "The Protocol Wall",
        focusEdgeLanes: ["request", "control"],
        note: "Investigation isolated the first failure to get_format.js. The ESM loader uses a closed whitelist for protocols. Any schema not in the list is rejected before the loader even attempts a fetch.",
        timeline: [
          { kind: "edge", edgeId: "call" },
          { kind: "edge", edgeId: "block" }
        ]
      },
      {
        id: "spike",
        label: "The Isolation Wall",
        focusEdgeLanes: ["request", "control"],
        note: "Even if the protocol is accepted, the C++ layer in node_blob.cc uses Thread-Local Storage. Blobs created on the main thread are invisible to the loader worker threads, blocking synchronous resolution.",
        timeline: [
          { kind: "edge", edgeId: "fetch" },
          { kind: "edge", edgeId: "isolate" }
        ]
      },
      {
        id: "cache",
        label: "The Workaround Bridge",
        focusEdgeLanes: ["async"],
        note: "The JimmyWarting workaround bypassed these walls by using MessageChannel to transfer Blob data between threads, confirming the technical assessment of the thread-local isolation problem.",
        timeline: [
          { kind: "edge", edgeId: "bridge" }
        ]
      }
    ]
  }
};


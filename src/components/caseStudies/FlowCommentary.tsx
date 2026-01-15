"use client";

import { useMemo } from "react";
import type { ArchitectureModel, ArchEdge } from "@/lib/architectures";

type FlowCommentaryProps = {
  model: ArchitectureModel;
  currentStep: number;
  activeEdgeIds: Set<string>;
  timeline: ArchitectureModel["scenarios"][number]["timeline"];
  mode: "ambient" | "guided" | "static";
};

const stepExplanations: Record<string, Record<string, string>> = {
  "exactly-once-semantics-centiro": {
    "produce-events": "Upstream producer sends events to Kafka with idempotence enabled (acks=all). This ensures at-least-once delivery guarantees.",
    "read-committed": "Processing service consumes from source topic with read_committed isolation. Only committed transactions are visible, preventing duplicate processing.",
    "init-txn": "Processing service calls initTransactions() to register with the transaction coordinator. The coordinator assigns a producerId and epoch, fencing any zombie producers with older epochs.",
    "produce-output": "Within the transaction, the service produces output records to the sink topic. These records remain invisible until the transaction commits.",
    "redis-dedupe": "Redis SETNX provides an idempotency gate. If the eventId already exists, this step is skipped, preventing duplicate side effects.",
    "db-upsert": "PostgreSQL UPSERT ensures idempotent database writes. Even if the Kafka transaction retries, database state remains consistent.",
    "send-offsets": "sendOffsetsToTransaction() includes consumer offsets in the same Kafka transaction. Offsets and output records commit atomically.",
    "commit-txn": "Transaction coordinator commits the transaction. Output records become visible and offsets advance atomically, ensuring exactly-once semantics.",
    "downstream-read": "Downstream consumer reads from sink topic with read_committed isolation, seeing only committed records in the correct order."
  },
  "fault-tolerance-centiro-intern": {
    "accept": "Netty event loop accepts incoming HTTP connections. The event loop must remain non-blocking to handle high concurrency.",
    "dispatch": "Request router quickly dispatches the request. This happens on the event loop thread and must complete in microseconds.",
    "enqueue": "CPU-intensive or blocking work is offloaded to a bounded worker pool. If the pool is full, requests are rejected with 429 (backpressure).",
    "isolated-1": "Worker pool routes to UPS bulkhead. Each dependency has its own isolated execution path with concurrency limits.",
    "isolated-2": "Worker pool routes to FedEx bulkhead. Isolation prevents one slow dependency from affecting others.",
    "isolated-3": "Worker pool routes to Carrier C bulkhead. Each bulkhead enforces its own concurrency cap (e.g., 10 permits).",
    "bounded-1": "Bulkhead acquires permit and makes bounded call to UPS API. TimeLimiter enforces p99 timeout budget.",
    "bounded-2": "Bulkhead acquires permit and makes bounded call to FedEx API. Circuit breaker opens if failure threshold exceeded.",
    "bounded-3": "Bulkhead acquires permit and makes bounded call to Carrier C API. Retry logic handles transient failures.",
    "aggregate": "Response aggregator collects responses from all bulkheads. Partial failures are handled gracefully.",
    "write-response": "Netty writes aggregated response back to client. Event loop remains non-blocking throughout."
  },
  "rag-tail-latency-jambonz": {
    "ws-session": "User device establishes WebSocket connection for real-time audio streaming. Gateway manages session state.",
    "silence-detect": "Gateway performs Voice Activity Detection (VAD). When silence is detected, it triggers the retrieval pipeline.",
    "transcript": "ASR stage finalizes the transcript text from the audio stream. This text is used for embedding generation.",
    "acquire-permit": "Retrieval orchestrator acquires a permit from the bounded concurrency pool. If pool is full, request queues or falls back.",
    "parallel-embed": "Embedding service generates query vector from transcript using GPU-backed inference. Runs in parallel with state hydration.",
    "parallel-state": "Redis session hydration retrieves user profile and conversation context. Runs in parallel with embedding to minimize latency.",
    "vector-search": "pgvector performs HNSW graph search to find topK similar documents. Index uses int8 quantization for speed.",
    "context-merge": "Retrieved documents are merged with session state to build full context. This happens after parallel steps complete.",
    "success-path": "If vector search completes within 400ms time budget, results flow to prompt constructor for LLM preparation.",
    "timeout-path": "If time budget expires or search fails, fallback context (cached topK or last-known-good) is used instead.",
    "streaming": "LLM streaming service generates tokens incrementally. User sees responses in real-time as they're generated.",
    "fallback-stream": "Fallback path also streams to LLM, ensuring users always get a response even if retrieval fails.",
    "device-response": "Gateway streams LLM tokens back to user device via WebSocket. End-to-end latency optimized for voice interaction."
  }
};

export function FlowCommentary({
  model,
  currentStep,
  activeEdgeIds,
  timeline,
  mode
}: FlowCommentaryProps) {
  const currentExplanation = useMemo(() => {
    if (mode !== "guided" || currentStep < 0 || !timeline || currentStep >= timeline.length) {
      return null;
    }

    const step = timeline[currentStep];
    if (!step) return null;

    let slug = "exactly-once-semantics-centiro";
    const titleLower = model.title.toLowerCase();
    if (titleLower.includes("kafka") || titleLower.includes("exactly-once") || titleLower.includes("eos")) {
      slug = "exactly-once-semantics-centiro";
    } else if (titleLower.includes("fault") || titleLower.includes("bulkhead") || titleLower.includes("netty")) {
      slug = "fault-tolerance-centiro-intern";
    } else if (titleLower.includes("rag") || titleLower.includes("voice") || titleLower.includes("retrieval")) {
      slug = "rag-tail-latency-jambonz";
    }

    const explanations = stepExplanations[slug] || stepExplanations["exactly-once-semantics-centiro"];
    if (!explanations) return null;

    if (step.kind === "edge") {
      return explanations[step.edgeId] || `Processing step: ${step.edgeId}`;
    } else if (step.kind === "parallel") {
      const edgeExplanations = step.edges
        .map(eid => explanations[eid])
        .filter(Boolean);
      return edgeExplanations.length > 0
        ? `Parallel execution: ${edgeExplanations.join(" | ")}`
        : `Executing ${step.edges.length} steps in parallel`;
    }

    return null;
  }, [model.title, currentStep, timeline, mode]);

  const activeEdges = useMemo(() => {
    if (!timeline || currentStep < 0 || currentStep >= timeline.length) return [];
    
    const step = timeline[currentStep];
    if (!step) return [];
    
    if (step.kind === "edge") {
      return [step.edgeId];
    } else if (step.kind === "parallel") {
      return step.edges;
    }
    return [];
  }, [timeline, currentStep]);

  if (mode !== "guided" || !currentExplanation) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border-2 border-brand/30 bg-gradient-to-br from-brand/[0.08] via-brand2/[0.06] to-brand3/[0.08] p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand">Step {currentStep + 1}</span>
            {timeline && (
              <span className="text-xs text-muted/70">/ {timeline.length}</span>
            )}
          </div>
          <p className="text-sm text-fg/95 leading-relaxed font-medium">
            {currentExplanation}
          </p>
          {activeEdges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {activeEdges.map((edgeId) => (
                <span
                  key={edgeId}
                  className="px-2 py-0.5 rounded-md bg-brand/20 border border-brand/40 text-[10px] font-semibold text-brand"
                >
                  {edgeId}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

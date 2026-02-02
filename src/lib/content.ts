import type { Intent } from "./site";

export type EvidenceItem = {
  title: string;
  type: "PR" | "DOC" | "DASHBOARD" | "SCREENSHOT" | "REPO" | "DEMO" | "CERT";
  href: string;
  note?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  timeline: string;
  role: string;
  highlights: string[];
  problem: string;
  constraints: string[];
  approach: string[];
  architecture: string[];
  outcomes: string[];
  tradeoffs: string[];
  evidence: EvidenceItem[];
  intentNotes: Partial<Record<Intent, { focus: string; whatToAskMe: string[] }>>;
  pdfPath?: string;
};

export const professionalSummary =
  "Software Engineer building distributed services with Java, React, Node.js, Python, and AWS, delivering sub-300ms p95 latency and 99.99% uptime across high-throughput, globally deployed environments.";

export const signatureMetrics = [
  { label: "Latency", value: "Sub-300ms p95" },
  { label: "Reliability", value: "99.99% uptime" },
  { label: "Throughput", value: "25K RPS sustained" },
  { label: "Scale", value: "40M document queries" }
] as const;

export const caseStudies: CaseStudy[] = [
  {
    slug: "node-esm-loader-gap-analysis",
    title: "Architectural Gap Analysis: Node.js ESM Loader",
    pdfPath: "/case-studies/node-esm-loader-gap-analysis/Case_Study_Node_ESM_Loader.pdf",
    summary:
      "Performed a Root Cause Analysis of the Node.js internal ESM loader to identify architectural walls blocking Blob URL imports. Isolated failure points across the JS/C++ boundary and provided the technical mapping used by core contributors for a functional workaround.",
    tags: ["Node.js Core", "ESM Loader", "C++ Bindings", "V8 internals", "Thread-Local Storage"],
    timeline: "Dec 2025",
    role: "Open Source Researcher & Internals Engineer",
    highlights: [
      "Isolated failure points in the Protocol Registry, Synchronous Execution paths, and Thread-Local isolation.",
      "Identified technical barriers blocking import(blobUrls) across the JavaScript and C++ boundary.",
      "Provided the technical mapping that enabled core contributors to develop a functional workaround.",
      "Prevented community effort from being wasted on architectural dead ends."
    ],
    problem:
      "Modern browsers support dynamic imports from Blob URLs, but Node.js lacked this capability. The internal ESM loader had architectural constraints that rejected these protocols due to internal whitelists and synchronous lookup requirements that conflicted with how Blobs are stored in memory.",
    constraints: [
      "The protocol registry uses a closed whitelist for URL schemes.",
      "The load.js execution path must support synchronous require() of ES modules.",
      "Blob storage in node_blob.cc utilizes Thread-Local Storage, making it invisible to the loader worker threads.",
      "Cross-thread communication is forbidden by the synchronous constraints of the loader."
    ],
    approach: [
      "Audited the Node.js source code in lib/internal/modules/esm to identify where the protocol was rejected.",
      "Isolated the failure to the Protocol Registry Wall in get_format.js where handle schemas are whitelisted.",
      "Analyzed the Synchronous Constraint in load.js that blocks asynchronous lookups during module loading.",
      "Performed a deep-dive into src/node_blob.cc to understand Thread-Local Isolation and its impact on cross-thread visibility.",
      "Communicated findings to the community, providing the technical basis for subsequent workaround implementations."
    ],
    architecture: [
      "V8 Bindings and the JS/C++ boundary in Node.js core.",
      "The Node.js ESM loader protocol registry and handler system.",
      "Synchronous vs asynchronous execution paths in module loading.",
      "Thread-Local Storage (TLS) for Blob data in the C++ layer."
    ],
    outcomes: [
      "Validations: Core contributors built a workaround using the identified anchors (resolve, load, initialize).",
      "Efficiency: Identified architectural walls early, saving community development time.",
      "Strategic Impact: Provided a clear blueprint for the eventual migration of the Blob registry to a global state.",
      "Root Cause isolation: Documented why a direct native implementation is currently blocked by the loader threading model."
    ],
    tradeoffs: [
      "Technical Analysis: Prioritized architectural mapping over direct code contribution due to fundamental threading constraints.",
      "System Integrity: Favored long-term architectural stability over a quick but potentially breaking patch.",
      "Process Awareness: Accepted triage protocols as a necessity while maintaining high-signal communication."
    ],
    evidence: [
      {
        title: "GitHub Issue #61013",
        type: "REPO",
        href: "https://github.com/nodejs/node/issues/61013",
        note: "Official Feature Request and Technical Discussion"
      }
    ],
    intentNotes: {
      RECRUITER: {
        focus: "Systems engineering and deep root cause analysis in a major open source repository.",
        whatToAskMe: ["What makes the Node.js loader unique?", "How did you navigate a million-line codebase?", "What was the result of your analysis?"]
      },
      HIRING_MANAGER: {
        focus: "Navigating the JS/C++ boundary and understanding complex multi-threaded architectural constraints.",
        whatToAskMe: ["Explain the Thread-Local Storage isolation issue", "How the synchronous loader constraint blocks async lookups", "Why a direct PR was not feasible"]
      },
    }
  },
  {
    slug: "exactly-once-semantics-centiro",
    title: "Exactly-Once Semantics (Centiro) Preventing SEV-1 Outages",
    pdfPath: "/case-studies/Case-Study-Centiro.pdf",
    summary:
      "Prevented 12 SEV-1 outages with transactional Kafka and idempotent sinks. Used epoch-based fencing to stop zombie producers and built a SHA-256 Redis filter for carrier APIs, reducing manual data reconciliation by 15 hours per week.",
    tags: ["Kafka Transactions", "Redis", "Epoch-based Fencing", "SHA-256", "Java", "Spring Boot"],
    timeline: "Mar 2022 – Jul 2023",
    role: "Software Developer II • Distributed Systems + Reliability",
    highlights: [
      "Prevented 12 SEV-1 outages with transactional Kafka and idempotent sinks.",
      "Used epoch-based fencing to stop zombie producers during GC pauses.",
      "Built SHA-256 Redis filter for carrier API deduplication.",
      "Reduced manual data reconciliation by 15 hours per week."
    ],
    problem:
      "Zombie producers caused duplicate carrier bookings during GC pauses, leading to data inconsistencies and manual reconciliation work.",
    constraints: [
      "Carrier bookings could not be duplicated or lost.",
      "Producers needed to handle JVM GC pauses without creating duplicates.",
      "Solution needed to scale to 45K QPS without adding latency.",
      "Idempotency checks needed to be fast and reliable."
    ],
    approach: [
      "Implemented transactional Kafka producers with epoch-based fencing to prevent duplicate transactions.",
      "Built SHA-256 Redis filter to deduplicate carrier API calls.",
      "Increased transaction timeouts from 60s to 120s for peak loads.",
      "Added monitoring to track duplicate detection and transaction health."
    ],
    architecture: [
      "Transactional Kafka producers with epoch-based fencing.",
      "Redis-based SHA-256 hash filter for carrier API deduplication.",
      "Prometheus metrics for duplicate detection and transaction health.",
      "Staged rollouts with canary analysis."
    ],
    outcomes: [
      "100% reduction in consistency-related SEV-1 incidents over 12 months.",
      "Eliminated duplicate carrier bookings during GC pauses and network partitions.",
      "Reduced manual data reconciliation by 15 hours per week.",
      "Maintained 45K QPS throughput with minimal latency overhead."
    ],
    tradeoffs: [
      "Increased transaction timeouts improved resilience but required careful monitoring.",
      "Redis filter added network hop but provided fast deduplication.",
      "Epoch-based fencing added complexity but prevented zombie producers."
    ],
    evidence: [
      { title: "Kafka transaction design doc", type: "DOC", href: "#" },
      { title: "Redis filter implementation PR", type: "PR", href: "#" },
      { title: "SEV-1 incident reduction dashboard", type: "DASHBOARD", href: "#" }
    ],
    intentNotes: {
      RECRUITER: {
        focus: "Prevented critical outages and reduced operational overhead.",
        whatToAskMe: ["How many SEV-1s occurred before this?", "What was the business impact?", "How was correctness validated?"]
      },
      HIRING_MANAGER: {
        focus: "Designing for correctness under failure conditions and GC pauses.",
        whatToAskMe: ["Why epoch-based fencing over other approaches", "How the solution was validated", "Learnings about Kafka transactions"]
      },
    }
  },
  {
    slug: "fault-tolerance-centiro-intern",
    title: "Fault Tolerance (Centiro Intern) Reducing p99 Latency by 180ms",
    pdfPath: "/case-studies/Case%20Study-Centiro-Intern.pdf",
    summary:
      "Reduced p99 latency 180ms by tuning G1GC MaxGCPauseMillis to 150ms and applying Resilience4j bulkheads. Implemented semaphore isolation for 500 carrier endpoints to prevent slow I/O from saturating the worker thread pool.",
    tags: ["G1GC", "Resilience4j", "Java", "Spring Boot", "Thread Pool", "Semaphore"],
    timeline: "Feb 2025 – May 2025",
    role: "Software Engineer Intern (Graduate) • Performance + Reliability",
    highlights: [
      "Reduced p99 latency 180ms by tuning G1GC MaxGCPauseMillis to 150ms.",
      "Applied Resilience4j semaphore bulkheads for 500 carrier endpoints.",
      "Prevented slow I/O from saturating worker thread pool.",
      "Tracked improvements in Prometheus metrics and Grafana dashboards."
    ],
    problem:
      "p99 latency spiked to 1.5s due to CMS heap fragmentation and thread pool saturation. Slow carrier API calls blocked worker threads and triggered cascading timeouts.",
    constraints: [
      "p99 needed to stay under 500ms during peak load.",
      "500 carrier endpoints needed isolation without excessive overhead.",
      "CMS heap fragmentation caused unpredictable pause times.",
      "Worker threads needed protection from saturation."
    ],
    approach: [
      "Migrated from CMS to G1GC with MaxGCPauseMillis=150ms for predictable pause times.",
      "Implemented Resilience4j semaphore bulkheads to isolate 500 carrier endpoints.",
      "Adjusted MaxMetaspaceSize based on load telemetry to prevent OOMs.",
      "Added Prometheus metrics to track thread pool utilization and GC pause times."
    ],
    architecture: [
      "G1GC with MaxGCPauseMillis=150ms for predictable garbage collection.",
      "Resilience4j semaphore bulkheads per carrier endpoint.",
      "Worker thread pool with semaphore-based concurrency limits.",
      "Prometheus and Grafana dashboards for latency and GC metrics."
    ],
    outcomes: [
      "Reduced p99 latency by 180ms, from 1.5s spikes to manageable levels.",
      "Eliminated thread pool saturation and cascading timeouts.",
      "Achieved predictable GC pause times with G1GC.",
      "Maintained system stability under peak load with 500 isolated endpoints."
    ],
    tradeoffs: [
      "G1GC provided better pause time predictability but required throughput tuning.",
      "Semaphore bulkheads added overhead but were essential for isolation.",
      "MaxMetaspaceSize tuning required careful monitoring."
    ],
    evidence: [
      { title: "G1GC tuning design doc", type: "DOC", href: "#" },
      { title: "Resilience4j bulkhead implementation PR", type: "PR", href: "#" },
      { title: "Grafana latency heatmaps", type: "DASHBOARD", href: "#" }
    ],
    intentNotes: {
      RECRUITER: {
        focus: "Significant latency improvement and system stability under load.",
        whatToAskMe: ["What was the business impact of 1.5s spikes?", "How many carrier endpoints were affected?", "How was improvement validated?"]
      },
      HIRING_MANAGER: {
        focus: "Diagnosing GC and thread pool issues, and designing isolation strategies.",
        whatToAskMe: ["Why G1GC over other collectors", "How semaphore limits were sized", "What monitoring was critical"]
      },
    }
  },
  {
    slug: "rag-tail-latency-jambonz",
    title: "RAG Tail Latency (Jambonz) Reducing p99 by 320ms on 10TB Data",
    pdfPath: "/case-studies/Case-Study-Jambonz.pdf",
    summary:
      "Reduced RAG p99 by 320ms over 10TB data by migrating pgvector from IVFFlat to HNSW and adding int8 quantization. Reduced vector footprint 75% and kept index in OS page cache, NDCG above 99.5%.",
    tags: ["pgvector", "HNSW", "PostgreSQL", "Vector Search", "Quantization", "RAG"],
    timeline: "Aug 2024 – Dec 2024",
    role: "Software Engineer Intern (Graduate) • GenAI Platform + Performance",
    highlights: [
      "Reduced RAG p99 by 320ms over 10TB vector data.",
      "Migrated pgvector from IVFFlat to HNSW graph search.",
      "Added int8 quantization, reducing vector footprint by 75%.",
      "Dropped p99 disk wait from 400ms to 45ms, NDCG above 99.5%."
    ],
    problem:
      "IVFFlat indexing led to 800ms+ p99 spikes and high I/O wait on 10TB data. Vector indexes were too large for memory and required frequent disk access, causing unpredictable query latency.",
    constraints: [
      "NDCG needed to stay above 99.5% to maintain search quality.",
      "10TB of vector data required efficient indexing and memory management.",
      "p99 needed to be under 500ms for real-time RAG queries.",
      "Vector indexes needed to fit in OS page cache for performance."
    ],
    approach: [
      "Migrated pgvector indexes from IVFFlat to HNSW graph search for better recall and lower latency.",
      "Implemented int8 quantization to reduce vector footprint by 75% while keeping quality.",
      "Staggered maintenance windows and tuned maintenance_work_mem to prevent OOMs.",
      "Optimized index parameters to keep index in OS page cache."
    ],
    architecture: [
      "PostgreSQL with pgvector extension for vector storage and search.",
      "HNSW graph-based indexes with int8 quantization for memory efficiency.",
      "OS page cache for hot index segments to minimize disk I/O.",
      "Query latency tracking and NDCG quality metrics."
    ],
    outcomes: [
      "Reduced RAG p99 by 320ms, from 800ms+ spikes to manageable levels.",
      "Reduced vector footprint by 75% through int8 quantization.",
      "Dropped p99 disk wait from 400ms to 45ms by keeping index in page cache.",
      "Maintained NDCG above 99.5% with significant performance improvements."
    ],
    tradeoffs: [
      "HNSW provided better performance but required careful parameter tuning.",
      "Int8 quantization reduced memory but required quality validation.",
      "Index build times increased but were manageable with staggered maintenance."
    ],
    evidence: [
      { title: "Vector search performance design doc", type: "DOC", href: "#" },
      { title: "HNSW migration PR", type: "PR", href: "#" },
      { title: "Query performance logs", type: "DASHBOARD", href: "#" }
    ],
    intentNotes: {
      RECRUITER: {
        focus: "Major performance improvement on large-scale vector search while keeping quality.",
        whatToAskMe: ["What was the impact on user experience?", "How large was the vector dataset?", "How was quality validated?"]
      },
      HIRING_MANAGER: {
        focus: "Evaluating indexing algorithms and balancing performance vs quality tradeoffs.",
        whatToAskMe: ["Why HNSW over other algorithms", "How quantization quality was validated", "Learnings about vector search"]
      },
    }
  },
  // {
  //   slug: "voice-ai-orchestration-jambonz",
  //   title: "Voice AI Orchestration (Jambonz) 1.2M Calls/Month @ 440ms p95",
  //   summary:
  //     "Improved LLM streaming p95 to 440ms across 1.2M stateful sessions by autoscaling Node.js WebSocket gateway and Redis sessions. Implemented sticky session affinity to maintain bidirectional voice streams during horizontal scaling.",
  //   tags: ["Node.js", "WebSocket", "Redis", "Kubernetes", "AWS", "LLM", "Autoscaling"],
  //   timeline: "Aug 2024 – Dec 2024",
  //   role: "Software Engineer Intern (Graduate) • GenAI Platform + Systems",
  //   highlights: [
  //     "Improved LLM streaming p95 to 440ms across 1.2M stateful sessions.",
  //     "Autoscaled Node.js WebSocket gateway and Redis sessions for horizontal scaling.",
  //     "Implemented sticky session affinity to maintain bidirectional voice streams.",
  //     "Validated improvements through load tests and session monitoring dashboards."
  //   ],
  //   problem:
  //     "Real-time voice workloads needed consistent latency under bursts. Coordinated multiple systems (SIP routing, transcription, inference, orchestration) across horizontally scaled infrastructure with stateful WebSocket connections.",
  //   constraints: [
  //     "p95 latency targets during peak load for voice streams.",
  //     "WebSocket connections needed to persist during horizontal scaling.",
  //     "1.2M monthly sessions required efficient session management.",
  //     "Multiple systems needed stable contracts for voice flow."
  //   ],
  //   approach: [
  //     "Autoscaled Node.js WebSocket gateway with Kubernetes HPA based on connection count and CPU metrics.",
  //     "Implemented sticky session affinity using Redis session store.",
  //     "Coordinated SIP and LLM control flow across horizontally scaled EKS nodes.",
  //     "Optimized Next.js concurrent rendering and streaming for dashboard responsiveness."
  //   ],
  //   architecture: [
  //     "Node.js WebSocket gateway with Kubernetes autoscaling and sticky session affinity.",
  //     "Redis for distributed session management across horizontally scaled nodes.",
  //     "Node services managing SIP and workflow state with Redis coordination.",
  //     "Next.js with concurrent rendering and Web Workers for dashboard performance."
  //   ],
  //   outcomes: [
  //     "Processed 1.2M monthly calls with 440ms p95 latency during peak load.",
  //     "Maintained bidirectional voice streams during horizontal scaling.",
  //     "Improved INP by 150ms and increased interactivity 30% on dashboard.",
  //     "Cut infra cost 25% through automated Terraform canary rollbacks and HPA policies."
  //   ],
  //   tradeoffs: [
  //     "Sticky sessions improved reliability but required careful load balancing.",
  //     "Redis session store added network hop but enabled horizontal scaling.",
  //     "Autoscaling improved cost efficiency but required careful metric selection."
  //   ],
  //   evidence: [
  //     { title: "WebSocket autoscaling PR", type: "PR", href: "#" },
  //     { title: "Load test results", type: "DOC", href: "#" },
  //     { title: "Session monitoring dashboard", type: "DASHBOARD", href: "#" }
  //   ],
  //   intentNotes: {
  //     RECRUITER: {
  //       focus: "Scaled real-time voice AI systems to 1.2M sessions with consistent latency.",
  //       whatToAskMe: ["What was peak load?", "How was latency validated?", "What was the cost impact?"]
  //     },
  //     HIRING_MANAGER: {
  //       focus: "Designing for stateful systems at scale and managing horizontal scaling challenges.",
  //       whatToAskMe: ["How autoscaling metrics were chosen", "How session migration was handled", "Learnings about WebSocket scaling"]
  //     },
  //   }
  // }
];

export type WorkItem = {
  company: string;
  title: string;
  location?: string;
  start: string;
  end: string;
  bullets: string[];
  stack: string[];
};

export const work: WorkItem[] = [
  {
    company: "Centiro Solutions (Global Supply-Chain SaaS)",
    title: "Software Engineer Intern (Graduate)",
    location: "Boston, Massachusetts",
    start: "Feb 2025",
    end: "May 2025",
    bullets: [
      "Accelerated API integration cycle 45% by resolving 22 service conflicts using Protobuf schema evolution and gRPC methods, replacing JSON with typed schemas for independent service updates.",
      "Reduced p99 latency 180ms by tuning G1GC MaxGCPauseMillis to 150ms and applying Resilience4j bulkheads, implementing semaphore isolation for 500 carrier endpoints.",
      "Optimized React state with Redux and cut payload 40% with Apollo cache normalization across federated GraphQL domains, eliminating redundant shipping manifest over-fetching."
    ],
    stack: ["Java", "Spring Boot", "Protobuf", "gRPC", "Resilience4j", "G1GC", "React", "Redux", "GraphQL", "Apollo"]
  },
  {
    company: "FirstFive8 / Jambonz (Voice AI Infrastructure Platform)",
    title: "Software Engineer Intern (Graduate)",
    location: "Boston, Massachusetts",
    start: "Aug 2024",
    end: "Dec 2024",
    bullets: [
      "Improved LLM streaming p95 to 440ms across 1.2M stateful sessions by autoscaling Node.js WebSocket gateway and Redis sessions, implementing sticky session affinity for horizontal scaling.",
      "Reduced RAG p99 by 320ms over 10TB data by migrating pgvector from IVFFlat to HNSW and adding int8 quantization, reducing vector footprint 75% and dropping p99 disk wait from 400ms to 45ms.",
      "Cut infra cost 25% by automating Terraform canary rollbacks and setting Kubernetes HPA policies, minimizing over-provisioning during off-peak hours.",
      "Improved INP by 150ms and increased interactivity 30% by optimizing Next.js concurrent rendering and streaming, offloading heavy parsing to Web Workers."
    ],
    stack: ["Node.js", "WebSocket", "Redis", "pgvector", "HNSW", "Terraform", "Kubernetes", "AWS", "Next.js", "TypeScript"]
  },
  {
    company: "Centiro Solutions (Global Shipment & Logistics Platform)",
    title: "Software Developer II",
    location: "Pune, Maharashtra, India",
    start: "Mar 2022",
    end: "Jul 2023",
    bullets: [
      "Prevented 12 SEV-1 outages with transactional Kafka and idempotent sinks, using epoch-based fencing to stop zombie producers and building SHA-256 Redis filter for carrier APIs, reducing manual data reconciliation by 15 hours per week.",
      "Instrumented Prometheus SLIs and Grafana dashboards to pinpoint thread contention hotspots in the JVM fleet, cutting MTTR by mapping stack trace samples to service endpoints.",
      "Boosted system throughput to 45K QPS by tuning Kafka partition rebalancing and building asynchronous worker pools, optimizing consumer group coordination and producer batch sizes.",
      "Compressed LCP to 2.1s and bundle size 35% by enabling tree-shaking and lazy loading across a modular React design system, deferring non-critical component initialization."
    ],
    stack: ["Java", "Spring Boot", "Kafka Transactions", "Redis", "PostgreSQL", "Prometheus", "Grafana", "React", "Micrometer"]
  },
  {
    company: "Cognizant (Client: Discover Financial Services)",
    title: "Software Engineer",
    location: "Pune, Maharashtra, India",
    start: "Dec 2020",
    end: "Mar 2022",
    bullets: [
      "Monitored Linux services with Python asyncio and eBPF, cutting MTTR 30% with automated event correlation into ServiceNow, building probes to capture kernel-level syscalls for early failure detection.",
      "Shortened debugging cycle 45% by streaming kernel trace events to a React UI using Web Workers for parallel parsing, designing a virtualized list to handle thousands of events per second."
    ],
    stack: ["Python", "asyncio", "eBPF", "Linux", "React", "Web Workers", "ServiceNow"]
  },
  {
    company: "Polestar Consulting Pvt. Ltd.",
    title: "Software Developer Intern",
    location: "Pune, Maharashtra, India",
    start: "Jun 2019",
    end: "Feb 2020",
    bullets: [
      "Tuned Python Flask ML services to cut inference latency 240ms using Redis cache, micro-batching, and async I/O, optimizing model loading and implementing look-aside caching.",
      "Architected React dashboards and Node.js APIs to track model drift across 50k daily forecasts using stream ingestion, building an aggregation layer to reduce data store load and provide real-time alerts."
    ],
    stack: ["Python", "Flask", "Redis", "React", "Node.js", "Stream Ingestion"]
  }
];

export type AwardItem = {
  title: string;
  detail: string;
};

export const awards: AwardItem[] = [
  {
    title: "TADHack Winner 1st Place",
    detail: "Won 1st place by engineering PII redaction with Whisper AI, outperforming 40 teams for a $2K prize. Integrated a real-time audio pipeline that scrubbed sensitive data during live voice streams by fine-tuning models for medical and financial entities."
  },
  {
    title: "DevCon Winner Team Lead & Winner",
    detail: "Led 4 engineers to win by shipping a quantized edge speech translator with 95% accuracy and 1s local inference. Used INT8 quantization and custom kernels to ensure high-fidelity translation on low-power hardware without GPU or network access."
  },
  {
    title: "Jambonz Open Source Contributor",
    detail: "Hardened Jambonz OSC reliability with circuit breakers and health checks to secure a return offer. Rewrote service discovery logic to be resilient to partial network failures, preventing system-wide crashes by isolating failing SIP trunking nodes."
  }
];

export type ProjectItem = {
  name: string;
  stack: string[];
  timeframe?: string;
  links: { label: string; href: string }[];
  bullets: string[];
};

export const projects: ProjectItem[] = [
  {
    name: "Node.js Core",
    stack: ["Node.js", "C++", "V8", "ESM", "Module System"],
    links: [{ label: "GitHub Issue", href: "https://github.com/nodejs/node/issues/61013" }],
    bullets: [
      "Proposed ESM loader architecture for Node.js import(blobUrls) by mapping get_format.js and C++ sync byte fetches.",
      "Audited internal resolution logic to support dynamic code loading while keeping V8 module lifecycle integrity."
    ]
  },
  {
    name: "Redix",
    stack: ["Golang", "Raft", "LSM-tree", "Redis Protocol", "Clustering", "WAL"],
    timeframe: "Aug 2024 – Apr 2025",
    links: [{ label: "GitHub", href: "https://github.com/TejasSathe010/Redix-A-modern-twist-on-Redis" }],
    bullets: [
      "Built a Golang RESP-compliant KV store achieving 100k writes/s and 10ms p99 using Raft consensus and LSM-tree storage.",
      "Implemented Write-Ahead Logging and memory-mapped files to guarantee persistence with high concurrency across nodes."
    ]
  },
  {
    name: "Aegis Runtime",
    stack: ["Node.js", "NPM", "OpenTelemetry", "LLM", "Middleware"],
    links: [
      { label: "NPM Package", href: "https://www.npmjs.com/package/@aegis-runtime/core" },
      { label: "GitHub", href: "https://github.com/TejasSathe010/Aegis-Runtime" }
    ],
    bullets: [
      "Developed NPM middleware for LLM governance that enforced token budgets and AuthZ with OTel hooks.",
      "Implemented an interceptor pattern to analyze payloads and prevent unauthorized usage, with detailed traces for cost-saving and compliance."
    ]
  },
  {
    name: "Memorable",
    stack: ["TypeScript", "Manifest V3", "Node.js", "PGVector", "HNSW", "Chrome APIs"],
    links: [{ label: "Live", href: "https://memorable-one.vercel.app/" }],
    bullets: [
      "Neural Compression: Reduced prompt tokens by up to 40% using custom TF-IDF-like algorithms and extractive summarization.",
      "Smart Vector Memory: Implemented local-first semantic memory using Chrome storage and IndexedDB for instant context retrieval.",
      "Real-time Token Telemetry: Built granular visibility into AI spend and latency using Chrome's DeclarativeNetRequest API for intercepting network traffic."
    ]
  },
  {
    name: "TechLitHub",
    stack: ["React", "Node.js", "MongoDB", "AWS", "Redis", "TensorFlow"],
    links: [
      { label: "GitHub", href: "https://github.com/TejasSathe010/TechLitHub" },
      { label: "Live", href: "https://techlithub.netlify.app/" }
    ],
    bullets: [
      "Constructed full-stack blog system ingesting 20+ posts/sec with sub-1s FMP.",
      "Supported 1K+ monthly readers with a clean authoring and ingestion workflow."
    ]
  }
];

export type EducationItem = {
  school: string;
  degree: string;
  location: string;
  start: string;
  end: string;
};

export const education: EducationItem[] = [
  {
    school: "University of South Florida",
    degree: "Master’s Degree, Computer Systems Analysis",
    location: "Tampa, Florida, United States",
    start: "Aug 2023",
    end: "May 2025"
  },
  {
    school: "Savitribai Phule Pune University",
    degree: "Bachelor’s Degree, Computer Science",
    location: "Pune, Maharashtra, India",
    start: "Aug 2016",
    end: "May 2020"
  }
];

export const evidenceLinks = [
  { title: "Resume (PDF)", href: "/resume.pdf" },
  { title: "GitHub", href: "https://github.com/TejasSathe010" },
  { title: "LinkedIn", href: "https://www.linkedin.com/" }
];



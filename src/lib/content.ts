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
};

export const professionalSummary =
  "Software Engineer building distributed services with Python, React, Node.js, and AWS, delivering sub-300ms p95 latency and 99.99% uptime across high-throughput, globally deployed environments.";

export const signatureMetrics = [
  { label: "Latency", value: "Sub-300ms p95" },
  { label: "Reliability", value: "99.99% uptime" },
  { label: "Throughput", value: "25K RPS sustained" },
  { label: "Scale", value: "40M document queries" }
] as const;

export const caseStudies: CaseStudy[] = [
  {
    slug: "shipment-apis-at-scale-centiro",
    title: "Shipment APIs at Scale (Centiro) — 40M Queries @ 250ms p95",
    summary:
      "Refactored TypeScript/Express shipment APIs and edge routing to sustain large query volume while keeping 250ms p95 latency and <0.03% errors during rollouts.",
    tags: ["TypeScript", "Express", "Kafka", "Outbox", "Nginx", "Envoy", "AWS", "Kubernetes"],
    timeline: "Feb 2025 – May 2025",
    role: "Software Developer Intern • Backend + Platform reliability",
    highlights: [
      "Sustained 40M document queries with consistent 250ms p95 latency.",
      "Supported 25K RPS while holding error rate below 0.03% in staged cluster rollouts.",
      "Exactly-once processing for 2M weekly records via Kafka Streams + Outbox guarantees.",
      "Reduced integration regressions 38% by restructuring monorepo boundaries across React/Redux/Node."
    ],
    problem:
      "Query-heavy shipment workflows were approaching performance ceilings: inconsistent p95 latency, fragile rollouts, and integration churn from unclear boundaries across services and UI layers.",
    constraints: [
      "High cardinality queries with strict p95 targets under load.",
      "Production safety: rollouts needed predictable error budgets and reversibility.",
      "Event-driven correctness: transactional events could not duplicate or drop.",
      "Monorepo complexity: dependencies caused regressions across layers."
    ],
    approach: [
      "Refactored core shipment API paths (TypeScript + Express) around predictable query plans and stable response contracts.",
      "Re-engineered Kafka Streams processing with Outbox guarantees to enforce exactly-once semantics for transactional records.",
      "Hardened edge routing policies (Nginx/Envoy) and rollout strategy to preserve error budgets during staged deployments.",
      "Restructured React/Redux/Node monorepo boundaries to reduce cross-layer coupling and regression surface area."
    ],
    architecture: [
      "API tier: TypeScript/Express with performance-focused query patterns and stable DTOs.",
      "Event tier: Kafka Streams + Outbox pattern for idempotency and exactly-once processing.",
      "Edge tier: Nginx + Envoy routing policies tuned for RPS, retries, and rollout safety.",
      "Deployment: Kubernetes-based staged rollouts with error budget monitoring."
    ],
    outcomes: [
      "Sustained 40M document queries while maintaining ~250ms p95 latency.",
      "Supported 25K RPS with <0.03% error rates during staged rollouts.",
      "Ensured exactly-once processing for ~2M weekly transactional records.",
      "Reduced integration regressions by 38% via clearer monorepo dependency boundaries."
    ],
    tradeoffs: [
      "Optimized critical paths first; deferred non-blocking refactors to avoid rollout risk.",
      "Used strict contracts to reduce regressions; accepted slightly slower iteration on schema changes.",
      "Exactly-once guarantees added operational complexity; kept observability + replay paths explicit."
    ],
    evidence: [
      { title: "PRs: API refactor + edge routing", type: "PR", href: "#", note: "Replace with internal PR links or sanitized screenshots." },
      { title: "Kafka Outbox design note", type: "DOC", href: "#" },
      { title: "Load test / rollout dashboard", type: "DASHBOARD", href: "#" }
    ],
    intentNotes: {
      RECRUITER: {
        focus: "Scale + reliability outcomes with clear business value.",
        whatToAskMe: ["What broke before this?", "What teams consumed the API?", "How rollout safety was proven"]
      },
      HIRING_MANAGER: {
        focus: "How I prioritized work, managed risk, and designed for long-term correctness.",
        whatToAskMe: ["Tradeoffs vs fastest delivery", "What I would improve next", "How I reduced regressions structurally"]
      },
    }
  },
  {
    slug: "voice-ai-orchestration-jambonz",
    title: "Voice AI Orchestration (Jambonz) — 1.2M Calls/Month @ 450ms p95",
    summary:
      "Integrated Python inference with Node orchestration across EKS, improved GPU inference throughput by 31%, and kept transcription services within 450ms p95 under peak load.",
    tags: ["Python", "Flask", "Node.js", "AWS EKS", "GPU", "Jest", "OpenTelemetry", "SIP", "LLM"],
    timeline: "Aug 2024 – Dec 2024",
    role: "Software Developer Intern (GenAI Platform) • Systems + reliability",
    highlights: [
      "Scaled transcription microservices to 1.2M monthly calls while meeting 450ms p95 latency during peak load.",
      "Improved GPU-backed Flask inference throughput by 31% without breaching latency SLOs.",
      "Integrated Python inference with Node orchestration to coordinate SIP and LLM flows across horizontally scaled EKS nodes.",
      "Expanded Jest-driven API tests to 94% coverage to enforce deterministic behavior pre-deployment."
    ],
    problem:
      "Real-time voice workloads needed consistent latency under bursts, while coordinating multiple systems (SIP routing, transcription, inference, orchestration) across horizontally scaled infrastructure.",
    constraints: [
      "Real-time constraints: p95 latency targets during peak load.",
      "GPU inference capacity: throughput improvements could not violate latency SLOs.",
      "Distributed coordination: Node orchestration + Python inference needed stable contracts.",
      "Determinism: test coverage required to prevent subtle regressions in execution paths."
    ],
    approach: [
      "Integrated Python inference endpoints with Node orchestration to coordinate SIP + LLM control flow across EKS nodes.",
      "Tuned transcription microservices for peak-load behavior while protecting p95 latency targets.",
      "Revised GPU-backed Flask inference endpoints to increase parallel throughput while maintaining SLO guardrails.",
      "Expanded Jest API test suites to 94% coverage to ensure deterministic behavior before deployment."
    ],
    architecture: [
      "Orchestration: Node services managing SIP + workflow state.",
      "Inference: GPU-backed Flask endpoints with concurrency controls and latency guardrails.",
      "Scaling: horizontal scaling on AWS EKS with performance tracking per rollout.",
      "Quality gates: Jest-driven coverage to protect distributed execution paths."
    ],
    outcomes: [
      "Processed ~1.2M monthly calls with 450ms p95 latency during peak load.",
      "Raised GPU inference parallel throughput by 31% without breaching SLOs.",
      "Improved correctness confidence with 94% API test coverage for deterministic behavior."
    ],
    tradeoffs: [
      "Chose guardrails over maximum throughput to protect real-time latency consistency.",
      "Coverage prioritized high-risk paths first; avoided brittle tests that block iteration.",
      "Kept interfaces explicit even when verbose to reduce cross-service ambiguity."
    ],
    evidence: [
      { title: "PRs: orchestration + inference integration", type: "PR", href: "#", note: "Replace with PR links or screenshots." },
      { title: "Performance run notes", type: "DOC", href: "#" },
      { title: "Test coverage report", type: "SCREENSHOT", href: "#" }
    ],
    intentNotes: {
      RECRUITER: {
        focus: "Scale + reliability in real-time voice AI systems.",
        whatToAskMe: ["How performance was validated", "What “peak load” meant operationally"]
      },
      HIRING_MANAGER: {
        focus: "How I kept SLOs safe while improving throughput, plus quality gates.",
        whatToAskMe: ["How I chose what to tune", "How I handled rollout risk", "How I structured tests"]
      },
    }
  }
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
    title: "Software Developer Intern",
    location: "Boston, Massachusetts",
    start: "Feb 2025",
    end: "May 2025",
    bullets: [
      "Refactored shipment APIs using TypeScript and Express to sustain 40M document queries with consistent 250ms p95 latency.",
      "Restructured React, Redux, and Node.js monorepo layers; cut integration regressions 38% through clearer dependency boundaries.",
      "Re-engineered Kafka Streams flows with Outbox guarantees to ensure exactly-once processing for 2M weekly transactional records.",
      "Adjusted Nginx and Envoy routing policies to support 25K RPS while keeping error rates below 0.03% during staged cluster rollouts."
    ],
    stack: ["TypeScript", "Express", "React", "Redux", "Kafka", "Nginx", "Envoy", "Kubernetes"]
  },
  {
    company: "FirstFive8 / Jambonz (Voice AI Infrastructure Platform)",
    title: "Software Developer Intern — GenAI Platform",
    location: "Boston, Massachusetts",
    start: "Aug 2024",
    end: "Dec 2024",
    bullets: [
      "Integrated Python inference with Node orchestration to coordinate SIP and LLM flows across horizontally scaled AWS EKS nodes.",
      "Tuned transcription microservices to process 1.2M monthly calls while meeting 450ms p95 latency thresholds during peak load.",
      "Revised GPU-backed Flask inference endpoints to raise parallel throughput 31% without breaching defined model latency SLOs.",
      "Expanded Jest-driven API test suites to 94% coverage, confirming deterministic behavior across execution paths pre-deployment."
    ],
    stack: ["Python", "Flask", "Node.js", "AWS EKS", "GPU", "Jest", "SIP", "OpenTelemetry"]
  },
  {
    company: "Centiro Solutions (Global Shipment & Logistics Platform)",
    title: "Software Developer II",
    location: "Pune, Maharashtra, India",
    start: "Mar 2022",
    end: "Jul 2023",
    bullets: [
      "Rebuilt logistics workflows using React 18, GraphQL, and Spring Boot to enforce multi-tenant routing rules across Kubernetes pods.",
      "Scaled Java REST workloads with async I/O and Redis caching to reliably deliver 22K RPS under strict 99.99% availability limits.",
      "Established Protobuf-based schema evolution and GitOps flow to remove drift across 200+ Kafka producers and consumer services.",
      "Mentored junior engineers on distributed design and review methods, improving architectural consistency across three teams."
    ],
    stack: ["React 18", "GraphQL", "Spring Boot", "Redis", "Kafka", "Protobuf", "Kubernetes", "GitOps"]
  },
  {
    company: "Cognizant (Client: Discover Financial Services)",
    title: "Software Engineer",
    location: "Pune, Maharashtra, India",
    start: "Dec 2020",
    end: "Mar 2022",
    bullets: [
      "Implemented Python Flask microservices delivering telemetry APIs that processed 1.6M operational events daily under sustained load.",
      "Reduced PostgreSQL query latency 42% by refining SQLAlchemy caching strategies to maintain performance during concurrent usage.",
      "Containerized backend services with Docker and deployed on AWS ECS using Jenkins pipelines and CloudFormation automation.",
      "Enhanced Prometheus and Grafana ingestion tasks in Python to improve failure visibility and cut MTTR by nearly 65% across systems."
    ],
    stack: ["Python", "Flask", "PostgreSQL", "AWS ECS", "Jenkins", "CloudFormation", "Prometheus", "Grafana"]
  }
];

export type AwardItem = {
  title: string;
  detail: string;
};

export const awards: AwardItem[] = [
  {
    title: "TADHack Hackathon — 1st Place",
    detail: "Designed a GenAI PII-redaction pipeline for call logs, outperforming 40+ U.S. engineering teams."
  },
  {
    title: "DevCon Hackathon — Team Lead & Winner",
    detail: "Led 4 engineers to build a speech translator achieving 95% accuracy with sub-second latency."
  },
  {
    title: "Jambonz Open Source Contributor",
    detail: "Added reliability checks and CI automation to core repos, contributing to a full-time internship offer."
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
    name: "TechLitHub",
    stack: ["React", "Node.js", "MongoDB", "AWS", "Redis", "TensorFlow"],
    links: [
      { label: "GitHub", href: "#" },
      { label: "Live", href: "#" }
    ],
    bullets: [
      "Constructed full-stack blog system ingesting 20+ posts/sec while maintaining sub-1s FMP.",
      "Supported 1K+ monthly readers with a clean authoring and ingestion workflow."
    ]
  },
  {
    name: "Redix",
    stack: ["Golang", "Raft", "LSM-tree", "Redis Protocol", "Clustering"],
    timeframe: "Aug 2024 – Apr 2025",
    links: [{ label: "GitHub", href: "#" }],
    bullets: ["Built a Raft-coordinated in-memory datastore using LSM-tree storage, sustaining 100K writes/sec during EC2-based cluster tests."]
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



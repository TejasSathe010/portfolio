export type Project = {
  id: string;
  name: string;
  tagline: string;
  href: string;
  repo?: string;
  /** Optional. If provided, console will ping this to show status/latency. */
  healthUrl?: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    id: "portfolio",
    name: "Portfolio",
    tagline: "Portfolio-as-product with live metrics, console, and evidence.",
    href: "/start",
    healthUrl: "/api/meta/build",
    stack: ["Next.js", "TypeScript", "Web Vitals"]
  },
  {
    id: "techlithub",
    name: "TechLitHub",
    tagline: "Full-stack blog system ingesting 20+ posts/sec with sub-1s FMP.",
    href: "https://techlithub.com",
    repo: "https://github.com/TejasSathe010/TechLitHub",
    // healthUrl: "https://<your-techlithub-domain>/health",
    stack: ["React", "Node.js", "MongoDB", "AWS", "Redis"]
  },
  {
    id: "redix",
    name: "Redix",
    tagline: "Raft + LSM-tree datastore sustaining 100K writes/sec in cluster tests.",
    href: "https://github.com/TejasSathe010",
    repo: "https://github.com/TejasSathe010/Redix",
    stack: ["Go", "Raft", "LSM-tree", "Redis Protocol"]
  },
  {
    id: "aegisauth",
    name: "AegisAuth",
    tagline: "Policy-as-code authorization engine with explainable decisions.",
    href: "https://www.npmjs.com",
    repo: "https://github.com/TejasSathe010",
    stack: ["TypeScript", "Node.js", "Policy Engine"]
  }
];

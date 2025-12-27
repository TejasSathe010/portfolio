export const site = {
  name: "Tejas Sathe",
  tagline: "Distributed services + frontend platforms. Fast under load. Proven by metrics.",
  url: process.env.SITE_URL ?? "http://localhost:3000",
  description:
    "Software Engineer building distributed services with Python, React, Node.js, and AWS — performance, reliability, and receipts-first execution.",
  location: "Tampa, Florida, United States",
  phone: "+1 786-561-4652",
  email: "tejassathe010@gmail.com",
  socials: {
    github: "https://github.com/TejasSathe010",
    linkedin: "https://www.linkedin.com/", // replace with your real link
    email: "mailto:tejassathe010@gmail.com",
    phone: "tel:+17865614652"
  }
} as const;

export type Intent = "RECRUITER" | "HIRING_MANAGER";

export const intents: Array<{ key: Intent; label: string; hint: string }> = [
  { key: "RECRUITER", label: "Recruiter", hint: "Outcomes, scope, clarity." },
  { key: "HIRING_MANAGER", label: "Hiring Manager", hint: "Tradeoffs, leadership, impact." }
];

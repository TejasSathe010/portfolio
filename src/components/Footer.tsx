// src/components/Footer.tsx
import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function safeExternal(href: string) {
  return href?.startsWith("http") ? href : undefined;
}

export function Footer() {
  const year = new Date().getFullYear();
  const github = safeExternal(site.socials.github);
  const linkedin =
    site.socials.linkedin && site.socials.linkedin !== "https://www.linkedin.com/"
      ? safeExternal(site.socials.linkedin)
      : undefined;

  return (
    <footer className="mt-16 border-t border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="grid gap-8 md:grid-cols-12 md:items-start">
          {/* Identity / contact */}
          <div className="space-y-2 md:col-span-7">
            <div className="text-sm font-semibold text-fg">{site.name}</div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
              <span>{site.location}</span>
              <span aria-hidden="true">•</span>
              <a className="hover:text-fg" href={site.socials.phone}>
                {site.phone}
              </a>
              <span aria-hidden="true">•</span>
              <a className="hover:text-fg" href={site.socials.email}>
                {site.email}
              </a>
            </div>

            <p className="max-w-xl text-xs text-muted">
              Built as a portfolio-as-product: clear narrative, progressive disclosure, receipts when needed.
            </p>

            <div className="pt-2 text-xs text-muted/80">
              Tip: Press <span className="font-mono text-fg/80">⌘K</span> /{" "}
              <span className="font-mono text-fg/80">Ctrl+K</span> to jump anywhere.
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-5 md:flex md:justify-end">
            <nav aria-label="Footer" className="grid gap-2 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <Link className="text-fg/80 hover:text-fg" href="/start">
                  Start
                </Link>
                <Link className="text-fg/80 hover:text-fg" href="/case-studies">
                  Case studies
                </Link>
                <Link className="text-fg/80 hover:text-fg" href="/work">
                  Work
                </Link>
                <Link className="text-fg/80 hover:text-fg" href="/evidence">
                  Evidence
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {github ? (
                  <a className="text-fg/80 hover:text-fg" href={github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                ) : null}

                {linkedin ? (
                  <a className="text-fg/80 hover:text-fg" href={linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                ) : (
                  <span className="text-fg/50" title="Update site.socials.linkedin with your profile URL">
                    LinkedIn
                  </span>
                )}

                <a className="text-fg/80 hover:text-fg" href="/resume.pdf">
                  Resume
                </a>

                <a
                  className={cn(
                    "ml-auto inline-flex min-h-[40px] items-center rounded-xl border border-border/70 bg-card/70 px-3 text-xs font-semibold text-fg shadow-soft transition",
                    "hover:bg-fg/[0.03] motion-safe:hover:-translate-y-0.5 hover:shadow-lift",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
                  )}
                  href="#top"
                >
                  Back to top ↑
                </a>
              </div>
            </nav>
          </div>
        </div>

        <div className="mt-8 text-xs text-muted/80">
          © {year} {site.name}
        </div>
      </div>
    </footer>
  );
}

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
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16">
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="grid gap-8 md:grid-cols-12 md:items-start">
          {/* Identity / contact */}
          <div className="space-y-2 md:col-span-7">
            <div className="text-sm font-semibold text-fg">{site.name}</div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fg/80 leading-6">
              <span>{site.location}</span>
              <span aria-hidden="true">•</span>
              <a className="hover:text-primary transition-colors duration-[280ms] ease-out" href={site.socials.phone}>
                {site.phone}
              </a>
              <span aria-hidden="true">•</span>
              <a className="hover:text-primary transition-colors duration-[280ms] ease-out" href={site.socials.email}>
                {site.email}
              </a>
            </div>

            <p className="max-w-xl text-xs text-fg/80 leading-6 mt-2">
              Built as a portfolio-as-product: clear narrative, progressive disclosure, and proof when you need it.
            </p>

            <div className="pt-3 text-xs text-fg/60 leading-6">
              Tip: Press <span className="font-mono text-fg">⌘K</span> /{" "}
              <span className="font-mono text-fg">Ctrl+K</span> to jump anywhere.
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-5 md:flex md:justify-end">
            <nav aria-label="Footer" className="grid gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <Link className="text-fg/80 hover:text-primary transition-colors duration-[280ms] ease-out leading-6" href="/start">
                  Start
                </Link>
                <Link className="text-fg/80 hover:text-primary transition-colors duration-[280ms] ease-out leading-6" href="/case-studies">
                  Case studies
                </Link>
                <Link className="text-fg/80 hover:text-primary transition-colors duration-[280ms] ease-out leading-6" href="/work">
                  Work
                </Link>
                <Link className="text-fg/80 hover:text-primary transition-colors duration-[280ms] ease-out leading-6" href="/evidence">
                  Evidence
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {github ? (
                  <a className="text-fg/80 hover:text-primary transition-colors duration-[280ms] ease-out leading-6" href={github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                ) : null}

                {linkedin ? (
                  <a className="text-fg/80 hover:text-primary transition-colors duration-[280ms] ease-out leading-6" href={linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                ) : (
                  <span className="text-fg/50 leading-6" title="Update site.socials.linkedin with your profile URL">
                    LinkedIn
                  </span>
                )}

                <a className="text-fg/80 hover:text-primary transition-colors duration-[280ms] ease-out leading-6" href="/resume.pdf">
                  Resume
                </a>

                <a
                  className={cn(
                    "ml-auto inline-flex min-h-[44px] items-center rounded-r-btn border border-border bg-surface px-3 text-xs font-semibold text-fg shadow-sm transition-all duration-[280ms] ease-out",
                    "hover:bg-surface-2 hover:border-primary/35 motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  )}
                  href="#top"
                >
                  Back to top ↑
                </a>
              </div>
            </nav>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 text-xs text-fg/60 leading-6">
          © {year} {site.name}
        </div>
      </div>
    </footer>
  );
}

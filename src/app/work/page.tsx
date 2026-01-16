import { AwardsSection } from "@/components/AwardsSection";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { work, awards, projects, education } from "@/lib/content";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Work" };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function PillLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-[44px] items-center rounded-r-btn border border-border bg-surface px-3 text-xs font-semibold text-fg/80 shadow-sm transition-all duration-[280ms] ease-out hover:bg-surface-2 hover:border-primary/35 motion-safe:hover:-translate-y-[1px] hover:shadow-md"
    >
      {label}
    </a>
  );
}

export default function WorkPage() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <header className="space-y-4 sm:space-y-6 py-8 sm:py-12">
        <div className="inline-flex items-center gap-2 rounded-r-btn border border-border bg-surface px-3 py-2 text-xs text-fg/70 shadow-sm">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
          Scannable timeline • progressive disclosure • highlights first
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-[1.07] text-balance relative pl-4">
          <div className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-gradient-to-b from-primary to-secondary" />
          <span className="relative">Work</span>
        </h1>

        <p className="text-[15px] sm:text-base leading-7 text-muted max-w-prose text-pretty">
          Read the first two highlights per role for a quick overview. Expand for full details and technical stack when needed.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <PillLink href="#roles" label="Roles" />
          <PillLink href="#projects" label="Projects" />
          <PillLink href="#awards" label="Awards" />
          <PillLink href="#education" label="Education" />
        </div>
      </header>

      <section id="roles" className="scroll-mt-28 py-16 md:py-24 space-y-6" aria-label="Roles">
        {work.map((w) => {
          const id = slugify(`${w.company}-${w.title}`);
          return (
            <Card key={id} id={id} className="scroll-mt-28">
              <CardHeader>
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-fg leading-6">{w.title}</div>
                    <div className="text-sm text-fg/80 leading-6">
                      {w.company}
                      {w.location ? ` • ${w.location}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-fg/80">
                    <span className="rounded-full border border-border bg-surface px-3 py-1 font-semibold text-fg/80 leading-5">
                      {w.start} — {w.end}
                    </span>
                    <a
                      href={`#${id}`}
                      className="hidden rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-fg/70 hover:text-fg hover:bg-surface-2 transition-all duration-180 md:inline-flex"
                      aria-label="Permalink"
                      title="Permalink"
                    >
                      #
                    </a>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="text-sm text-fg/80 leading-7">
                {/* Top signal */}
                <ul className="space-y-3">
                  {w.bullets.slice(0, 2).map((b) => (
                    <li key={b} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span className="text-pretty break-words">{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Progressive disclosure */}
                {w.bullets.length > 2 || w.stack.length > 0 ? (
                  <details className="group mt-6 rounded-lg border border-border bg-surface p-4 sm:p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-fg outline-none min-h-[44px]">
                      <span>Show full details</span>
                      <span className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-fg/70">
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>

                    <div className="mt-5 grid gap-4 md:grid-cols-[1.3fr,0.7fr]">
                      <ul className="space-y-3">
                        {w.bullets.slice(2).map((b) => (
                          <li key={b} className="flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            />
                            <span className="text-pretty break-words">{b}</span>
                          </li>
                        ))}
                      </ul>

                      {w.stack?.length ? (
                        <div>
                          <div className="text-xs font-semibold text-fg/80 leading-6">Stack</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {w.stack.slice(0, 14).map((s) => (
                              <span
                                key={s}
                                className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-fg/80 leading-5"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </details>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      <section className="scroll-mt-28 py-16 md:py-24" id="projects" aria-label="Projects">
        <div className="mb-8 md:mb-10">
          <h2>Projects</h2>
          <p className="mt-3 max-w-prose">Projects demonstrating full ownership: end-to-end delivery, reliability, and measurable outcomes.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => {
            const externalLinks = p.links.filter((l) => l.href.startsWith("http"));
            const hasLinks = p.links.length > 0 && p.links.some((l) => l.href !== "#");

            return (
              <Card key={p.name} className="group h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-fg leading-6">{p.name}</h3>
                        {p.timeframe && (
                          <span className="rounded-r-chip border border-secondary/30 bg-secondary-tint/8 px-2.5 py-1 text-[10px] font-medium text-fg/70 leading-4 whitespace-nowrap">
                            {p.timeframe}
                          </span>
                        )}
                      </div>
                    </div>
                    {hasLinks && (
                      <div className="flex shrink-0 items-center gap-1.5">
                        {externalLinks.length > 0 && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.stack.slice(0, 8).map((s) => (
                      <span
                        key={s}
                        className="rounded-r-chip border border-border bg-surface px-2.5 py-1 text-[10px] font-medium text-fg/70 leading-4"
                      >
                        {s}
                      </span>
                    ))}
                    {p.stack.length > 8 && (
                      <span className="rounded-r-chip border border-border bg-surface-2 px-2.5 py-1 text-[10px] font-medium text-fg/60 leading-4">
                        +{p.stack.length - 8}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <span className="text-sm text-fg/80 leading-7 text-pretty break-words">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {hasLinks && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex flex-wrap items-center gap-2">
                        {p.links.map((link, idx) => {
                          if (link.href === "#") return null;
                          const isExternal = link.href.startsWith("http");
                          const labelLower = link.label.toLowerCase();
                          const isGitHub = labelLower.includes("github");
                          const isNPM = labelLower.includes("npm");
                          const isLive = labelLower.includes("live") || labelLower.includes("demo");

                          return (
                            <a
                              key={idx}
                              href={link.href}
                              target={isExternal ? "_blank" : undefined}
                              rel={isExternal ? "noreferrer noopener" : undefined}
                              className={cn(
                                "inline-flex min-h-[36px] items-center gap-2 rounded-r-btn px-3.5 py-2",
                                "text-xs font-semibold transition-all duration-fast ease-out",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                                isGitHub || isNPM || isLive
                                  ? cn(
                                      "border border-primary/20 bg-primary-tint/8 text-primary",
                                      "hover:bg-primary-tint/12 hover:border-primary/30",
                                      "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-sm"
                                    )
                                  : cn(
                                      "border border-border bg-surface text-fg/70",
                                      "hover:bg-surface-2 hover:text-fg hover:border-primary/20",
                                      "motion-safe:hover:-translate-y-0.5"
                                    )
                              )}
                            >
                              {isGitHub && (
                                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                              )}
                              {isNPM && (
                                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
                                </svg>
                              )}
                              {isLive && (
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                              )}
                              <span>{link.label}</span>
                              {isExternal && (
                                <svg className="w-3 h-3 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <AwardsSection awards={awards} />

      <section className="scroll-mt-28 py-16 md:py-24" id="education" aria-label="Education">
        <div className="mb-6 md:mb-8 relative pl-4">
          <div className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-gradient-to-b from-warm to-primary" />
          <h2>Education</h2>
          <p className="mt-2 sm:mt-3 max-w-prose leading-7">Educational background and foundation.</p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2">
          {education.map((e) => (
            <Card key={e.school}>
              <CardHeader>
                <div className="text-sm font-semibold text-fg">{e.school}</div>
                <div className="mt-1 text-sm text-fg/80">{e.degree}</div>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-fg/80 leading-7">
                <div>{e.location}</div>
                <div className="text-xs text-fg/80">
                  {e.start} — {e.end}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

import { AwardsSection } from "@/components/AwardsSection";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { work, awards, projects, education } from "@/lib/content";

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
      className="inline-flex min-h-[40px] items-center rounded-2xl border border-border/70 bg-card/60 px-3 text-xs font-semibold text-fg/80 shadow-soft transition
                 hover:bg-fg/[0.03] motion-safe:hover:-translate-y-0.5 hover:shadow-lift"
    >
      {label}
    </a>
  );
}

export default function WorkPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs text-fg/70 shadow-soft backdrop-blur">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-brand2" />
          Scannable timeline • progressive disclosure • top signal first
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-fg">Work</h1>

        <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted">
          Scan the first two bullets per role for fast signal. Expand only if you want full context and stack.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <PillLink href="#roles" label="Roles" />
          <PillLink href="#projects" label="Projects" />
          <PillLink href="#awards" label="Awards" />
          <PillLink href="#education" label="Education" />
        </div>
      </header>

      <section id="roles" className="space-y-3 scroll-mt-28" aria-label="Roles">
        {work.map((w) => {
          const id = slugify(`${w.company}-${w.title}`);
          return (
            <Card key={id} id={id} className="scroll-mt-28">
              <CardHeader>
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-fg">{w.title}</div>
                    <div className="text-sm text-muted">
                      {w.company}
                      {w.location ? ` • ${w.location}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 font-semibold text-fg/70">
                      {w.start} — {w.end}
                    </span>
                    <a
                      href={`#${id}`}
                      className="hidden rounded-xl border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-semibold text-fg/70 hover:text-fg md:inline-flex"
                      aria-label="Permalink"
                      title="Permalink"
                    >
                      #
                    </a>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="text-sm text-fg/80">
                {/* Top signal */}
                <ul className="space-y-2">
                  {w.bullets.slice(0, 2).map((b) => (
                    <li key={b} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand2"
                      />
                      <span className="text-pretty">{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Progressive disclosure */}
                {w.bullets.length > 2 || w.stack.length > 0 ? (
                  <details className="group mt-4 rounded-2xl border border-border/70 bg-card/50 p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-fg/80 outline-none">
                      <span>Show full details</span>
                      <span className="rounded-xl border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-semibold text-fg/70">
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>

                    <div className="mt-4 grid gap-4 md:grid-cols-[1.3fr,0.7fr]">
                      <ul className="space-y-2">
                        {w.bullets.slice(2).map((b) => (
                          <li key={b} className="flex gap-2">
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand2"
                            />
                            <span className="text-pretty">{b}</span>
                          </li>
                        ))}
                      </ul>

                      {w.stack?.length ? (
                        <div>
                          <div className="text-xs font-semibold text-muted">Stack</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {w.stack.slice(0, 14).map((s) => (
                              <span
                                key={s}
                                className="rounded-full border border-border/70 bg-gradient-to-r from-brand/[0.08] to-brand2/[0.08] px-3 py-1 text-[11px] font-semibold text-fg/80"
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

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      <section className="space-y-4 scroll-mt-28" id="projects" aria-label="Projects">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-fg">Projects</h2>
          <p className="text-sm text-muted">Proof of full ownership: end-to-end delivery, reliability, and metrics.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Card key={p.name}>
              <CardHeader>
                <div className="text-sm font-semibold text-fg">{p.name}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.stack.slice(0, 10).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] font-semibold text-fg/75"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="text-sm text-fg/80">
                <ul className="space-y-2">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand2"
                      />
                      <span className="text-pretty">{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <AwardsSection awards={awards} />

      <section className="space-y-4 scroll-mt-28" id="education" aria-label="Education">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-fg">Education</h2>
          <p className="text-sm text-muted">Credentials and foundation.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {education.map((e) => (
            <Card key={e.school}>
              <CardHeader>
                <div className="text-sm font-semibold text-fg">{e.school}</div>
                <div className="mt-1 text-sm text-muted">{e.degree}</div>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-fg/80">
                <div>{e.location}</div>
                <div className="text-xs text-muted">
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

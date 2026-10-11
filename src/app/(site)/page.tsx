import type { CSSProperties } from "react";
import { Page } from "@/components/site/page";
import { Harness } from "@/components/three/harness";
import { ShaderSurface } from "@/components/fx/shader-surface";
import { Marquee } from "@/components/site/marquee";
import { CaseCard } from "@/components/site/case-card";
import { PillLink } from "@/components/site/pill-link";
import { TLink } from "@/components/site/transition-link";
import { RollText } from "@/components/site/roll-text";
import { getAllCaseStudies } from "@/lib/case-studies";
import { capabilities, experience, site } from "@/lib/site";

const d = (i: number, delay = 0) => ({ "--i": i, "--d": `${delay}ms` }) as CSSProperties;

export default function Home() {
  const studies = getAllCaseStudies();
  const featured = studies.filter((s) => s.featured);

  return (
    <Page>
      {/* ───────────── Hero ───────────── */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden px-4 pb-8 pt-24 sm:px-6 lg:px-10">
        <ShaderSurface scene="hero" />
        <div aria-hidden className="blueprint absolute inset-0 -z-0 opacity-70" />
        <Harness className="absolute inset-x-0 top-[8%] -z-0 mx-auto h-[62svh] w-full max-w-[880px] sm:top-[6%] lg:left-auto lg:right-[2%] lg:top-[8%] lg:h-[78svh] lg:w-[58%]" />

        <div className="relative mx-auto flex w-full max-w-[1600px] items-start justify-between" data-reveal>
          <p className="label fade-up" style={d(0, 200)}>
            [ {site.role} — {site.location} ]
          </p>
          <p className="label fade-up hidden text-right sm:block" style={d(1, 200)}>
            Harnesses · Guardrails · Long-running agents
          </p>
        </div>

        <div className="relative mx-auto mt-auto w-full max-w-[1600px]" data-reveal>
          <h1 className="display text-[clamp(4rem,11.2vw,13.5rem)] text-bone-50">
            <span className="reveal-line">
              <span style={d(0, 250)}>I build the</span>
            </span>
            <span className="reveal-line">
              <span style={d(1, 250)} className="flex items-baseline gap-[0.18em]">
                <em className="font-serif text-[1.08em] font-normal normal-case italic leading-[0.8] tracking-[-0.03em] text-signal [font-variation-settings:normal]">
                  harness
                </em>
                <span className="hidden font-mono text-[clamp(0.7rem,1vw,0.85rem)] font-normal normal-case leading-snug tracking-[0.12em] text-bone-400 [font-variation-settings:normal] md:block md:max-w-[22ch]">
                  (n.) everything around a model that makes it safe, useful and shippable
                </span>
              </span>
            </span>
            <span className="reveal-line">
              <span style={d(2, 250)}>around the model</span>
            </span>
          </h1>

          <div className="mt-10 grid gap-8 border-t border-border pt-6 md:grid-cols-12">
            <p className="fade-up text-lg leading-relaxed text-bone-200 md:col-span-5" style={d(3, 400)}>
              I&apos;m Tim Restieaux, an AI engineer in Melbourne. I design and build the systems that turn models into products: tools, context, guardrails, evals, and agents that keep working long after you close the tab.
            </p>
            <div className="fade-up flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end" style={d(4, 400)}>
              <PillLink href="/case-studies">Read the case studies</PillLink>
              <PillLink href="/contact" variant="ghost">
                Work with me
              </PillLink>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Marquee ───────────── */}
      <section aria-label="Focus areas" className="relative z-10 -mt-px border-y border-ink-950 bg-signal py-4 text-ink-950 sm:py-5">
        <Marquee
          className="display text-[clamp(2rem,5vw,4.5rem)]"
          items={["Harness engineering", "Guardrails", "Long-running agents", "Evals", "Agent platforms", "AI product"]}
        />
      </section>

      {/* ───────────── Statement ───────────── */}
      <section className="relative z-10 -mt-6 rounded-t-[28px] bg-ink-900 px-4 pb-24 pt-24 sm:-mt-8 sm:rounded-t-[40px] sm:px-6 sm:pt-32 lg:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
          <p className="label md:col-span-3">[ 01 — Approach ]</p>
          <div className="md:col-span-9" data-reveal>
            <p className="text-balance text-[clamp(1.7rem,3.6vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.02em] text-bone-50">
              <span className="fade-up inline" style={d(0)}>
                Models are getting commoditised. The system around them isn&apos;t.{" "}
              </span>
              <span className="fade-up inline text-bone-400" style={d(1)}>
                I&apos;m a product engineer: I design the solution, then I build it. A software engineer who markets, and a marketer who codes. These days I&apos;m mostly{" "}
                <em className="font-serif font-normal text-bone-50">training AI to take my job.</em>
              </span>
            </p>
            <dl className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              {[
                { k: "Shipping AI since", v: "2021", note: "AI Architect at Te Pūkenga, then NAB, then AVC" },
                { k: "Industries", v: "03", note: "Education, banking, hospitality" },
                { k: "Jobs left to automate", v: "01", note: "Mine. Working on it" },
              ].map((s, i) => (
                <div key={s.k} className="fade-up bg-ink-900 p-6 sm:p-8" style={d(i + 2)}>
                  <dt className="label">{s.k}</dt>
                  <dd className="display mt-6 text-[clamp(3.5rem,6vw,5.5rem)] text-bone-50">{s.v}</dd>
                  <dd className="mt-2 text-sm text-bone-400">{s.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ───────────── Case studies ───────────── */}
      <section id="work" className="relative px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-end md:justify-between" data-reveal>
            <div>
              <p className="label fade-up">[ 02 — Case studies ]</p>
              <h2 className="display mt-6 text-[clamp(3rem,9vw,9rem)] text-bone-50">
                <span className="reveal-line">
                  <span>Field notes</span>
                </span>
                <span className="reveal-line">
                  <span style={d(1)}>
                    from the{" "}
                    <em className="font-serif font-normal normal-case italic tracking-[-0.02em] text-signal [font-variation-settings:normal]">
                      harness
                    </em>
                  </span>
                </span>
              </h2>
            </div>
            <div className="fade-up flex max-w-sm flex-col gap-5 md:items-end md:text-right" style={d(2)}>
              <p className="text-bone-400">
                How I design agent systems that hold up in production. Written from the build, not the slide deck.
              </p>
              <TLink href="/case-studies" className="group font-mono text-[11px] uppercase tracking-[0.14em] text-bone-50">
                <RollText>{`All case studies (${String(studies.length).padStart(2, "0")}) →`}</RollText>
              </TLink>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-6 sm:gap-8">
            {featured.map((cs, i) => (
              <CaseCard key={cs.slug} cs={cs} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Capabilities ───────────── */}
      <section className="relative px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-6 border-t border-border pt-10 md:grid-cols-12">
            <p className="label md:col-span-3">[ 03 — What I do ]</p>
            <h2 className="display text-[clamp(2.4rem,5vw,4.8rem)] text-bone-50 md:col-span-9">
              From first prototype to the on‑call rota
            </h2>
          </div>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-border bg-border md:grid-cols-2">
            {capabilities.map((c, i) => (
              <li key={c.no} data-reveal className="group relative bg-ink-900">
                <div className="fade-up relative flex h-full flex-col gap-10 p-6 sm:p-10" style={d(i)}>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "radial-gradient(60% 80% at 100% 0%, color-mix(in oklab, var(--signal) 9%, transparent), transparent 70%)" }}
                  />
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-sm text-signal">{c.no}</span>
                    <span className="size-2 rounded-full border border-bone-500 transition-colors duration-500 group-hover:border-signal group-hover:bg-signal" />
                  </div>
                  <div>
                    <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold tracking-[-0.02em] text-bone-50">{c.title}</h3>
                    <p className="mt-4 max-w-md leading-relaxed text-bone-400">{c.body}</p>
                  </div>
                  <ul className="mt-auto flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <li key={t} className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-400">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Experience ───────────── */}
      <section className="relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-6 border-t border-border pt-10 md:grid-cols-12">
            <p className="label md:col-span-3">[ 04 — Track record ]</p>
            <div className="md:col-span-9">
              <ol>
                {experience.map((e, i) => (
                  <li key={e.role + e.org} data-reveal className="group border-b border-border">
                    <div className="fade-up grid gap-2 py-6 md:grid-cols-9 md:gap-6" style={d(i)}>
                      <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-bone-500 md:col-span-2 md:pt-1.5">{e.period}</span>
                      <div className="md:col-span-4">
                        <p className="text-xl font-medium text-bone-50 transition-colors duration-500 group-hover:text-signal">{e.role}</p>
                        <p className="text-bone-400">{e.org}</p>
                      </div>
                      <p className="text-[15px] leading-relaxed text-bone-400 md:col-span-3">{e.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <TLink href="/about" className="group font-mono text-[11px] uppercase tracking-[0.14em] text-bone-50">
                  <RollText>More about me →</RollText>
                </TLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}

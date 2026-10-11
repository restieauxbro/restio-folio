import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Page } from "@/components/site/page";
import { Harness } from "@/components/three/harness";
import { PillLink } from "@/components/site/pill-link";
import { experience, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Product engineer turned AI engineer. Background, principles and track record.",
};

const d = (i: number) => ({ "--i": i }) as CSSProperties;

const principles = [
  {
    title: "Start from the job, not the model",
    body: "What does the person actually need done, and what does good look like? The model choice is the last decision, not the first.",
  },
  {
    title: "Make the harness boring",
    body: "Typed tools, explicit state, retries that are safe to retry. Clever prompts break; boring systems don't.",
  },
  {
    title: "If it isn't measured, it isn't shipped",
    body: "Evals come before features. They are the spec, the regression suite and the argument for going live.",
  },
  {
    title: "Humans are a feature",
    body: "Escalation, approval and review are designed in, at the moments where judgement matters, not bolted on after an incident.",
  },
];

const toolbox = [
  { group: "Languages", items: ["TypeScript", "Python", "SQL"] },
  { group: "Models", items: ["Claude", "GPT", "Gemini", "Open weights"] },
  { group: "Agents", items: ["Tool use", "MCP", "Durable execution", "Sub-agents"] },
  { group: "Quality", items: ["Evals", "LLM-as-judge", "Tracing", "Red-teaming"] },
  { group: "Platform", items: ["Next.js", "Postgres", "Vercel", "AWS"] },
  { group: "Craft", items: ["Product strategy", "UX", "Growth", "Writing"] },
];

export default function AboutPage() {
  return (
    <Page>
      <section className="relative isolate overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:px-10">
        <div aria-hidden className="blueprint absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-8">
            <p className="label fade-up">[ About ]</p>
            <h1 className="display mt-8 text-[clamp(3.4rem,11vw,11.5rem)] text-bone-50">
              <span className="reveal-line">
                <span>Designs it.</span>
              </span>
              <span className="reveal-line">
                <span style={d(1)}>
                  <em className="font-serif font-normal normal-case italic tracking-[-0.03em] text-signal [font-variation-settings:normal]">
                    Then
                  </em>{" "}
                  builds it.
                </span>
              </span>
            </h1>
          </div>
          <div className="relative hidden min-h-[320px] lg:col-span-4 lg:block">
            <Harness className="absolute inset-0" />
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-12 border-t border-border pt-10 md:grid-cols-12" data-reveal>
          <p className="label md:col-span-3">Bio</p>
          <div className="space-y-6 text-[clamp(1.15rem,1.6vw,1.4rem)] leading-relaxed text-bone-200 md:col-span-7">
            <p className="fade-up text-bone-50">
              I&apos;m {site.name}, {site.title.toLowerCase()} at Australian Venue Co. in Melbourne. I started in marketing, picked up code to get things done faster, and never put it down.
            </p>
            <p className="fade-up" style={d(1)}>
              That path matters. I&apos;ve owned the funnel and the codebase, so I build AI systems the way a product person would: start with the outcome, prototype quickly, then make it reliable enough that nobody has to think about it.
            </p>
            <p className="fade-up" style={d(2)}>
              Since 2021 I&apos;ve led AI work in education at Te Pūkenga, in banking at NAB, and now in hospitality. The settings change. The hard part doesn&apos;t: the model is maybe ten percent of the job. The rest is the harness.
            </p>
            <p className="fade-up" style={d(3)}>
              I studied Communication Studies (Creative Industries) at AUT in Auckland, which explains the opinions about typography.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1600px] border-t border-border pt-10">
          <div className="grid gap-6 md:grid-cols-12">
            <p className="label md:col-span-3">Principles</p>
            <h2 className="display text-[clamp(2.4rem,5vw,4.8rem)] text-bone-50 md:col-span-9">How I work</h2>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-border bg-border md:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.title} data-reveal className="group bg-ink-900">
                <div className="fade-up flex h-full flex-col gap-8 p-6 sm:p-10" style={d(i)}>
                  <span className="display text-[4.5rem] text-ink-600 transition-colors duration-500 group-hover:text-signal">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.02em] text-bone-50">{p.title}</h3>
                    <p className="mt-3 max-w-md leading-relaxed text-bone-400">{p.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-6 border-t border-border pt-10 md:grid-cols-12">
          <p className="label md:col-span-3">Toolbox</p>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:col-span-9" data-reveal>
            {toolbox.map((t, i) => (
              <div key={t.group} className="fade-up" style={d(i)}>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">{t.group}</p>
                <ul className="mt-4 space-y-1.5 text-lg text-bone-200">
                  {t.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-6 border-t border-border pt-10 md:grid-cols-12">
          <p className="label md:col-span-3">Experience</p>
          <ol className="md:col-span-9">
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
        </div>
        <div className="mx-auto mt-14 flex max-w-[1600px] justify-end">
          <PillLink href="/contact">Get in touch</PillLink>
        </div>
      </section>
    </Page>
  );
}

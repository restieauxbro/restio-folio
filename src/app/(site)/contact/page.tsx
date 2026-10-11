import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Page } from "@/components/site/page";
import { ShaderSurface } from "@/components/fx/shader-surface";
import { LocalTime } from "@/components/site/local-time";
import { site } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Advisory, build and team enablement engagements for AI agent systems.",
};

const d = (i: number) => ({ "--i": i }) as CSSProperties;

const engagements = [
  {
    no: "A",
    title: "Advisory",
    body: "Architecture reviews, eval strategy and a second opinion before you commit to a design. Short, focused, written up.",
  },
  {
    no: "B",
    title: "Build",
    body: "I design and build the harness for an agent you need in production, then hand it over with docs and evals your team can own.",
  },
  {
    no: "C",
    title: "Enablement",
    body: "Workshops and pairing to get an engineering team confident building, testing and operating agents themselves.",
  },
];

export default function ContactPage() {
  return (
    <Page footer={false}>
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden px-4 pb-10 pt-32 sm:px-6 sm:pt-40 lg:px-10">
        <ShaderSurface scene="cta" />
        <div aria-hidden className="blueprint absolute inset-0 -z-0 opacity-50" />
        <div className="relative mx-auto w-full max-w-[1600px]" data-reveal>
          <p className="label fade-up">[ Contact ]</p>
          <h1 className="display mt-8 text-[clamp(3.4rem,12vw,13rem)] text-bone-50">
            <span className="reveal-line">
              <span>Let&apos;s build</span>
            </span>
            <span className="reveal-line">
              <span style={d(1)}>
                something{" "}
                <em className="font-serif font-normal normal-case italic tracking-[-0.03em] text-signal [font-variation-settings:normal]">
                  reliable
                </em>
              </span>
            </span>
          </h1>
        </div>

        <div className="relative mx-auto mt-16 grid w-full max-w-[1600px] gap-12 border-t border-border pt-10 lg:grid-cols-12 lg:gap-16">
          <div id="enquire" className="scroll-mt-28 rounded-[28px] border border-border bg-ink-900/80 p-6 backdrop-blur-xl sm:p-10 lg:col-span-7">
            <ContactForm email={site.email} />
          </div>

          <aside className="flex flex-col gap-10 lg:col-span-5">
            <div>
              <p className="label">Ways to work together</p>
              <ul className="mt-6 border-t border-border">
                {engagements.map((e, i) => (
                  <li key={e.no} data-reveal className="border-b border-border">
                    <div className="fade-up grid grid-cols-[2rem_1fr] gap-x-4 py-6" style={d(i)}>
                      <span className="font-mono text-sm text-signal">{e.no}</span>
                      <div>
                        <h2 className="text-xl font-semibold tracking-[-0.02em] text-bone-50">{e.title}</h2>
                        <p className="mt-2 leading-relaxed text-bone-400">{e.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="label">Based in</dt>
                <dd className="mt-2 text-bone-200">{site.location}</dd>
              </div>
              <div>
                <dt className="label">Local time</dt>
                <dd className="mt-2">
                  <LocalTime className="font-mono tabular-nums text-bone-200" />
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="label">Availability</dt>
                <dd className="mt-2 flex items-center gap-2 text-bone-200">
                  <span className="size-1.5 animate-pulse-dot rounded-full bg-signal" /> Taking select projects, remote friendly
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </Page>
  );
}

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Page } from "@/components/site/page";
import { ShaderSurface } from "@/components/fx/shader-surface";
import { CopyEmail } from "@/components/site/copy-email";
import { LocalTime } from "@/components/site/local-time";
import { site } from "@/lib/site";

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

          <div className="mt-14 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-end md:justify-between">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Project enquiry")}`}
              data-cursor="Email"
              className="fade-up group text-[clamp(1.6rem,4.4vw,4rem)] font-medium tracking-[-0.03em] text-bone-50"
              style={d(2)}
            >
              <span className="link-underline">{site.email}</span>
            </a>
            <div className="fade-up flex items-center gap-4" style={d(3)}>
              <CopyEmail />
              <LocalTime className="label tabular-nums" />
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-auto w-full max-w-[1600px] pt-20">
          <ul className="grid gap-px overflow-hidden rounded-[28px] border border-border bg-border md:grid-cols-3">
            {engagements.map((e, i) => (
              <li key={e.no} data-reveal className="bg-ink-900/85 backdrop-blur-md">
                <div className="fade-up p-6 sm:p-8" style={d(i)}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-signal">{e.no}</span>
                    <span className="label">Engagement</span>
                  </div>
                  <h2 className="mt-10 text-2xl font-semibold tracking-[-0.02em] text-bone-50">{e.title}</h2>
                  <p className="mt-3 leading-relaxed text-bone-400">{e.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-500">
            Based in {site.location} · Open to remote engagements
          </p>
        </div>
      </section>
    </Page>
  );
}

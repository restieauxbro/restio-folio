import type { Metadata } from "next";
import { Page } from "@/components/site/page";
import { CaseIndex } from "@/components/site/case-index";
import { CaseCard } from "@/components/site/case-card";
import { formatDate, getAllCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Field notes on harness engineering, guardrails, evals and long-running agents.",
};

export default function CaseStudiesPage() {
  const studies = getAllCaseStudies();
  const [lead] = studies;

  return (
    <Page>
      <section className="relative px-4 pb-16 pt-32 sm:px-6 sm:pt-40 lg:px-10">
        <div aria-hidden className="blueprint absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="mx-auto max-w-[1600px]" data-reveal>
          <div className="flex items-end justify-between gap-6">
            <p className="label fade-up">[ Case studies — {String(studies.length).padStart(2, "0")} ]</p>
            <p className="label fade-up hidden sm:block">Sorted by number</p>
          </div>
          <h1 className="display mt-8 text-[clamp(3.6rem,15vw,16rem)] text-bone-50">
            <span className="reveal-line">
              <span>Notes from</span>
            </span>
            <span className="reveal-line">
              <span style={{ "--i": 1 } as React.CSSProperties}>
                the{" "}
                <em className="font-serif font-normal normal-case italic tracking-[-0.03em] text-signal [font-variation-settings:normal]">
                  build
                </em>
              </span>
            </span>
          </h1>
          <p className="fade-up mt-10 max-w-xl text-lg leading-relaxed text-bone-200" style={{ "--i": 2 } as React.CSSProperties}>
            Long-form write-ups on how I design and ship agent systems. Each one is a pattern I&apos;ve used in production, with the code and the trade-offs.
          </p>
        </div>
      </section>

      {lead && (
        <section className="px-4 pb-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1600px]">
            <p className="label mb-6">Latest</p>
            <CaseCard cs={lead} as="h2" />
          </div>
        </section>
      )}

      <section className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <p className="label mb-6">Index</p>
          <CaseIndex items={studies.map((s) => ({ ...s, dateLabel: formatDate(s.date) }))} />
        </div>
      </section>
    </Page>
  );
}

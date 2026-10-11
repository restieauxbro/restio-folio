import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudyMeta } from "@/lib/case-studies";
import { formatDate } from "@/lib/case-studies";
import { cn } from "@/lib/utils";
import { CaseCover } from "./case-cover";
import { TLink } from "./transition-link";

/** Large featured case-study card. Cover and title morph into the article. */
export function CaseCard({ cs, flip = false, i = 0 }: { cs: CaseStudyMeta; flip?: boolean; i?: number }) {
  return (
    <article data-reveal className={cn("group relative", `accent-${cs.accent}`)}>
      <TLink
        href={`/case-studies/${cs.slug}`}
              direction="morph"
        data-cursor="Read"
        className="fade-up grid gap-6 rounded-[28px] border border-border bg-ink-850/60 p-3 transition-[border-color,background-color] duration-700 hover:border-[color-mix(in_oklab,var(--accent-hue)_40%,transparent)] hover:bg-ink-850 sm:p-4 lg:grid-cols-12 lg:gap-10"
        style={{ "--i": i } as React.CSSProperties}
      >
        <div className={cn("lg:col-span-7", flip && "lg:order-2")}>
          <ViewTransition name={`cs-cover-${cs.slug}`} share="morph" default="none">
            <CaseCover
              slug={cs.slug}
              accent={cs.accent}
              index={cs.index}
              className="aspect-[4/3] rounded-[20px] transition-[border-radius] duration-700 sm:aspect-[16/10]"
            />
          </ViewTransition>
        </div>
        <div className={cn("flex flex-col justify-between gap-8 px-2 pb-3 lg:col-span-5 lg:py-4 lg:pr-6", flip && "lg:order-1 lg:pl-6")}>
          <div className="flex items-center justify-between">
            <span className="label flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: "var(--accent-hue)" }} />
              {cs.kind}
            </span>
            <span className="label">{formatDate(cs.date)}</span>
          </div>
          <div>
            <ViewTransition name={`cs-title-${cs.slug}`} share="morph" default="none">
              <h3 className="display text-balance text-[clamp(2.2rem,4.4vw,4.4rem)] text-bone-50">{cs.title}</h3>
            </ViewTransition>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-bone-400">{cs.summary}</p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <ul className="flex flex-wrap gap-2">
              {cs.tags.map((t) => (
                <li key={t} className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-400">
                  {t}
                </li>
              ))}
            </ul>
            <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-200">
              {cs.readingMinutes} min
              <span className="flex size-10 items-center justify-center rounded-full border border-border transition-[background-color,border-color,transform] duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-[var(--accent-hue)] group-hover:text-ink-950">
                <ArrowUpRight className="size-4" strokeWidth={1.6} />
              </span>
            </span>
          </div>
        </div>
      </TLink>
    </article>
  );
}

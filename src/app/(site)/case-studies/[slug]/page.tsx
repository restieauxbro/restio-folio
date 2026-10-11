import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Page } from "@/components/site/page";
import { CaseCover } from "@/components/site/case-cover";
import { ShaderSurface } from "@/components/fx/shader-surface";
import { ReadingProgress } from "@/components/site/reading-progress";
import { Toc } from "@/components/site/toc";
import { TLink } from "@/components/site/transition-link";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { formatDate, getAllCaseStudies, getCaseStudy } from "@/lib/case-studies";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCaseStudies().map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return { title: cs.title, description: cs.summary };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const all = getAllCaseStudies();
  const idx = all.findIndex((s) => s.slug === cs.slug);
  const next = all[(idx + 1) % all.length];

  return (
    <Page>
      <article className={`accent-${cs.accent}`}>
        <ReadingProgress />

        {/* ───── Header ───── */}
        <header className="relative isolate overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-10">
          <ShaderSurface scene={cs.accent} className="opacity-70 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" />
          <div aria-hidden className="blueprint absolute inset-0 -z-0 opacity-60" />
          <div className="relative mx-auto max-w-[1600px]" data-reveal>
            <div className="flex items-center justify-between">
              <TLink
                href="/case-studies"
                direction="back"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-400 hover:text-bone-50"
              >
                <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
                All case studies
              </TLink>
              <span className="label">
                {cs.index} / {String(all.length).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="label fade-up flex items-center gap-2">
                  <span className="size-1.5 rounded-full" style={{ background: "var(--accent-hue)" }} />
                  {cs.kind} · {formatDate(cs.date)} · {cs.readingMinutes} min read
                </p>
                <ViewTransition name={`cs-title-${cs.slug}`} share="morph" default="none">
                  <h1 className="display mt-6 text-balance text-[clamp(2.8rem,7.4vw,7.6rem)] text-bone-50">{cs.title}</h1>
                </ViewTransition>
                <p className="fade-up mt-8 max-w-2xl text-xl leading-relaxed text-bone-200" style={{ "--i": 2 } as React.CSSProperties}>
                  {cs.summary}
                </p>
              </div>
              <dl className="fade-up grid content-end gap-6 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1" style={{ "--i": 3 } as React.CSSProperties}>
                <div>
                  <dt className="label">Role</dt>
                  <dd className="mt-2 text-bone-50">{cs.role}</dd>
                </div>
                <div>
                  <dt className="label">Stack</dt>
                  <dd className="mt-2 text-bone-50">{cs.stack.join(", ")}</dd>
                </div>
                <div>
                  <dt className="label">Topics</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {cs.tags.map((t) => (
                      <span key={t} className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-200">
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-10">
          <ViewTransition name={`cs-cover-${cs.slug}`} share="morph" default="none">
            <CaseCover
              slug={cs.slug}
              accent={cs.accent}
              index={cs.index}
              className="mx-auto aspect-[16/10] max-w-[1600px] rounded-[24px] sm:aspect-[21/9] sm:rounded-[32px]"
            />
          </ViewTransition>
        </div>

        {/* ───── Body ───── */}
        <div className="mx-auto mt-20 grid max-w-[1600px] gap-12 px-4 sm:px-6 lg:mt-28 lg:grid-cols-12 lg:px-10">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <Toc headings={cs.headings.filter((h) => h.depth === 2)} />
            </div>
          </aside>
          <div className="prose-restio min-w-0 lg:col-span-7 lg:col-start-5">
            <MDXRemote
              source={cs.body}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [[rehypePrettyCode, { theme: "vesper", keepBackground: false }]],
                },
              }}
            />
            <p className="mt-16 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-500">
              Written by Tim Restieaux · {formatDate(cs.date)}
            </p>
          </div>
        </div>

        {/* ───── Next ───── */}
        {next && next.slug !== cs.slug && (
          <section className="mx-auto mt-28 max-w-[1600px] px-4 sm:px-6 lg:px-10">
            <TLink
              href={`/case-studies/${next.slug}`}
              data-cursor="Next"
              className={`group accent-${next.accent} grid items-end gap-8 rounded-[28px] border border-border bg-ink-850/60 p-3 transition-colors duration-700 hover:border-[color-mix(in_oklab,var(--accent-hue)_40%,transparent)] sm:p-4 md:grid-cols-12`}
            >
              <div className="px-3 pb-4 pt-3 md:col-span-7 md:px-6">
                <p className="label">Next case study · {next.index}</p>
                <ViewTransition name={`cs-title-${next.slug}`} share="morph" default="none">
                  <p className="display mt-6 text-balance text-[clamp(2.4rem,5.4vw,5.4rem)] text-bone-50 transition-colors duration-500 group-hover:text-[var(--accent-hue)]">
                    {next.title}
                  </p>
                </ViewTransition>
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-200">
                  Keep reading <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </div>
              <div className="md:col-span-5">
                <ViewTransition name={`cs-cover-${next.slug}`} share="morph" default="none">
                  <CaseCover slug={next.slug} accent={next.accent} index={next.index} className="aspect-[4/3] rounded-[20px]" />
                </ViewTransition>
              </div>
            </TLink>
          </section>
        )}
      </article>
    </Page>
  );
}

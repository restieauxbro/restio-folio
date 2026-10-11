"use client";

import { useRef, useState } from "react";
import type { CaseStudyMeta } from "@/lib/case-studies";
import { cn } from "@/lib/utils";
import { CaseCover } from "./case-cover";
import { TLink } from "./transition-link";

/**
 * Text index of every case study. On fine pointers, a cover preview follows
 * the cursor (eased) while you hover a row; touch devices get inline covers.
 */
export function CaseIndex({ items }: { items: (CaseStudyMeta & { dateLabel: string })[] }) {
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  const loop = () => {
    pos.current.x += (target.current.x - pos.current.x) * 0.14;
    pos.current.y += (target.current.y - pos.current.y) * 0.14;
    if (preview.current) {
      preview.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
    }
    raf.current = requestAnimationFrame(loop);
  };

  const onEnter = (e: React.PointerEvent, i: number) => {
    if (e.pointerType !== "mouse") return;
    target.current = { x: e.clientX, y: e.clientY };
    if (active === null) pos.current = { ...target.current };
    setActive(i);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(loop);
  };
  const onMove = (e: React.PointerEvent) => {
    target.current = { x: e.clientX, y: e.clientY };
  };
  const onLeave = () => {
    setActive(null);
    cancelAnimationFrame(raf.current);
  };

  return (
    <div className="relative" onPointerLeave={onLeave}>
      <div className="hidden grid-cols-12 gap-4 border-b border-border pb-3 md:grid">
        <span className="label col-span-1">No.</span>
        <span className="label col-span-6">Title</span>
        <span className="label col-span-3">Topics</span>
        <span className="label col-span-2 text-right">Date</span>
      </div>
      <ul>
        {items.map((cs, i) => (
          <li key={cs.slug} data-reveal className={`accent-${cs.accent}`}>
            <TLink
              href={`/case-studies/${cs.slug}`}
              data-cursor="Read"
              onPointerEnter={(e) => onEnter(e, i)}
              onPointerMove={onMove}
              className={cn(
                "fade-up group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 border-b border-border py-7 transition-colors duration-500 md:py-9",
                active !== null && active !== i && "text-bone-500",
              )}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="col-span-2 font-mono text-sm text-bone-500 md:col-span-1">{cs.index}</span>
              <span className="col-span-10 md:col-span-6">
                <span className="display block text-[clamp(1.9rem,4vw,3.6rem)] transition-[transform,color] duration-700 ease-[var(--ease-out)] group-hover:translate-x-3 group-hover:text-[var(--accent-hue)]">
                  {cs.title}
                </span>
              </span>
              <span className="col-span-12 flex flex-wrap gap-2 md:col-span-3">
                {cs.tags.map((t) => (
                  <span key={t} className="font-mono text-[11px] uppercase tracking-[0.12em] text-bone-400">
                    {t}
                  </span>
                ))}
              </span>
              <span className="col-span-12 font-mono text-[11px] uppercase tracking-[0.12em] text-bone-500 md:col-span-2 md:text-right">
                {cs.dateLabel} · {cs.readingMinutes} min
              </span>
              <CaseCover slug={cs.slug} accent={cs.accent} index={cs.index} className="col-span-12 mt-2 aspect-[16/9] rounded-2xl md:hidden" />
            </TLink>
          </li>
        ))}
      </ul>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        style={{ transform: "translate3d(-999px,-999px,0)" }}
      >
        <div
          className={cn(
            "relative h-[240px] w-[340px] overflow-hidden rounded-2xl transition-[opacity,scale,rotate] duration-500 ease-[var(--ease-out)]",
            active === null ? "scale-75 rotate-[-4deg] opacity-0" : "scale-100 rotate-[-2deg] opacity-100",
          )}
        >
          {items.map((cs, i) => (
            <div
              key={cs.slug}
              className={cn(
                "absolute inset-0 transition-[clip-path] duration-700 ease-[var(--ease-out)]",
                active === i ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(100%_0_0_0)]",
              )}
            >
              <CaseCover slug={cs.slug} accent={cs.accent} index={cs.index} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

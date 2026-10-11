"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { depth: 2 | 3; text: string; id: string };

/** Table of contents that tracks the section you are reading. */
export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  const top = headings.filter((h) => h.depth === 2);
  return (
    <nav aria-label="On this page">
      <p className="label">On this page</p>
      <ol className="mt-5 space-y-1 border-l border-border">
        {top.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm leading-snug transition-colors duration-300",
                active === h.id ? "border-[var(--accent-hue)] text-bone-50" : "border-transparent text-bone-500 hover:text-bone-200",
              )}
            >
              <span className="font-mono text-[11px] text-bone-500">{String(i + 1).padStart(2, "0")}</span>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import type { MDXComponents } from "mdx/types";
import { isValidElement, type ReactNode } from "react";
import { slugify } from "@/lib/slugify";

function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="not-prose relative my-10 overflow-hidden rounded-2xl border border-border bg-ink-850 p-6 sm:p-8">
      <span aria-hidden className="absolute inset-y-0 left-0 w-px" style={{ background: "var(--accent-hue)" }} />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--accent-hue) 14%, transparent)" }}
      />
      {title && (
        <p className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--accent-hue)" }}>
          <span className="size-1.5 rounded-full" style={{ background: "var(--accent-hue)" }} />
          {title}
        </p>
      )}
      <div className="relative mt-3 text-[1.02rem] leading-relaxed text-bone-200 [&>p+p]:mt-3">{children}</div>
    </aside>
  );
}

function PullQuote({ children }: { children: ReactNode }) {
  return (
    <figure className="relative my-16 border-y border-border py-10 sm:-mx-12 lg:-mx-24">
      <span aria-hidden className="absolute -top-px left-0 h-px w-24" style={{ background: "var(--accent-hue)" }} />
      <blockquote className="!border-0 !p-0 text-balance font-serif text-[clamp(1.8rem,3.6vw,3rem)] italic leading-[1.12] tracking-[-0.01em] text-bone-50">
        {children}
      </blockquote>
    </figure>
  );
}

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
  a: ({ href = "", children }) =>
    href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    ),
  Callout,
  PullQuote,
};

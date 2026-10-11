# restio-folio

Portfolio for Tim Restieaux, AI engineer. Next.js 16 (App Router), React 19, Tailwind v4 and shadcn/ui, with a single deep-dark theme.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000. The gate stays open locally unless SITE_PASSWORD is set.
pnpm build && SITE_PASSWORD=secret pnpm start
pnpm lint
```

## Password gate

The site has its own password gate, so it doesn't need Vercel's paid Password Protection.

- `src/proxy.ts` checks every request (Next 16 renamed middleware to "proxy") for an HMAC cookie.
- Requests without the cookie are redirected to `/unlock`.
- `src/app/unlock/` holds the page and the server action that checks the password and sets the cookie. The cookie is httpOnly and lasts 30 days.
- Set the password with the `SITE_PASSWORD` environment variable in Vercel (Production and Preview).
- Changing the password signs everyone out.
- In production, if `SITE_PASSWORD` is missing, the gate stays closed.

## Writing case studies

Add an `.mdx` file to `content/case-studies/`. The frontmatter looks like this:

```yaml
title: "..."
summary: "One or two sentences."
date: "2026-10-02"
tags: ["Harness", "Agents"]
kind: "Case study"        # or "Field notes"
role: "Architecture & build"
stack: ["TypeScript", "Claude"]
index: "05"               # sets the display order and number
accent: "lime"            # lime | violet | cyan | amber
featured: true            # shown on the home page
```

In the body you can use `<Callout title="...">` and `<PullQuote>`. Code fences are highlighted at build time with Shiki.

Cover art is generated SVG. The motif for each slug is set in `src/components/site/case-cover.tsx`, and new slugs fall back to the lattice motif.

## Where things live

| Path | What |
| --- | --- |
| `src/app/globals.css` | Theme tokens, prose styles, page-transition CSS |
| `src/lib/site.ts` | Name, email, nav, experience, capabilities |
| `src/components/three/` | The hero object: a model inside its harness (React Three Fiber) |
| `src/components/fx/shader-surface.tsx` | WebGPU backgrounds from the `shaders` library, with CSS fallbacks |
| `src/components/site/page.tsx` | Page transitions, using React `<ViewTransition>` plus a signal-coloured curtain |
| `src/components/ui/` | shadcn/ui primitives |

## Motion rules

- Scrolling is always native. There is no scroll hijacking and no smooth-scroll library.
- Reveals use IntersectionObserver.
- The custom cursor and magnetic effects only run on fine pointers.
- `prefers-reduced-motion` turns off transitions and shaders.
- WebGPU shaders load only when `navigator.gpu` exists. Everywhere else gets a matching gradient.

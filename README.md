# restio-folio

Portfolio for Tim Restieaux, AI engineer. Next.js 16 (App Router), React 19, Tailwind v4 and shadcn/ui, with a single deep-dark theme.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000. Add CONTACT_DRY_RUN=1 to test the form without sending.
pnpm build && pnpm start
pnpm lint
```

## Contact form

`/contact` has an enquiry form backed by a Server Action (`src/app/(site)/contact/actions.ts`) that sends via [Resend](https://resend.com).

- **Validation:** zod checks every field on the server. Errors appear next to the field, and what the visitor typed is kept.
- **Spam protection:** a hidden honeypot field, a minimum time to fill the form, and a per-IP limit of 5 per 10 minutes. The limit lives in memory, so it's best effort.
- **The email:** comes from `CONTACT_FROM_EMAIL` and goes to `CONTACT_TO_EMAIL`, with `replyTo` set to the visitor's address. Hit Reply to answer them directly.

| Env var | Default | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | (required) | Without it, the form shows an "email me instead" message |
| `CONTACT_TO_EMAIL` | `site.email` | Where enquiries land |
| `CONTACT_FROM_EMAIL` | `Portfolio <onboarding@resend.dev>` | Use an address on a domain verified in Resend. The `resend.dev` sender only delivers to your Resend account's own email |
| `CONTACT_DRY_RUN` | unset | Set to `1` locally to log the email instead of sending it |

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

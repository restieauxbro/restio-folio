import { nav, site } from "@/lib/site";
import { ShaderSurface } from "@/components/fx/shader-surface";
import { TLink } from "./transition-link";
import { RollText } from "./roll-text";
import { LocalTime } from "./local-time";
import { CopyEmail } from "./copy-email";
import { PillLink } from "./pill-link";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden rounded-t-[28px] border-t border-border bg-ink-950 sm:mt-32 sm:rounded-t-[40px]">
      <ShaderSurface scene="cta" className="opacity-90" />
      <div className="relative px-4 pt-20 sm:px-6 sm:pt-28 lg:px-10">
        <div data-reveal className="mx-auto max-w-[1600px]">
          <p className="label fade-up">[ Next step ]</p>
          <h2 className="display mt-6 text-[clamp(3.2rem,11vw,11rem)] text-bone-50">
            <span className="reveal-line"><span style={{ "--i": 0 } as React.CSSProperties}>Got a model</span></span>
            <span className="reveal-line">
              <span style={{ "--i": 1 } as React.CSSProperties}>
                that needs a <em className="font-serif font-normal normal-case italic tracking-normal text-signal [font-variation-settings:normal]">harness?</em>
              </span>
            </span>
          </h2>
          <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="fade-up max-w-md text-lg text-bone-200" style={{ "--i": 2 } as React.CSSProperties}>
              I take on a small number of advisory and build engagements each year. Tell me what you are trying to ship.
            </p>
            <div className="fade-up flex flex-wrap items-center gap-3" style={{ "--i": 3 } as React.CSSProperties}>
              <PillLink href="/contact#enquire">Start a conversation</PillLink>
              <CopyEmail />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-24 grid max-w-[1600px] grid-cols-2 gap-10 border-t border-border pt-10 sm:grid-cols-4">
          <div>
            <p className="label">Sitemap</p>
            <ul className="mt-4 space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <TLink href={n.href} className="group text-bone-200 hover:text-bone-50">
                    <RollText>{n.label}</RollText>
                  </TLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">Contact</p>
            <ul className="mt-4 space-y-2 text-bone-200">
              <li>
                <a href={`mailto:${site.email}`} className="link-underline break-all hover:text-bone-50">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="label">Based in</p>
            <p className="mt-4 text-bone-200">{site.location}</p>
            <LocalTime className="mt-1 block font-mono text-sm tabular-nums text-bone-500" />
          </div>
          <div>
            <p className="label">Status</p>
            <p className="mt-4 flex items-center gap-2 text-bone-200">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-signal" /> Taking select projects
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[1600px]" aria-hidden>
          <svg viewBox="0 0 1000 150" className="block w-full text-bone-50">
            <text
              x="0"
              y="142"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fill="currentColor"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 188,
                fontVariationSettings: "'wdth' 62",
                letterSpacing: "-0.02em",
              }}
            >
              RESTIEAUX
            </text>
          </svg>
        </div>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>Built by hand (and a few agents)</span>
        </div>
      </div>
    </footer>
  );
}

import { cn } from "@/lib/utils";
import type { Accent } from "@/lib/case-studies";

const HUES: Record<Accent, string> = {
  lime: "#c8f25c",
  violet: "#9b8cff",
  cyan: "#5fe3f0",
  amber: "#ffb547",
};

type Motif = "lattice" | "rails" | "timeline" | "matrix";

const MOTIF_BY_SLUG: Record<string, Motif> = {
  "harness-engineering": "lattice",
  "guardrails-that-dont-get-in-the-way": "rails",
  "long-running-agents": "timeline",
  "evals-are-the-product-spec": "matrix",
};

/**
 * Generative cover art for a case study. Pure SVG + CSS so a grid of them
 * costs nothing; each motif is a diagram of the article's idea. Animates on
 * hover of the nearest .group.
 */
export function CaseCover({ slug, accent, index, className }: { slug: string; accent: Accent; index: string; className?: string }) {
  const hue = HUES[accent];
  const motif = MOTIF_BY_SLUG[slug] ?? "lattice";
  return (
    <div
      className={cn("relative isolate overflow-hidden bg-ink-950", className)}
      style={{ "--hue": hue } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-110"
        style={{
          background: `radial-gradient(70% 60% at 72% 28%, color-mix(in oklab, ${hue} 26%, transparent), transparent 70%), radial-gradient(60% 50% at 15% 95%, color-mix(in oklab, ${hue} 10%, transparent), transparent 70%)`,
        }}
      />
      <div aria-hidden className="blueprint absolute inset-0 opacity-60 [--cols:8]" />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
        {motif === "lattice" && <Lattice />}
        {motif === "rails" && <Rails />}
        {motif === "timeline" && <Timeline />}
        {motif === "matrix" && <Matrix />}
      </svg>
      <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.14em] text-bone-50/70">{index}</span>
      <span className="absolute bottom-4 right-4 size-2 rounded-full" style={{ background: hue, boxShadow: `0 0 24px ${hue}` }} />
    </div>
  );
}

const stroke = "rgba(242,240,234,.28)";
const spin = "origin-center [transform-box:fill-box] transition-transform duration-[1600ms] ease-[var(--ease-out)]";

function Lattice() {
  // A hex cage around a glowing core: the model inside its harness.
  const hex = (r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${200 + r * Math.cos(a)},${150 + r * Math.sin(a)}`;
    }).join(" ");
  return (
    <g>
      <circle cx="200" cy="150" r="34" fill="var(--hue)" opacity="0.9" className="transition-[r] duration-700" />
      <circle cx="200" cy="150" r="60" fill="var(--hue)" opacity="0.08" />
      <g className={cn(spin, "group-hover:rotate-[60deg]")}>
        <polygon points={hex(92)} fill="none" stroke={stroke} />
        <polygon points={hex(92)} fill="none" stroke={stroke} transform="rotate(30 200 150)" opacity="0.6" />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i - Math.PI / 2;
          return (
            <g key={i}>
              <line x1="200" y1="150" x2={200 + 92 * Math.cos(a)} y2={150 + 92 * Math.sin(a)} stroke={stroke} strokeDasharray="2 5" />
              <circle cx={200 + 92 * Math.cos(a)} cy={150 + 92 * Math.sin(a)} r="3.5" fill="#f2f0ea" />
            </g>
          );
        })}
      </g>
      <g className={cn(spin, "group-hover:-rotate-[40deg]")}>
        <ellipse cx="200" cy="150" rx="150" ry="40" fill="none" stroke={stroke} opacity="0.6" transform="rotate(-16 200 150)" />
        <rect x="343" y="108" width="7" height="7" fill="var(--hue)" transform="rotate(-16 200 150)" />
      </g>
    </g>
  );
}

function Rails() {
  // A path that wanders but never leaves its rails.
  return (
    <g>
      {[70, 230].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke={stroke} />
      ))}
      {[110, 150, 190].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke={stroke} strokeDasharray="3 8" opacity="0.5" />
      ))}
      <path
        d="M-10 150 C 50 80, 90 90, 130 150 S 210 225, 250 150 S 330 80, 410 140"
        fill="none"
        stroke="var(--hue)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
        className="[stroke-dasharray:1] [stroke-dashoffset:0.35] transition-[stroke-dashoffset] duration-[1400ms] ease-[var(--ease-out)] group-hover:[stroke-dashoffset:0]"
      />
      {[[130, 150], [250, 150]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="9" fill="#08080b" stroke="var(--hue)" />
          <circle cx={x} cy={y} r="3" fill="var(--hue)" />
        </g>
      ))}
      <g opacity="0.9">
        <rect x="318" y="58" width="24" height="24" rx="6" fill="#08080b" stroke={stroke} />
        <path d="M325 70 l4 4 l8 -8" stroke="var(--hue)" fill="none" strokeWidth="2" />
        <rect x="58" y="218" width="24" height="24" rx="6" fill="#08080b" stroke={stroke} />
        <path d="M65 225 l10 10 M75 225 l-10 10" stroke="#f2f0ea" strokeOpacity="0.6" strokeWidth="2" />
      </g>
    </g>
  );
}

function Timeline() {
  // Hours of work with checkpoints: a long line, ticks, a resumable cursor.
  const ticks = Array.from({ length: 24 }, (_, i) => 30 + i * 14.8);
  return (
    <g>
      <circle cx="200" cy="150" r="112" fill="none" stroke={stroke} strokeDasharray="1 6" />
      <circle cx="200" cy="150" r="78" fill="none" stroke={stroke} opacity="0.5" />
      <g className={cn(spin, "group-hover:rotate-[120deg]")}>
        <circle cx="200" cy="38" r="5" fill="var(--hue)" />
        <circle cx="200" cy="38" r="14" fill="var(--hue)" opacity="0.15" />
      </g>
      <line x1="20" y1="252" x2="380" y2="252" stroke={stroke} />
      {ticks.map((x, i) => (
        <line
          key={i}
          x1={x}
          x2={x}
          y1={i % 6 === 0 ? 238 : 246}
          y2="258"
          stroke={i % 6 === 0 ? "var(--hue)" : stroke}
          strokeWidth={i % 6 === 0 ? 2 : 1}
        />
      ))}
      <rect
        x="30"
        y="249"
        width="250"
        height="6"
        rx="3"
        fill="var(--hue)"
        opacity="0.85"
        className="origin-left [transform-box:fill-box] scale-x-[0.62] transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-x-100"
      />
      <text x="200" y="158" textAnchor="middle" fill="#f2f0ea" fillOpacity="0.85" style={{ font: "500 22px var(--font-mono)" }}>
        09:41:07
      </text>
    </g>
  );
}

function Matrix() {
  // An eval grid: most cases pass, a few fail, one is being judged.
  const cols = 14;
  const rows = 8;
  const fails = new Set([17, 38, 61, 66, 93, 104]);
  return (
    <g>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = 52 + (i % cols) * 22.5;
        const y = 66 + Math.floor(i / cols) * 22.5;
        const fail = fails.has(i);
        const judged = i === 52;
        return (
          <rect
            key={i}
            x={x - 6}
            y={y - 6}
            width="12"
            height="12"
            rx="3"
            fill={fail ? "transparent" : judged ? "var(--hue)" : "rgba(242,240,234,.16)"}
            stroke={fail ? "var(--hue)" : "none"}
            className={judged ? "animate-pulse" : fail ? undefined : "transition-[fill] duration-500 group-hover:fill-[color-mix(in_oklab,var(--hue)_55%,transparent)]"}
            style={{ transitionDelay: `${(i % cols) * 25 + Math.floor(i / cols) * 15}ms` }}
          />
        );
      })}
    </g>
  );
}

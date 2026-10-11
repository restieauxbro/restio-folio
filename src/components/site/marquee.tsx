import { cn } from "@/lib/utils";

/** CSS-only infinite marquee. Pauses on hover; slows for reduced motion. */
export function Marquee({ items, className, duration = 38 }: { items: string[]; className?: string; duration?: number }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 sm:px-10">{item}</span>
          <Star />
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("group/marquee flex overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="size-[0.42em] shrink-0" aria-hidden>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="currentColor" />
    </svg>
  );
}

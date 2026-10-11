"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { TLink } from "./transition-link";
import { RollText } from "./roll-text";
import { LocalTime } from "./local-time";

export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Hide on scroll down, reveal on scroll up. Reads native scroll; never drives it.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 160);
          last = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset menu and header visibility on navigation (adjusting state during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setHidden(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Everything except the header is inert while the menu covers it.
    const header = document.getElementById("site-header");
    const siblings = [...document.body.children].filter((el) => el !== header && !el.contains(header));
    siblings.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      siblings.forEach((el) => el.removeAttribute("inert"));
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      id="site-header"
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ease-[var(--ease-out)]",
        hidden && !open && "-translate-y-full",
      )}
      style={{ viewTransitionName: "site-header" }}
    >
      <div
        className={cn(
          "mx-auto flex h-16 items-center justify-between gap-6 px-4 transition-[background-color,border-color,backdrop-filter] duration-500 sm:px-6 lg:px-10",
          "border-b border-transparent",
          scrolled && !open && "border-border bg-ink-900/70 backdrop-blur-xl",
        )}
      >
        <TLink href="/" direction="back" className="group flex items-center gap-3" aria-label={`${site.name}, home`}>
          <Mark />
          <span className="font-display text-[15px] font-bold uppercase tracking-[0.02em] [font-variation-settings:'wdth'_80]">
            <RollText>{site.short}</RollText>
          </span>
        </TLink>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <TLink
              key={item.href}
              href={item.href}
              direction={item.href === "/" ? "back" : "forward"}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "group relative rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
                isActive(item.href) ? "text-bone-50" : "text-bone-400 hover:text-bone-50",
              )}
            >
              {isActive(item.href) && (
                <span aria-hidden className="absolute left-1.5 top-1/2 size-1 -translate-y-1/2 rounded-full bg-signal" />
              )}
              <RollText>{item.label}</RollText>
            </TLink>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-400">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-signal" />
            Taking projects
          </span>
          <LocalTime className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-bone-500" />
        </div>

        <button
          type="button"
          className="relative z-10 -mr-2 flex size-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-6">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-6 bg-bone-50 transition-transform duration-500 ease-[var(--ease-out)]",
                open && "translate-y-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-px w-6 bg-bone-50 transition-transform duration-500 ease-[var(--ease-out)]",
                open && "-translate-y-1.5 -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 -z-10 flex flex-col justify-between bg-ink-950 px-4 pb-8 pt-24 transition-[clip-path,visibility] duration-700 ease-[var(--ease-out)] md:hidden",
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
        inert={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {nav.map((item, i) => (
            <TLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group flex items-baseline justify-between border-b border-border py-4"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="display text-[13vw] text-bone-50">{item.label}</span>
              <span className="label">0{i + 1}</span>
            </TLink>
          ))}
        </nav>
        <div className="flex items-end justify-between">
          <TLink href="/contact#enquire" onClick={() => setOpen(false)} className="text-lg text-bone-50 link-underline">
            Send an enquiry
          </TLink>
          <LocalTime className="label tabular-nums" />
        </div>
      </div>
    </header>
  );
}

/** The mark: a node held inside a frame. A model inside its harness. */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-7 text-bone-50" aria-hidden>
      <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <path
        d="M16 6.5 24.2 11.25v9.5L16 25.5l-8.2-4.75v-9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="origin-center [transform-box:fill-box] transition-transform duration-700 ease-[var(--ease-out)] group-hover:rotate-[30deg]"
      />
      <circle cx="16" cy="16" r="3.2" fill="var(--signal)" />
    </svg>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A two-part cursor: a precise dot and a lagging ring. Over any element with
 * [data-cursor="label"] the ring grows into a pill showing that label.
 * Fine pointers only; it stays out of the way for touch and reduced motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        dot.current?.style.setProperty("opacity", "1");
        ring.current?.style.setProperty("opacity", "1");
      }
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") || "" : null);
    };
    const onLeave = () => {
      visible = false;
      dot.current?.style.setProperty("opacity", "0");
      ring.current?.style.setProperty("opacity", "0");
    };
    const onDown = () => ring.current?.style.setProperty("--press", "0.85");
    const onUp = () => ring.current?.style.setProperty("--press", "1");

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const active = label !== null;
  const hasText = !!label;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150]" style={{ viewTransitionName: "site-cursor" }}>
      <div
        ref={ring}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-300"
      >
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-mono text-[10px] uppercase tracking-[0.16em] text-ink-950 transition-[width,height,background-color,border-color] duration-500 ease-[var(--ease-out)]"
          style={{
            width: hasText ? 84 : active ? 54 : 30,
            height: hasText ? 84 : active ? 54 : 30,
            scale: "var(--press, 1)",
            backgroundColor: hasText ? "var(--signal)" : "transparent",
            borderColor: hasText ? "var(--signal)" : "color-mix(in oklab, var(--bone-50) 35%, transparent)",
          }}
        >
          <span className={hasText ? "opacity-100 transition-opacity delay-150 duration-300" : "opacity-0"}>{label}</span>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 opacity-0">
        <div
          className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal transition-opacity duration-200"
          style={{ opacity: hasText ? 0 : 1 }}
        />
      </div>
    </div>
  );
}

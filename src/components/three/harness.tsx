"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const HarnessScene = dynamic(() => import("./harness-scene"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** The hero object. Falls back to a still line drawing without WebGL. */
export function Harness({ className }: { className?: string }) {
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  useEffect(() => setMode(hasWebGL() ? "3d" : "static"), []);

  return (
    <div className={cn("relative", className)} aria-hidden>
      {mode === "3d" ? <HarnessScene className="absolute inset-0" /> : <StaticHarness />}
    </div>
  );
}

function StaticHarness() {
  return (
    <svg viewBox="-100 -100 200 200" className="absolute inset-0 m-auto h-full w-full max-w-[560px] opacity-80">
      <defs>
        <radialGradient id="core" cx="40%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#1a1630" />
          <stop offset="70%" stopColor="#08080b" />
          <stop offset="100%" stopColor="#c8f25c" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <circle r="30" fill="url(#core)" />
      <polygon points="0,-56 48.5,-28 48.5,28 0,56 -48.5,28 -48.5,-28" fill="none" stroke="#f2f0ea" strokeOpacity="0.25" />
      <polygon points="0,-56 48.5,28 -48.5,28" fill="none" stroke="#f2f0ea" strokeOpacity="0.14" />
      <polygon points="0,56 48.5,-28 -48.5,-28" fill="none" stroke="#f2f0ea" strokeOpacity="0.14" />
      <ellipse rx="80" ry="22" fill="none" stroke="#f2f0ea" strokeOpacity="0.1" transform="rotate(-18)" />
      <rect x="74" y="-26" width="4" height="4" fill="#c8f25c" transform="rotate(-18)" />
    </svg>
  );
}

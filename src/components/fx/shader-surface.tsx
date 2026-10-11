"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { SceneName } from "./shader-scenes";

/**
 * Many browsers expose navigator.gpu without a usable adapter. Probe once per
 * page load so the ~700 KB shader chunk is only fetched when it can render.
 */
let gpuProbe: Promise<boolean> | null = null;
function probeGpu(): Promise<boolean> {
  if (gpuProbe) return gpuProbe;
  type GpuNavigator = Navigator & { gpu?: { requestAdapter(): Promise<unknown> } };
  const gpu = (navigator as GpuNavigator).gpu;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gpuProbe =
    !gpu || reduce
      ? Promise.resolve(false)
      : gpu
          .requestAdapter()
          .then((adapter) => !!adapter)
          .catch(() => false);
  return gpuProbe;
}

const ShaderScene = dynamic(() => import("./shader-scenes"), { ssr: false });

const FALLBACKS: Record<SceneName, string> = {
  hero:
    "radial-gradient(60% 50% at 70% 35%, rgba(155,140,255,.16), transparent 70%), radial-gradient(45% 40% at 25% 75%, rgba(200,242,92,.10), transparent 70%), #08080b",
  cta:
    "radial-gradient(50% 60% at 30% 40%, rgba(200,242,92,.18), transparent 70%), radial-gradient(50% 60% at 75% 70%, rgba(155,140,255,.20), transparent 70%), #08080b",
  lime: "radial-gradient(70% 70% at 70% 30%, rgba(200,242,92,.28), transparent 70%), #08080b",
  violet: "radial-gradient(70% 70% at 70% 30%, rgba(155,140,255,.30), transparent 70%), #08080b",
  cyan: "radial-gradient(70% 70% at 70% 30%, rgba(95,227,240,.26), transparent 70%), #08080b",
  amber: "radial-gradient(70% 70% at 70% 30%, rgba(255,181,71,.26), transparent 70%), #08080b",
};

/**
 * A full-bleed shader background. Uses the WebGPU `shaders` library where
 * available and a matching CSS gradient everywhere else (and for reduced
 * motion), so the page never shows an empty canvas.
 */
export function ShaderSurface({ scene, className }: { scene: SceneName; className?: string }) {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    let live = true;
    probeGpu().then((ok) => live && setSupported(ok));
    return () => {
      live = false;
    };
  }, []);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const canRun = supported && !failed;

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0" style={{ background: FALLBACKS[scene] }} />
      {canRun && (
        <div className={cn("absolute inset-0 transition-opacity duration-[1600ms]", ready ? "opacity-100" : "opacity-0")}>
          <ShaderScene scene={scene} onReady={() => setReady(true)} onUnavailable={() => setFailed(true)} />
        </div>
      )}
    </div>
  );
}

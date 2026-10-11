"use client";

import {
  Shader,
  MeshGradient,
  FloatingParticles,
  FilmGrain,
  Vignette,
  ChromaFlow,
  FlowingGradient,
} from "shaders/react";

export type SceneName = "hero" | "cta" | "lime" | "violet" | "cyan" | "amber";

const ACCENTS: Record<"lime" | "violet" | "cyan" | "amber", string> = {
  lime: "#c8f25c",
  violet: "#9b8cff",
  cyan: "#5fe3f0",
  amber: "#ffb547",
};

type Props = { scene: SceneName; onReady?: () => void; onUnavailable?: () => void };

/** WebGPU scenes built from the `shaders` library. Loaded lazily by <ShaderSurface>. */
export default function ShaderScene({ scene, onReady, onUnavailable }: Props) {
  const common = {
    className: "h-full w-full",
    disableTelemetry: true,
    onReady,
    onUnavailable: () => onUnavailable?.(),
  } as const;

  if (scene === "hero") {
    return (
      <Shader {...common}>
        <MeshGradient
          stops={[
            { color: "#040406", position: 0 },
            { color: "#0b0b12", position: 0.45 },
            { color: "#16122a", position: 0.78 },
            { color: "#1d2a10", position: 1 },
          ]}
          count={4}
          speed={0.35}
          swirl={0.55}
          seed={11}
        />
        <FloatingParticles
          count={900}
          speed={0.15}
          particleSize={0.6}
          particleColor="#c8f25c"
          twinkle={0.6}
          cursorStrength={0.6}
          opacity={0.55}
          blendMode="screen"
        />
        <FilmGrain strength={0.12} animated />
        <Vignette color="#040406" radius={0.55} falloff={0.6} intensity={1} />
      </Shader>
    );
  }

  if (scene === "cta") {
    return (
      <Shader {...common}>
        <MeshGradient colorA="#050507" colorB="#121022" count={3} speed={0.25} seed={4} />
        <ChromaFlow
          baseColor="#000000"
          upColor="#c8f25c"
          downColor="#9b8cff"
          leftColor="#5fe3f0"
          rightColor="#c8f25c"
          intensity={0.9}
          radius={1.6}
          momentum={22}
          blendMode="screen"
          opacity={0.75}
        />
        <FilmGrain strength={0.1} />
        <Vignette color="#040406" radius={0.65} falloff={0.5} intensity={0.9} />
      </Shader>
    );
  }

  const hue = ACCENTS[scene];
  return (
    <Shader {...common}>
      <FlowingGradient colorA="#040406" colorB="#0d0d14" colorC={hue} colorD="#040406" speed={0.6} distortion={0.6} seed={3} />
      <FilmGrain strength={0.14} />
      <Vignette color="#040406" radius={0.5} falloff={0.6} intensity={1} />
    </Shader>
  );
}

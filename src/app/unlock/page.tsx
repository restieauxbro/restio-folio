import type { Metadata } from "next";
import { Harness } from "@/components/three/harness";
import { ShaderSurface } from "@/components/fx/shader-surface";
import { safeNext } from "@/lib/gate";
import { site } from "@/lib/site";
import { UnlockForm } from "./unlock-form";

export const metadata: Metadata = { title: "Private preview" };

export default async function UnlockPage({ searchParams }: PageProps<"/unlock">) {
  const { next } = await searchParams;
  const target = safeNext(Array.isArray(next) ? next[0] : next);

  return (
    <main id="main" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
      <ShaderSurface scene="hero" />
      <div aria-hidden className="blueprint absolute inset-0 opacity-60" />
      <Harness className="absolute inset-y-0 right-[-30%] -z-0 w-[90%] opacity-60 sm:right-[-12%] sm:w-[70%]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_60%_at_35%_50%,rgba(8,8,11,.85),transparent_75%)]" />

      <div className="relative flex items-center justify-between">
        <span className="font-display text-[15px] font-bold uppercase tracking-[0.02em] [font-variation-settings:'wdth'_80]">{site.short}</span>
        <span className="label flex items-center gap-2">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-signal" /> Private preview
        </span>
      </div>

      <div className="relative my-auto w-full max-w-xl py-16 sm:ml-[6%] lg:ml-[10%]">
        <p className="label">[ Restricted ]</p>
        <h1 className="display mt-6 text-[clamp(3.2rem,10vw,7rem)] text-bone-50">
          Guardrails{" "}
          <em className="font-serif font-normal normal-case italic tracking-[-0.03em] text-signal [font-variation-settings:normal]">
            on.
          </em>
        </h1>
        <p className="mt-5 max-w-md text-lg text-bone-200">
          This portfolio is shared privately. Enter the access code you were given.
        </p>
        <div className="mt-10">
          <UnlockForm next={target} />
        </div>
      </div>

      <p className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-bone-500">
        Need access? <a href={`mailto:${site.email}`} className="text-bone-200 link-underline">{site.email}</a>
      </p>
    </main>
  );
}

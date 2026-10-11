import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100svh] flex-col items-start justify-end px-4 pb-16 sm:px-6 lg:px-10">
      <div aria-hidden className="blueprint absolute inset-0 -z-10 opacity-60" />
      <p className="label">[ 404 ]</p>
      <h1 className="display mt-6 text-[clamp(4rem,16vw,16rem)] text-bone-50">
        Off the{" "}
        <em className="font-serif font-normal normal-case italic tracking-[-0.03em] text-signal [font-variation-settings:normal]">rails</em>
      </h1>
      <p className="mt-6 max-w-md text-lg text-bone-200">This page doesn&apos;t exist. Even the best guardrails miss one sometimes.</p>
      <Link href="/" className="mt-10 rounded-full bg-bone-50 px-6 py-4 font-medium text-ink-950 transition-colors hover:bg-signal">
        Back to the index
      </Link>
    </main>
  );
}

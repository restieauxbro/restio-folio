"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      data-cursor={copied ? "Copied" : "Copy"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${site.email}`;
        }
      }}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-400 transition-colors hover:border-bone-400 hover:text-bone-50",
        className,
      )}
      aria-live="polite"
    >
      {copied ? <Check className="size-3.5 text-signal" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}

import { cn } from "@/lib/utils";

/** Text that rolls up to a duplicate of itself on hover of the nearest .group. */
export function RollText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("relative inline-flex overflow-hidden align-top", className)}>
      <span className="block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full text-signal transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

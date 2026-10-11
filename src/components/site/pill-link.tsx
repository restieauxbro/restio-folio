import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/fx/magnetic";
import { TLink } from "./transition-link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  external?: boolean;
};

/** Pill CTA whose arrow disc expands to fill the button on hover. */
export function PillLink({ href, children, variant = "solid", className, external }: Props) {
  const classes = cn(
    "group relative isolate inline-flex h-14 items-center gap-4 overflow-hidden rounded-full pl-6 pr-2 text-[15px] font-medium transition-colors duration-500",
    variant === "solid"
      ? "bg-bone-50 text-ink-950 hover:text-ink-950"
      : "border border-border text-bone-50 hover:border-transparent hover:text-ink-950",
    className,
  );
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 flex size-10 items-center justify-center">
        <span
          aria-hidden
          className={cn(
            "absolute right-0 top-1/2 -z-10 size-10 -translate-y-1/2 rounded-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[14]",
            variant === "solid" ? "bg-ink-950 group-hover:bg-signal" : "bg-signal",
          )}
        />
        <ArrowUpRight
          className={cn(
            "size-4 transition-[transform,color] duration-500 ease-[var(--ease-out)] group-hover:rotate-45 group-hover:text-ink-950",
            variant === "solid" ? "text-bone-50" : "text-ink-950",
          )}
          strokeWidth={1.6}
        />
      </span>
    </>
  );
  return (
    <Magnetic>
      {external ? (
        <a href={href} className={classes}>
          {inner}
        </a>
      ) : (
        <TLink href={href} className={classes}>
          {inner}
        </TLink>
      )}
    </Magnetic>
  );
}

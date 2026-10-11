"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & { direction?: "forward" | "back" };

/** next/link with a page transition type attached. */
export function TLink({ direction = "forward", transitionTypes, ...props }: Props) {
  return <Link transitionTypes={transitionTypes ?? [direction === "back" ? "page-back" : "page-forward"]} {...props} />;
}

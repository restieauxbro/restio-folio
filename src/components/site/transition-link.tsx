"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & { direction?: "forward" | "back" | "morph" };

const TYPES = { forward: "page-forward", back: "page-back", morph: "page-morph" } as const;

/**
 * next/link with a page transition type attached.
 * forward/back play the signal curtain; morph skips it so shared elements
 * (case-study cover and title) can fly between pages unobstructed.
 */
export function TLink({ direction = "forward", transitionTypes, ...props }: Props) {
  return <Link transitionTypes={transitionTypes ?? [TYPES[direction]]} {...props} />;
}

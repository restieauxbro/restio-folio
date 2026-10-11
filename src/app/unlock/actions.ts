"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE, GATE_MAX_AGE, gatePassword, gateToken, isCorrectPassword, safeNext } from "@/lib/gate";

export type UnlockState = { error: string | null };

export async function unlock(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!gatePassword()) {
    return { error: "This site isn't configured yet. Set SITE_PASSWORD." };
  }
  // A small fixed delay blunts online guessing without needing a store.
  await new Promise((r) => setTimeout(r, 450));
  if (!isCorrectPassword(password)) {
    return { error: "That's not it. Try again." };
  }

  const jar = await cookies();
  jar.set(GATE_COOKIE, gateToken(gatePassword()!), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE,
  });
  redirect(next);
}

import { createHmac, timingSafeEqual } from "node:crypto";

export const GATE_COOKIE = "rf_gate";
export const GATE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** The password, or null when the gate is not configured. */
export function gatePassword(): string | null {
  const pw = process.env.SITE_PASSWORD;
  return pw && pw.length > 0 ? pw : null;
}

/** Deterministic token derived from the password, so rotating the password revokes every session. */
export function gateToken(password: string): string {
  return createHmac("sha256", password).update("restio-folio/gate/v1").digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function isValidToken(token: string | undefined): boolean {
  const pw = gatePassword();
  if (!pw || !token) return false;
  return safeEqual(token, gateToken(pw));
}

export function isCorrectPassword(attempt: string): boolean {
  const pw = gatePassword();
  if (!pw) return false;
  // Compare HMACs so lengths always match and nothing leaks through timing.
  return safeEqual(gateToken(attempt), gateToken(pw));
}

/** Only allow same-site relative redirects after unlocking. */
export function safeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/";
  }
  return next.startsWith("/unlock") ? "/" : next;
}

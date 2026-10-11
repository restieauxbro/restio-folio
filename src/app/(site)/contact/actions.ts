"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { TOPICS, type ContactField, type ContactState } from "./contact-shared";

const schema = z.object({
  name: z.string().trim().min(2, "Tell me your name.").max(120, "That name is a bit long."),
  email: z.string().trim().toLowerCase().email("That email doesn't look right.").max(200),
  company: z.string().trim().max(160).optional().default(""),
  topic: z.enum(TOPICS, { message: "Pick what you're after." }),
  message: z
    .string()
    .trim()
    .min(20, "A little more detail helps. A sentence or two is plenty.")
    .max(5000, "Keep it under 5,000 characters. We can go deeper on a call."),
});

type Field = ContactField;

const UNAVAILABLE = "The form isn't taking messages right now. Please try again later, or reach me on LinkedIn.";
const FAILED = "Something went wrong sending that. Please try again in a minute.";

/** Submissions faster than this after the form renders are almost certainly bots. */
const MIN_FILL_MS = 2500;

/**
 * Best-effort per-IP limiter. It lives in memory, so it only holds within a
 * single warm server instance; it stops a burst, not a determined attacker.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendEnquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(
    ["name", "email", "company", "topic", "message"].map((k) => [k, String(formData.get(k) ?? "")]),
  );

  // Honeypot: real people never see or fill this field. Pretend it worked.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "sent", name: raw.name || "there" };
  }
  const startedAt = Number(formData.get("startedAt"));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "error", message: "That was quick. Give it a second and try again.", values: raw };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<Field, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as Field;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "A couple of things need fixing.", fieldErrors, values: raw };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "That's a lot of messages. Try again in a few minutes.", values: raw };
  }

  const { name, email, company, topic, message } = parsed.data;
  const subject = `New enquiry: ${topic} from ${name}${company ? ` (${company})` : ""}`;
  const details = [`Name: ${name}`, `Email: ${email}`, ...(company ? [`Company: ${company}`] : []), `Interested in: ${topic}`];
  const text = [
    details.join("\n"),
    message,
    "Sent from the contact form on your portfolio. Reply to this email to respond directly.",
  ].join("\n\n");

  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#75736d;font:12px/1.5 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.1em;vertical-align:top">${k}</td><td style="padding:6px 0;color:#111;font:15px/1.5 system-ui,sans-serif">${escapeHtml(v)}</td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f2f0ea">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;border:1px solid #e4e1d8">
<p style="margin:0 0 4px;font:12px/1.5 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#6b8f12">New enquiry · ${escapeHtml(topic)}</p>
<h1 style="margin:0 0 20px;font:600 22px/1.25 system-ui,sans-serif;color:#08080b">${escapeHtml(name)}${company ? ` <span style="color:#75736d;font-weight:400">· ${escapeHtml(company)}</span>` : ""}</h1>
<table style="border-collapse:collapse;margin-bottom:20px">${row("Email", email)}${company ? row("Company", company) : ""}${row("Topic", topic)}</table>
<div style="white-space:pre-wrap;font:15px/1.65 system-ui,sans-serif;color:#1d1d25;border-top:1px solid #eee;padding-top:20px">${escapeHtml(message)}</div>
<p style="margin:24px 0 0;font:13px/1.5 system-ui,sans-serif;color:#75736d">Reply to this email to respond to ${escapeHtml(name)} directly.</p>
</div></body></html>`;

  // The destination address only ever lives in server env, never in the bundle or HTML.
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  // Local testing without sending real email.
  if (process.env.CONTACT_DRY_RUN === "1") {
    console.info("[contact] dry run", { from, to: to ?? "(CONTACT_TO_EMAIL unset)", replyTo: email, subject, text });
    return { status: "sent", name };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return { status: "error", message: UNAVAILABLE, values: raw };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({ from, to, replyTo: email, subject, text, html });
    if (error) {
      console.error("[contact] resend error", error);
      return { status: "error", message: FAILED, values: raw };
    }
  } catch (err) {
    console.error("[contact] send failed", err);
    return { status: "error", message: FAILED, values: raw };
  }

  return { status: "sent", name };
}

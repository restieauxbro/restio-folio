"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { sendEnquiry } from "./actions";
import { TOPICS, type ContactField, type ContactState } from "./contact-shared";

const MAX_MESSAGE = 5000;

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendEnquiry, { status: "idle" });
  const startedAt = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(0);

  // Stamp when the form became usable; the server rejects instant submissions.
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, [state]);

  if (state.status === "sent") return <Sent name={state.name} />;

  const values = state.status === "error" ? (state.values ?? {}) : {};
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const err = (f: ContactField) => errors[f];

  return (
    <form action={action} noValidate className="relative" aria-describedby={state.status === "error" ? "form-status" : undefined}>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />
      {/* Honeypot: hidden from people and assistive tech, irresistible to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <fieldset className="mb-10">
        <legend className="label mb-4">What are you after?</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t, i) => (
            <label key={t} className="group relative cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t}
                defaultChecked={values.topic ? values.topic === t : i === 0}
                className="peer sr-only"
              />
              <span className="flex h-11 items-center gap-2 rounded-full border border-border px-5 text-[15px] text-bone-200 transition-[background-color,border-color,color] duration-300 group-hover:border-bone-400 peer-checked:border-signal peer-checked:bg-signal peer-checked:text-ink-950 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal">
                {t}
              </span>
            </label>
          ))}
        </div>
        <FieldError id="topic-error" message={err("topic")} />
      </fieldset>

      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
        <Field label="Name" name="name" error={err("name")}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            defaultValue={values.name}
            aria-invalid={!!err("name")}
            aria-describedby={err("name") ? "name-error" : undefined}
            className={fieldClass}
          />
        </Field>
        <Field label="Email" name="email" error={err("email")}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={200}
            defaultValue={values.email}
            aria-invalid={!!err("email")}
            aria-describedby={err("email") ? "email-error" : undefined}
            className={fieldClass}
          />
        </Field>
        <Field label="Company" hint="Optional" name="company" error={err("company")} className="sm:col-span-2">
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            maxLength={160}
            defaultValue={values.company}
            className={fieldClass}
          />
        </Field>
        <Field
          label="What are you trying to ship?"
          name="message"
          error={err("message")}
          className="sm:col-span-2"
          hint={`${count.toLocaleString()} / ${MAX_MESSAGE.toLocaleString()}`}
        >
          <Textarea
            id="message"
            name="message"
            required
            rows={6}
            maxLength={MAX_MESSAGE}
            defaultValue={values.message}
            onChange={(e) => setCount(e.target.value.length)}
            aria-invalid={!!err("message")}
            aria-describedby={err("message") ? "message-error" : undefined}
            placeholder="The problem, where you are with it, and what good looks like."
            className={cn(fieldClass, "min-h-40 resize-y py-3 leading-relaxed")}
          />
        </Field>
      </div>

      <div className="mt-10 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-status" role={state.status === "error" ? "alert" : undefined} className="min-h-6 text-[15px]">
          {state.status === "error" ? (
            <span className="text-destructive">{state.message}</span>
          ) : (
            <span className="text-bone-400">Goes straight to my inbox. I reply personally.</span>
          )}
        </p>
        <button
          type="submit"
          disabled={pending}
          data-cursor={pending ? "" : "Send"}
          className="group relative isolate inline-flex h-14 shrink-0 items-center gap-4 self-start overflow-hidden rounded-full bg-bone-50 pl-6 pr-2 text-[15px] font-medium text-ink-950 disabled:opacity-80 sm:self-auto"
        >
          <span className="relative z-10">{pending ? "Sending" : "Send enquiry"}</span>
          <span className="relative z-10 flex size-10 items-center justify-center">
            <span
              aria-hidden
              className="absolute right-0 top-1/2 -z-10 size-10 -translate-y-1/2 rounded-full bg-ink-950 transition-[transform,background-color] duration-700 ease-[var(--ease-out)] group-hover:scale-[14] group-hover:bg-signal group-disabled:scale-100"
            />
            {pending ? (
              <Loader2 className="size-4 animate-spin text-bone-50" />
            ) : (
              <ArrowUpRight
                className="size-4 text-bone-50 transition-[transform,color] duration-500 group-hover:rotate-45 group-hover:text-ink-950"
                strokeWidth={1.6}
              />
            )}
          </span>
        </button>
      </div>
    </form>
  );
}

const fieldClass =
  "h-12 rounded-none border-0 border-b border-border bg-transparent px-0 text-lg text-bone-50 shadow-none transition-colors placeholder:text-bone-500 focus-visible:border-signal focus-visible:ring-0 aria-invalid:border-destructive dark:bg-transparent md:text-lg";

function Field({
  label,
  name,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  name: ContactField;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <Label htmlFor={name} className="label">
          {label}
        </Label>
        {hint && <span className="font-mono text-[11px] tabular-nums text-bone-500">{hint}</span>}
      </div>
      {children}
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-destructive">
      {message}
    </p>
  );
}

function Sent({ name }: { name: string }) {
  const first = name.split(" ")[0];
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { top, bottom } = el.getBoundingClientRect();
    if (top < 80 || bottom > window.innerHeight) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
    el.focus({ preventScroll: true });
  }, []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="flex min-h-[420px] flex-col justify-center outline-none" data-reveal>
      <span className="fade-up flex size-16 items-center justify-center rounded-full bg-signal text-ink-950">
        <Check className="size-7" strokeWidth={2} />
      </span>
      <h2 className="display mt-10 text-[clamp(3rem,7vw,6rem)] text-bone-50">
        <span className="reveal-line">
          <span>Message</span>
        </span>
        <span className="reveal-line">
          <span style={{ "--i": 1 } as React.CSSProperties}>
            <em className="font-serif font-normal normal-case italic tracking-[-0.03em] text-signal [font-variation-settings:normal]">
              received.
            </em>
          </span>
        </span>
      </h2>
      <p className="fade-up mt-6 max-w-md text-lg leading-relaxed text-bone-200" style={{ "--i": 2 } as React.CSSProperties}>
        Thanks {first}. It&apos;s in my inbox, and I&apos;ll reply from my own address shortly.
      </p>
    </div>
  );
}

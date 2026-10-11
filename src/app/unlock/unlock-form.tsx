"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { unlock, type UnlockState } from "./actions";

export function UnlockForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlock, { error: null });
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="w-full">
      <input type="hidden" name="next" value={next} />
      <Label htmlFor="password" className="label">
        Access code
      </Label>
      <div
        className={cn(
          "mt-3 flex h-16 items-center gap-2 rounded-full border bg-ink-900/80 pl-6 pr-2 backdrop-blur-md transition-colors focus-within:border-signal",
          state.error ? "border-destructive/60" : "border-border",
        )}
      >
        <Input
          id="password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          autoFocus
          required
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "pw-error" : undefined}
          placeholder="Enter the password"
          className="h-full flex-1 border-0 bg-transparent px-0 text-lg text-bone-50 shadow-none placeholder:text-bone-500 focus-visible:ring-0 dark:bg-transparent"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="flex size-10 items-center justify-center rounded-full text-bone-400 hover:text-bone-50"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex size-12 items-center justify-center rounded-full bg-signal text-ink-950 transition-transform duration-500 ease-[var(--ease-out)] hover:scale-105 disabled:opacity-70"
          aria-label="Unlock"
        >
          {pending ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
        </button>
      </div>
      <p id="pw-error" role="alert" className="mt-3 h-5 pl-6 text-sm text-destructive">
        {state.error}
      </p>
    </form>
  );
}

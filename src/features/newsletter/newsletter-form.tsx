"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import {
  subscribeNewsletterAction,
  type NewsletterFormState,
} from "@/features/newsletter/newsletter-actions";
import { cn } from "@/shared/utils/cn";

const initialState: NewsletterFormState = null;

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletterAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="w-full max-w-md">
      <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-2 ring-1 ring-inset ring-white/15 focus-within:ring-leaf-400/60">
        <span className="pl-2 text-white/60">
          <Mail className="h-5 w-5" />
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="siz@email.com"
          aria-label="E-poçt ünvanı"
          aria-describedby="newsletter-status"
          className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
        />
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {pending ? "Gözləyin…" : "Abunə ol"}
        </button>
      </div>
      <p
        id="newsletter-status"
        aria-live="polite"
        className={cn(
          "mt-2 min-h-5 text-xs",
          state?.ok ? "text-leaf-400" : "text-rose-300",
        )}
      >
        {state?.fieldErrors?.email || state?.message || " "}
      </p>
    </form>
  );
}

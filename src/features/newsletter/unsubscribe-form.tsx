"use client";

import { useActionState } from "react";
import {
  unsubscribeNewsletterAction,
  type NewsletterFormState,
} from "@/features/newsletter/newsletter-actions";

const initialState: NewsletterFormState = null;

export function UnsubscribeForm({ token }: { token: string }) {
  const action = unsubscribeNewsletterAction.bind(null, token);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state?.ok) {
    return (
      <p className="rounded-xl bg-brand-50 p-4 text-sm font-medium text-brand-800">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm leading-relaxed text-gray-600">
        Brand Technology yeniliklərini artıq almaq istəmirsinizsə, aşağıdakı
        düymə ilə abunəliyi dayandıra bilərsiniz.
      </p>
      {state ? (
        <p className="text-sm font-medium text-rose-600">{state.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending || !token}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
      >
        {pending ? "Gözləyin…" : "Abunəlikdən çıx"}
      </button>
    </form>
  );
}

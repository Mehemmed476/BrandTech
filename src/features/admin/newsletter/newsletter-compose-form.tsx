"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components";
import { TextareaField, TextField } from "@/features/admin/form-ui";
import { sendNewsletterAction } from "@/features/newsletter/newsletter-actions";

export function NewsletterComposeForm({
  activeCount,
  smtpConfigured,
}: {
  activeCount: number;
  smtpConfigured: boolean;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !window.confirm(
        `Bu mesaj ${activeCount} aktiv abunəçiyə göndəriləcək. Davam edilsin?`,
      )
    ) {
      return;
    }

    setErrors({});
    startTransition(async () => {
      const result = await sendNewsletterAction({ subject, message });
      toast(result.message, result.ok ? "success" : "error");
      if (result.ok) {
        setSubject("");
        setMessage("");
        router.refresh();
      } else {
        setErrors(result.fieldErrors ?? {});
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5">
      {!smtpConfigured ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          Email göndərişini aktivləşdirmək üçün serverdə SMTP dəyişənlərini
          sazlayın.
        </div>
      ) : null}
      <TextField
        label="Email mövzusu"
        required
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        error={errors.subject}
        placeholder="Məsələn: Həftənin xüsusi endirimləri"
      />
      <TextareaField
        label="Mesaj"
        required
        rows={8}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        error={errors.message}
        placeholder="Abunəçilərə göndəriləcək mətni yazın…"
        hint="Mətn email dizaynına avtomatik yerləşdirilir və hər emailə abunəlikdən çıxma linki əlavə olunur."
      />
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Alıcı sayı: <strong className="text-gray-900">{activeCount}</strong>
        </p>
        <button
          type="submit"
          disabled={pending || activeCount === 0 || !smtpConfigured}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {pending ? "Göndərilir…" : "Hamısına göndər"}
        </button>
      </div>
    </form>
  );
}

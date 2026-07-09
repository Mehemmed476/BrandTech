"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import { useToast } from "@/shared/components";
import { loginAction } from "@/features/auth/auth-actions";

export function AdminLoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const result = await loginAction({ identifier, password });
      if (result.ok) {
        toast(result.message, "success");
        router.replace("/admin");
        router.refresh();
      } else {
        setErrors(result.fieldErrors ?? {});
        toast(result.message, "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-gray-700">
          E-poçt və ya telefon
        </span>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 text-sm text-gray-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            placeholder="admin@brandtechnology.az"
          />
        </div>
        {errors.identifier ? (
          <p className="mt-1.5 text-xs font-medium text-rose-600">
            {errors.identifier}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-gray-700">
          Şifrə
        </span>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 text-sm text-gray-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            placeholder="••••••••"
          />
        </div>
        {errors.password ? (
          <p className="mt-1.5 text-xs font-medium text-rose-600">
            {errors.password}
          </p>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" />
        {pending ? "Giriş edilir…" : "Daxil ol"}
      </button>
    </form>
  );
}

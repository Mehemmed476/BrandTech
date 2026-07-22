"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components";
import { FormActions, TextField } from "@/features/admin/form-ui";
import { changeAdminPasswordAction } from "@/features/admin/users/user-actions";

export function AdminPasswordForm({
  userId,
  isSelf,
}: {
  userId: string;
  isSelf: boolean;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const result = await changeAdminPasswordAction(userId, {
        password,
        confirmPassword,
      });
      if (result.ok) {
        toast(result.message, "success");
        router.push(isSelf ? "/admin/login" : "/admin/users");
        router.refresh();
      } else {
        setErrors(result.fieldErrors ?? {});
        toast(result.message, "error");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft"
    >
      <TextField
        label="Yeni şifrə"
        required
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
        autoComplete="new-password"
      />
      <TextField
        label="Yeni şifrəni təkrarla"
        required
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />
      <FormActions
        loading={pending}
        cancelHref="/admin/users"
        submitLabel="Şifrəni dəyiş"
      />
    </form>
  );
}

"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components";
import { FormActions, TextField } from "@/features/admin/form-ui";
import { createAdminUserAction } from "@/features/admin/users/user-actions";

export function AdminUserForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const result = await createAdminUserAction({
        fullName,
        email,
        phone,
        password,
      });
      if (result.ok) {
        toast(result.message, "success");
        router.push("/admin/users");
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
        label="Ad və soyad"
        required
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        error={errors.fullName}
        autoComplete="name"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="E-poçt"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <TextField
          label="Telefon"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>
      <TextField
        label="İlkin şifrə"
        required
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
        autoComplete="new-password"
        hint="Ən azı 8 simvol. İstifadəçiyə təhlükəsiz kanalla çatdırın."
      />
      <FormActions
        loading={pending}
        cancelHref="/admin/users"
        submitLabel="Admin yarat"
      />
    </form>
  );
}

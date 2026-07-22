"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components";
import { TextField, ToggleField } from "@/features/admin/form-ui";
import { ImageUploadField } from "@/features/admin/image-upload-field";
import { saveSettingsAction } from "@/features/admin/settings/settings-actions";
import type { StoreSettings } from "@/shared/types/settings";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [values, setValues] = useState<StoreSettings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const update = <Key extends keyof StoreSettings>(
    key: Key,
    value: StoreSettings[Key],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const result = await saveSettingsAction(values);
      if (result.ok) {
        toast(result.message, "success");
        router.refresh();
      } else {
        setErrors(result.fieldErrors ?? {});
        toast(result.message, "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900">
          Mağaza məlumatları
        </h2>
        <ImageUploadField
          label="Mağaza logosu"
          value={values.logoUrl}
          onChange={(value) => update("logoUrl", value)}
          error={errors.logoUrl}
          hint="PNG, WEBP və ya şəffaf fonlu logo yükləyə bilərsiniz."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Mağaza adı"
            required
            value={values.storeName}
            onChange={(event) => update("storeName", event.target.value)}
            error={errors.storeName}
          />
          <TextField
            label="Telefon"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            error={errors.phone}
          />
          <TextField
            label="WhatsApp"
            value={values.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
            error={errors.whatsapp}
          />
          <TextField
            label="E-poçt"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            error={errors.email}
          />
          <TextField
            label="Ünvan"
            value={values.address}
            onChange={(event) => update("address", event.target.value)}
            error={errors.address}
          />
          <TextField
            label="İş saatları"
            value={values.workingHours}
            onChange={(event) => update("workingHours", event.target.value)}
            error={errors.workingHours}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
        <div>
          <h2 className="text-base font-bold text-gray-900">Hero banner</h2>
          <p className="mt-1 text-sm text-gray-500">
            Ana səhifədəki bannerlərin avtomatik dəyişməsini idarə edin.
          </p>
        </div>
        <ToggleField
          label="Avtomatik dəyişmə"
          description="Söndürüldükdə banner yalnız oxlar və nöqtələrlə dəyişəcək."
          checked={values.heroAutoplay}
          onChange={(value) => update("heroAutoplay", value)}
        />
        <TextField
          label="Dəyişmə intervalı (saniyə)"
          type="number"
          min={2}
          max={60}
          step={1}
          disabled={!values.heroAutoplay}
          className="disabled:cursor-not-allowed disabled:opacity-60"
          value={values.heroIntervalSeconds}
          onChange={(event) =>
            update("heroIntervalSeconds", Number(event.target.value))
          }
          error={errors.heroIntervalSeconds}
          hint="2–60 saniyə aralığında dəyər daxil edin."
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900">Mətnlər</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Çatdırılma mətni"
            value={values.deliveryText}
            onChange={(event) => update("deliveryText", event.target.value)}
            error={errors.deliveryText}
          />
          <TextField
            label="Zəmanət mətni"
            value={values.warrantyText}
            onChange={(event) => update("warrantyText", event.target.value)}
            error={errors.warrantyText}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900">Sosial şəbəkələr</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            label="Instagram"
            value={values.instagram}
            onChange={(event) => update("instagram", event.target.value)}
            error={errors.instagram}
          />
          <TextField
            label="Facebook"
            value={values.facebook}
            onChange={(event) => update("facebook", event.target.value)}
            error={errors.facebook}
          />
          <TextField
            label="YouTube"
            value={values.youtube}
            onChange={(event) => update("youtube", event.target.value)}
            error={errors.youtube}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Gözləyin…" : "Yadda saxla"}
        </button>
      </div>
    </form>
  );
}

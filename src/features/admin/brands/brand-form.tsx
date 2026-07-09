"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components";
import { slugify } from "@/shared/utils/slugify";
import { FormActions, TextField, ToggleField } from "@/features/admin/form-ui";
import { ImageUploadField } from "@/features/admin/image-upload-field";
import {
  createBrandAction,
  updateBrandAction,
} from "@/features/admin/brands/brand-actions";
import type { AdminBrandRow } from "@/shared/services/brands/brand.service";

export function BrandForm({ brand }: { brand?: AdminBrandRow }) {
  const isEdit = Boolean(brand);
  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl ?? "");
  const [isActive, setIsActive] = useState(brand?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const input = { name, slug, logoUrl, isActive };
      const result = brand
        ? await updateBrandAction(brand.id, input)
        : await createBrandAction(input);
      if (result.ok) {
        toast(result.message, "success");
        router.push("/admin/brands");
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
        label="Brend adı"
        required
        value={name}
        onChange={(event) => handleName(event.target.value)}
        error={errors.name}
        placeholder="Məsələn: ASUS"
      />
      <TextField
        label="Slug"
        required
        value={slug}
        onChange={(event) => {
          setSlugTouched(true);
          setSlug(event.target.value);
        }}
        error={errors.slug}
        hint="URL üçün istifadə olunur (avtomatik doldurulur)."
      />
      <ImageUploadField
        label="Logo"
        value={logoUrl}
        onChange={setLogoUrl}
        error={errors.logoUrl}
      />
      <ToggleField
        label="Aktiv"
        description="Mağazada göstərilsin"
        checked={isActive}
        onChange={setIsActive}
      />
      <FormActions
        loading={pending}
        cancelHref="/admin/brands"
        submitLabel={isEdit ? "Yenilə" : "Əlavə et"}
      />
    </form>
  );
}

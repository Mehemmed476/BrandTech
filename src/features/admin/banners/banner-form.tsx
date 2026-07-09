"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components";
import { bannerPositionLabels } from "@/shared/constants/labels";
import {
  FormActions,
  SelectField,
  TextField,
  TextareaField,
  ToggleField,
} from "@/features/admin/form-ui";
import { ImageUploadField } from "@/features/admin/image-upload-field";
import {
  createBannerAction,
  updateBannerAction,
} from "@/features/admin/banners/banner-actions";
import type { AdminBannerRow } from "@/shared/services/banners/banner.service";

const positionOptions = (
  Object.keys(bannerPositionLabels) as (keyof typeof bannerPositionLabels)[]
).map((key) => ({ value: key, label: bannerPositionLabels[key] }));

export function BannerForm({ banner }: { banner?: AdminBannerRow }) {
  const isEdit = Boolean(banner);
  const [title, setTitle] = useState(banner?.title ?? "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle ?? "");
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(banner?.linkUrl ?? "");
  const [position, setPosition] = useState<string>(banner?.position ?? "HERO");
  const [sortOrder, setSortOrder] = useState(String(banner?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const input = {
        title,
        subtitle,
        imageUrl,
        linkUrl,
        position,
        sortOrder,
        isActive,
      };
      const result = banner
        ? await updateBannerAction(banner.id, input)
        : await createBannerAction(input);
      if (result.ok) {
        toast(result.message, "success");
        router.push("/admin/banners");
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
        label="Başlıq"
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        error={errors.title}
      />
      <TextareaField
        label="Alt başlıq"
        rows={2}
        value={subtitle}
        onChange={(event) => setSubtitle(event.target.value)}
        error={errors.subtitle}
      />
      <ImageUploadField
        label="Şəkil"
        required
        value={imageUrl}
        onChange={setImageUrl}
        error={errors.imageUrl}
      />
      <TextField
        label="Keçid URL"
        value={linkUrl}
        onChange={(event) => setLinkUrl(event.target.value)}
        error={errors.linkUrl}
        placeholder="/products"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Mövqe"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          options={positionOptions}
          error={errors.position}
        />
        <TextField
          label="Sıralama"
          type="number"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          error={errors.sortOrder}
        />
      </div>
      <ToggleField
        label="Aktiv"
        description="Saytda göstərilsin"
        checked={isActive}
        onChange={setIsActive}
      />
      <FormActions
        loading={pending}
        cancelHref="/admin/banners"
        submitLabel={isEdit ? "Yenilə" : "Əlavə et"}
      />
    </form>
  );
}

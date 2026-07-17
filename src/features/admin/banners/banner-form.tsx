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
  const [badgeText, setBadgeText] = useState(
    banner?.badgeText ?? "Premium kompüter avadanlıqları",
  );
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(banner?.linkUrl ?? "");
  const [position, setPosition] = useState<string>(banner?.position ?? "HERO");
  const [sortOrder, setSortOrder] = useState(String(banner?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [showBadge, setShowBadge] = useState(banner?.showBadge ?? true);
  const [showTitle, setShowTitle] = useState(banner?.showTitle ?? true);
  const [showSubtitle, setShowSubtitle] = useState(
    banner?.showSubtitle ?? true,
  );
  const [showPrimaryButton, setShowPrimaryButton] = useState(
    banner?.showPrimaryButton ?? true,
  );
  const [showSecondaryButton, setShowSecondaryButton] = useState(
    banner?.showSecondaryButton ?? true,
  );
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
        badgeText,
        imageUrl,
        linkUrl,
        position,
        sortOrder,
        isActive,
        showBadge,
        showTitle,
        showSubtitle,
        showPrimaryButton,
        showSecondaryButton,
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
      {position === "HERO" ? (
        <TextField
          label="Badge mətni"
          value={badgeText}
          onChange={(event) => setBadgeText(event.target.value)}
          error={errors.badgeText}
          placeholder="Premium kompüter avadanlıqları"
        />
      ) : null}
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
      {position === "HERO" ? (
        <section className="space-y-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Hero məzmununun görünüşü
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Hər elementi saytda ayrıca göstərib-gizlədə bilərsiniz.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ToggleField
              label="Badge"
              description="Üstdəki kiçik yazı"
              checked={showBadge}
              onChange={setShowBadge}
            />
            <ToggleField
              label="Başlıq"
              description="Bannerin əsas başlığı"
              checked={showTitle}
              onChange={setShowTitle}
            />
            <ToggleField
              label="Alt mətn"
              description="Başlığın altındakı açıqlama"
              checked={showSubtitle}
              onChange={setShowSubtitle}
            />
            <ToggleField
              label="Əsas düymə"
              description="Bütün məhsullar düyməsi"
              checked={showPrimaryButton}
              onChange={setShowPrimaryButton}
            />
            <ToggleField
              label="İkinci düymə"
              description="Kateqoriyalara bax düyməsi"
              checked={showSecondaryButton}
              onChange={setShowSecondaryButton}
            />
          </div>
        </section>
      ) : null}
      <FormActions
        loading={pending}
        cancelHref="/admin/banners"
        submitLabel={isEdit ? "Yenilə" : "Əlavə et"}
      />
    </form>
  );
}

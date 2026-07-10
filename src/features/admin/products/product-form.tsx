"use client";

import Image from "next/image";
import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Star, Trash2 } from "lucide-react";
import { useToast } from "@/shared/components";
import { productStatusLabels } from "@/shared/constants/labels";
import { slugify } from "@/shared/utils/slugify";
import {
  FormActions,
  SelectField,
  TextField,
  TextareaField,
  ToggleField,
  inputClass,
} from "@/features/admin/form-ui";
import {
  createProductAction,
  updateProductAction,
} from "@/features/admin/products/product-actions";
import {
  MultiUploadButton,
  UploadButton,
} from "@/features/admin/image-upload-field";
import type { AdminProductDetail } from "@/shared/services/products/product.service";
import type { CategoryOption } from "@/shared/services/categories/category.service";
import type { BrandOption } from "@/shared/services/brands/brand.service";

type ImageRow = { imageUrl: string; altText: string; isMain: boolean };
type SpecRow = { key: string; value: string };

const statusOptions = (
  Object.keys(productStatusLabels) as (keyof typeof productStatusLabels)[]
).map((key) => ({ value: key, label: productStatusLabels[key] }));

export function ProductForm({
  product,
  categoryOptions,
  brandOptions,
}: {
  product?: AdminProductDetail;
  categoryOptions: CategoryOption[];
  brandOptions: BrandOption[];
}) {
  const isEdit = Boolean(product);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [sku, setSku] = useState(product?.sku ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [oldPrice, setOldPrice] = useState(product?.oldPrice ?? "");
  const [stock, setStock] = useState(String(product?.stock ?? 0));
  const [status, setStatus] = useState<string>(product?.status ?? "ACTIVE");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [brandId, setBrandId] = useState(product?.brandId ?? "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [images, setImages] = useState<ImageRow[]>(
    product?.images.length
      ? product.images.map((image) => ({
          imageUrl: image.imageUrl,
          altText: image.altText,
          isMain: image.isMain,
        }))
      : [{ imageUrl: "", altText: "", isMain: true }],
  );
  const [specs, setSpecs] = useState<SpecRow[]>(
    product?.specifications.length
      ? product.specifications.map((spec) => ({
          key: spec.key,
          value: spec.value,
        }))
      : [{ key: "", value: "" }],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const setMainImage = (index: number) =>
    setImages((prev) =>
      prev.map((image, i) => ({ ...image, isMain: i === index })),
    );
  const updateImage = (index: number, patch: Partial<ImageRow>) =>
    setImages((prev) =>
      prev.map((image, i) => (i === index ? { ...image, ...patch } : image)),
    );
  const addImage = () =>
    setImages((prev) => [
      ...prev,
      { imageUrl: "", altText: "", isMain: prev.length === 0 },
    ]);
  const addImages = (urls: string[]) =>
    setImages((prev) => {
      const existing = prev.filter((image) => image.imageUrl.trim());
      const added = urls.map((url) => ({
        imageUrl: url,
        altText: "",
        isMain: false,
      }));
      const merged = [...existing, ...added];
      if (merged.length > 0 && !merged.some((image) => image.isMain)) {
        merged[0].isMain = true;
      }
      return merged.length > 0 ? merged : prev;
    });
  const removeImage = (index: number) =>
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((image) => image.isMain)) {
        next[0].isMain = true;
      }
      return next;
    });

  const updateSpec = (index: number, patch: Partial<SpecRow>) =>
    setSpecs((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, ...patch } : spec)),
    );
  const addSpec = () => setSpecs((prev) => [...prev, { key: "", value: "" }]);
  const removeSpec = (index: number) =>
    setSpecs((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    const cleanImages = images.filter((image) => image.imageUrl.trim());
    const cleanSpecs = specs.filter(
      (spec) => spec.key.trim() && spec.value.trim(),
    );

    startTransition(async () => {
      const input = {
        name,
        slug,
        sku,
        description,
        price,
        oldPrice: oldPrice || null,
        stock,
        status,
        isFeatured,
        isNew,
        categoryId,
        brandId: brandId || null,
        images: cleanImages.map((image, index) => ({
          imageUrl: image.imageUrl.trim(),
          altText: image.altText,
          isMain: image.isMain,
          sortOrder: index,
        })),
        specifications: cleanSpecs.map((spec, index) => ({
          key: spec.key.trim(),
          value: spec.value.trim(),
          sortOrder: index,
        })),
      };
      const result = product
        ? await updateProductAction(product.id, input)
        : await createProductAction(input);
      if (result.ok) {
        toast(result.message, "success");
        router.push("/admin/products");
        router.refresh();
      } else {
        setErrors(result.fieldErrors ?? {});
        toast(result.message, "error");
      }
    });
  };

  const imagesError = Object.keys(errors).find((key) =>
    key.startsWith("images"),
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-5">
      {/* Basics */}
      <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900">Əsas məlumatlar</h2>
        <TextField
          label="Məhsulun adı"
          required
          value={name}
          onChange={(event) => handleName(event.target.value)}
          error={errors.name}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Slug"
            required
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            error={errors.slug}
          />
          <TextField
            label="SKU"
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            error={errors.sku}
          />
        </div>
        <TextareaField
          label="Təsvir"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          error={errors.description}
        />
      </section>

      {/* Pricing & stock */}
      <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900">Qiymət və stok</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            label="Qiymət (₼)"
            required
            type="number"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            error={errors.price}
          />
          <TextField
            label="Köhnə qiymət (₼)"
            type="number"
            step="0.01"
            value={oldPrice}
            onChange={(event) => setOldPrice(event.target.value)}
            error={errors.oldPrice}
          />
          <TextField
            label="Stok"
            type="number"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            error={errors.stock}
          />
        </div>
      </section>

      {/* Classification */}
      <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900">Təsnifat</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField
            label="Kateqoriya"
            required
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            placeholder="Seçin"
            options={categoryOptions.map((option) => ({
              value: option.id,
              label: option.name,
            }))}
            error={errors.categoryId}
          />
          <SelectField
            label="Brend"
            value={brandId}
            onChange={(event) => setBrandId(event.target.value)}
            placeholder="Brendsiz"
            options={brandOptions.map((option) => ({
              value: option.id,
              label: option.name,
            }))}
            error={errors.brandId}
          />
          <SelectField
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={statusOptions}
            error={errors.status}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ToggleField
            label="Seçilmiş"
            description="Ana səhifədə göstərilsin"
            checked={isFeatured}
            onChange={setIsFeatured}
          />
          <ToggleField
            label="Yeni"
            description="Yeni məhsul kimi işarələ"
            checked={isNew}
            onChange={setIsNew}
          />
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-gray-900">Şəkillər</h2>
          <div className="flex items-center gap-2">
            <MultiUploadButton onUploaded={addImages} />
            <button
              type="button"
              onClick={addImage}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              <Plus className="h-4 w-4" />
              URL əlavə et
            </button>
          </div>
        </div>
        {imagesError ? (
          <p className="text-xs font-medium text-rose-600">
            Ən azı bir düzgün şəkil URL-i əlavə edin.
          </p>
        ) : null}
        <div className="space-y-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3 sm:flex-row sm:items-center"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                {image.imageUrl ? (
                  <Image
                    alt=""
                    src={image.imageUrl}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                ) : null}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    placeholder="Şəkil URL və ya yükləyin"
                    value={image.imageUrl}
                    onChange={(event) =>
                      updateImage(index, { imageUrl: event.target.value })
                    }
                  />
                  <UploadButton
                    onUploaded={(url) => updateImage(index, { imageUrl: url })}
                  />
                </div>
                <input
                  className={inputClass}
                  placeholder="Alt mətn (könüllü)"
                  value={image.altText}
                  onChange={(event) =>
                    updateImage(index, { altText: event.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMainImage(index)}
                  aria-label="Əsas şəkil"
                  className={
                    image.isMain
                      ? "inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white"
                      : "inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-brand-300"
                  }
                >
                  <Star className="h-3.5 w-3.5" />
                  Əsas
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="Sil"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specifications */}
      <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Xüsusiyyətlər</h2>
          <button
            type="button"
            onClick={addSpec}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            <Plus className="h-4 w-4" />
            Sətir əlavə et
          </button>
        </div>
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                className={inputClass}
                placeholder="Xüsusiyyət (məs: Tutum)"
                value={spec.key}
                onChange={(event) =>
                  updateSpec(index, { key: event.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Dəyər (məs: 1TB)"
                value={spec.value}
                onChange={(event) =>
                  updateSpec(index, { value: event.target.value })
                }
              />
              <button
                type="button"
                onClick={() => removeSpec(index)}
                aria-label="Sil"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:text-rose-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <FormActions
        loading={pending}
        cancelHref="/admin/products"
        submitLabel={isEdit ? "Yenilə" : "Əlavə et"}
      />
    </form>
  );
}

"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components";
import { slugify } from "@/shared/utils/slugify";
import {
  FormActions,
  SelectField,
  TextField,
  TextareaField,
  ToggleField,
} from "@/features/admin/form-ui";
import { ImageUploadField } from "@/features/admin/image-upload-field";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/features/admin/categories/category-actions";
import type {
  AdminCategoryRow,
  CategoryOption,
} from "@/shared/services/categories/category.service";

export function CategoryForm({
  category,
  parentOptions,
}: {
  category?: AdminCategoryRow;
  parentOptions: CategoryOption[];
}) {
  const isEdit = Boolean(category);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(category?.description ?? "");
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [parentId, setParentId] = useState(category?.parentId ?? "");
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
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
      const input = {
        name,
        slug,
        description,
        imageUrl,
        parentId: parentId || null,
        sortOrder,
        isActive,
      };
      const result = category
        ? await updateCategoryAction(category.id, input)
        : await createCategoryAction(input);
      if (result.ok) {
        toast(result.message, "success");
        router.push("/admin/categories");
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
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Ad"
          required
          value={name}
          onChange={(event) => handleName(event.target.value)}
          error={errors.name}
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
        />
      </div>
      <TextareaField
        label="Təsvir"
        rows={3}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        error={errors.description}
      />
      <ImageUploadField
        label="Şəkil"
        value={imageUrl}
        onChange={setImageUrl}
        error={errors.imageUrl}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Ana kateqoriya"
          value={parentId}
          onChange={(event) => setParentId(event.target.value)}
          placeholder="Yoxdur"
          options={parentOptions.map((option) => ({
            value: option.id,
            label: option.name,
          }))}
          error={errors.parentId}
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
        description="Mağazada göstərilsin"
        checked={isActive}
        onChange={setIsActive}
      />
      <FormActions
        loading={pending}
        cancelHref="/admin/categories"
        submitLabel={isEdit ? "Yenilə" : "Əlavə et"}
      />
    </form>
  );
}

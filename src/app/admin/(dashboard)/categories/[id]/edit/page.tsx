import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { CategoryForm } from "@/features/admin/categories/category-form";
import {
  getAdminCategoryById,
  getCategoryOptions,
} from "@/shared/services/categories/category.service";

export const metadata: Metadata = { title: "Kateqoriyanı redaktə et" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, allOptions] = await Promise.all([
    getAdminCategoryById(id),
    getCategoryOptions(),
  ]);
  if (!category) notFound();

  const parentOptions = allOptions.filter((option) => option.id !== id);

  return (
    <div>
      <AdminPageHeader
        title="Kateqoriyanı redaktə et"
        description={category.name}
      />
      <CategoryForm category={category} parentOptions={parentOptions} />
    </div>
  );
}

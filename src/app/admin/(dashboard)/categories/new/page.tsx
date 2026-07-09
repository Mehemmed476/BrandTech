import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { CategoryForm } from "@/features/admin/categories/category-form";
import { getCategoryOptions } from "@/shared/services/categories/category.service";

export const metadata: Metadata = { title: "Yeni kateqoriya" };

export default async function Page() {
  const parentOptions = await getCategoryOptions();
  return (
    <div>
      <AdminPageHeader
        title="Yeni kateqoriya"
        description="Mağaza üçün kateqoriya əlavə edin."
      />
      <CategoryForm parentOptions={parentOptions} />
    </div>
  );
}

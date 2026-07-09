import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { ProductForm } from "@/features/admin/products/product-form";
import { getCategoryOptions } from "@/shared/services/categories/category.service";
import { getBrandOptions } from "@/shared/services/brands/brand.service";

export const metadata: Metadata = { title: "Yeni məhsul" };

export default async function Page() {
  const [categoryOptions, brandOptions] = await Promise.all([
    getCategoryOptions(),
    getBrandOptions(),
  ]);
  return (
    <div>
      <AdminPageHeader
        title="Yeni məhsul"
        description="Kataloqa yeni məhsul əlavə edin."
      />
      <ProductForm
        categoryOptions={categoryOptions}
        brandOptions={brandOptions}
      />
    </div>
  );
}

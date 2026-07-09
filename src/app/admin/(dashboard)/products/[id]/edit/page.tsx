import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { ProductForm } from "@/features/admin/products/product-form";
import { getAdminProductById } from "@/shared/services/products/product.service";
import { getCategoryOptions } from "@/shared/services/categories/category.service";
import { getBrandOptions } from "@/shared/services/brands/brand.service";

export const metadata: Metadata = { title: "Məhsulu redaktə et" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categoryOptions, brandOptions] = await Promise.all([
    getAdminProductById(id),
    getCategoryOptions(),
    getBrandOptions(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader title="Məhsulu redaktə et" description={product.name} />
      <ProductForm
        product={product}
        categoryOptions={categoryOptions}
        brandOptions={brandOptions}
      />
    </div>
  );
}

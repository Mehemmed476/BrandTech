import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { BrandForm } from "@/features/admin/brands/brand-form";
import { getAdminBrandById } from "@/shared/services/brands/brand.service";

export const metadata: Metadata = { title: "Brendi redaktə et" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getAdminBrandById(id);
  if (!brand) notFound();

  return (
    <div>
      <AdminPageHeader title="Brendi redaktə et" description={brand.name} />
      <BrandForm brand={brand} />
    </div>
  );
}

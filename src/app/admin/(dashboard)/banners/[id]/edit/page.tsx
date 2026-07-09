import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { BannerForm } from "@/features/admin/banners/banner-form";
import { getAdminBannerById } from "@/shared/services/banners/banner.service";

export const metadata: Metadata = { title: "Banneri redaktə et" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await getAdminBannerById(id);
  if (!banner) notFound();

  return (
    <div>
      <AdminPageHeader title="Banneri redaktə et" description={banner.title} />
      <BannerForm banner={banner} />
    </div>
  );
}

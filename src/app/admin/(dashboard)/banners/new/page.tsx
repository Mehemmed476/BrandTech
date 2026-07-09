import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { BannerForm } from "@/features/admin/banners/banner-form";

export const metadata: Metadata = { title: "Yeni banner" };

export default function Page() {
  return (
    <div>
      <AdminPageHeader
        title="Yeni banner"
        description="Ana səhifə üçün banner əlavə edin."
      />
      <BannerForm />
    </div>
  );
}

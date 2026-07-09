import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { BrandForm } from "@/features/admin/brands/brand-form";

export const metadata: Metadata = { title: "Yeni brend" };

export default function Page() {
  return (
    <div>
      <AdminPageHeader
        title="Yeni brend"
        description="Kataloq üçün brend əlavə edin."
      />
      <BrandForm />
    </div>
  );
}

import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { AdminUserForm } from "@/features/admin/users/user-form";

export const metadata: Metadata = { title: "Yeni admin" };

export default function Page() {
  return (
    <div>
      <AdminPageHeader
        title="Yeni admin yarat"
        description="Admin panelə giriş edə biləcək yeni hesab yaradın."
      />
      <AdminUserForm />
    </div>
  );
}

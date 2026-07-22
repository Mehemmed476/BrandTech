import type { Metadata } from "next";
import { AdminUsersPage } from "@/features/admin/users/user-list";

export const metadata: Metadata = { title: "Admin istifadəçiləri" };

export default function Page() {
  return <AdminUsersPage />;
}

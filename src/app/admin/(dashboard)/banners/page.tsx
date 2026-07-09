import type { Metadata } from "next";
import { AdminBannersPage } from "@/features/admin/banners/banner-list";

export const metadata: Metadata = { title: "Bannerlər" };

export default function Page() {
  return <AdminBannersPage />;
}

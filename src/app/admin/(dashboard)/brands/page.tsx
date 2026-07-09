import type { Metadata } from "next";
import { AdminBrandsPage } from "@/features/admin/brands/brand-list";

export const metadata: Metadata = { title: "Brendlər" };

export default function Page() {
  return <AdminBrandsPage />;
}

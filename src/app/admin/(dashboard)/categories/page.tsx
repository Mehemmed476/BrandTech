import type { Metadata } from "next";
import { AdminCategoriesPage } from "@/features/admin/categories/category-list";

export const metadata: Metadata = { title: "Kateqoriyalar" };

export default function Page() {
  return <AdminCategoriesPage />;
}

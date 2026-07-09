import type { Metadata } from "next";
import { CategoryListPage } from "@/features/categories/category-list-page";

export const metadata: Metadata = {
  title: "Kateqoriyalar",
};

export default function Page() {
  return <CategoryListPage />;
}

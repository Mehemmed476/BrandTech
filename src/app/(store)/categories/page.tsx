import type { Metadata } from "next";
import { CategoryListPage } from "@/features/categories/category-list-page";

const description =
  "Kompüter komponentləri, periferiya, şəbəkə avadanlığı və hazır sistemlər — Brand Technology kateqoriyaları üzrə alış-veriş edin.";

export const metadata: Metadata = {
  title: "Kateqoriyalar",
  description,
  alternates: { canonical: "/categories" },
  openGraph: {
    type: "website",
    url: "/categories",
    title: "Kateqoriyalar",
    description,
  },
};

export default function Page() {
  return <CategoryListPage />;
}

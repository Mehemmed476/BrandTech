import type { Metadata } from "next";
import {
  ProductListPage,
  type CatalogSearchParams,
} from "@/features/products/product-list-page";

const description =
  "SSD, RAM, GPU, CPU, monitor, noutbuk və gaming aksesuarları — Brand Technology kataloqu. Brend, qiymət və vəziyyətə görə filtrlə, sürətlə sifariş ver.";

export const metadata: Metadata = {
  title: "Bütün məhsullar",
  description,
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    url: "/products",
    title: "Bütün məhsullar",
    description,
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  return <ProductListPage searchParams={params} />;
}

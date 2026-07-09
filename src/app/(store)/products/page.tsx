import type { Metadata } from "next";
import {
  ProductListPage,
  type CatalogSearchParams,
} from "@/features/products/product-list-page";

export const metadata: Metadata = {
  title: "Məhsullar",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  return <ProductListPage searchParams={params} />;
}

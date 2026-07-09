import type { Metadata } from "next";
import {
  AdminProductsPage,
  type ProductSearchParams,
} from "@/features/admin/products/product-list";

export const metadata: Metadata = { title: "Məhsullar" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<ProductSearchParams>;
}) {
  const params = await searchParams;
  return <AdminProductsPage searchParams={params} />;
}

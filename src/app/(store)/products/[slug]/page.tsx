import type { Metadata } from "next";
import { ProductDetailPage } from "@/features/products/product-detail-page";
import { getStoreProductBySlug } from "@/shared/services/products/product.service";
import { safeQuery } from "@/shared/lib/safe-query";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await safeQuery(() => getStoreProductBySlug(slug), null);
  return {
    title: product ? product.name : "Məhsul",
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}

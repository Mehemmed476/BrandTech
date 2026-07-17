import type { Metadata } from "next";
import { ProductDetailPage } from "@/features/products/product-detail-page";
import { getStoreProductBySlug } from "@/shared/services/products/product.service";
import { safeQuery } from "@/shared/lib/safe-query";
import { absoluteUrl } from "@/shared/config/site";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await safeQuery(() => getStoreProductBySlug(slug), null);

  if (!product) {
    return {
      title: "Məhsul tapılmadı",
      robots: { index: false, follow: true },
    };
  }

  const url = `/products/${product.slug}`;
  const description = (
    product.description ||
    `${product.name} — ${product.brand.name}. ${product.category.name} kateqoriyası. Brand Technology-də orijinal məhsul, rəsmi zəmanət və sürətli çatdırılma.`
  ).slice(0, 200);
  const image = product.images[0] ? absoluteUrl(product.images[0]) : undefined;

  return {
    title: product.name,
    description,
    keywords: [
      product.name,
      product.brand.name,
      product.category.name,
      "Brand Technology",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: product.name,
      description,
      images: image ? [{ url: image, width: 1000, height: 1000 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}

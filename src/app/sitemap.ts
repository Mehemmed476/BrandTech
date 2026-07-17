import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";
import { safeQuery } from "@/shared/lib/safe-query";
import { getProductSitemapData } from "@/shared/services/products/product.service";
import { getCategorySitemapData } from "@/shared/services/categories/category.service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const [products, categories] = await Promise.all([
    safeQuery(getProductSitemapData, []),
    safeQuery(getCategorySitemapData, []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categories`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/products?category=${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}

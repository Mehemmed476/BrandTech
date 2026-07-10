import Link from "next/link";
import { ChevronLeft, ChevronRight, PackageSearch, Tag } from "lucide-react";
import { Breadcrumb, EmptyState, ProductCard } from "@/shared/components";
import {
  CatalogActiveFilters,
  CatalogChips,
  CatalogFilters,
  CatalogSearch,
  CatalogSort,
  CatalogViewToggle,
} from "@/features/products/store-catalog-controls";
import { safeQuery } from "@/shared/lib/safe-query";
import { emptyPage } from "@/shared/types/pagination";
import { getStoreProducts } from "@/shared/services/products/product.service";
import { getActiveCategories } from "@/shared/services/categories/category.service";
import { getActiveBrands } from "@/shared/services/brands/brand.service";

export type CatalogSearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  min?: string;
  max?: string;
  instock?: string;
  sale?: string;
  new?: string;
  featured?: string;
  view?: string;
  page?: string;
};

function buildHref(params: CatalogSearchParams, page: number) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.brand) search.set("brand", params.brand);
  if (params.sort) search.set("sort", params.sort);
  if (params.min) search.set("min", params.min);
  if (params.max) search.set("max", params.max);
  if (params.instock) search.set("instock", params.instock);
  if (params.sale) search.set("sale", params.sale);
  if (params.new) search.set("new", params.new);
  if (params.featured) search.set("featured", params.featured);
  if (params.view) search.set("view", params.view);
  search.set("page", String(page));
  return `/products?${search.toString()}`;
}

export async function ProductListPage({
  searchParams,
}: {
  searchParams: CatalogSearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const [products, categories, brands] = await Promise.all([
    safeQuery(
      () =>
        getStoreProducts({
          q: searchParams.q,
          category: searchParams.category,
          brands: searchParams.brand
            ? searchParams.brand.split(",").filter(Boolean)
            : undefined,
          minPrice: searchParams.min ? Number(searchParams.min) : undefined,
          maxPrice: searchParams.max ? Number(searchParams.max) : undefined,
          inStock: searchParams.instock === "1",
          isNew: searchParams.new === "1",
          isFeatured: searchParams.featured === "1",
          onSale: searchParams.sale === "1",
          sort:
            (searchParams.sort as
              "featured" | "newest" | "price-asc" | "price-desc" | "name") ||
            undefined,
          page,
        }),
      emptyPage(),
    ),
    safeQuery(getActiveCategories, []),
    safeQuery(getActiveBrands, []),
  ]);

  const view = searchParams.view === "comfortable" ? "comfortable" : "compact";
  const gridClass =
    view === "compact"
      ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      : "grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <main className="container-page py-6">
      <Breadcrumb items={[{ label: "Məhsullar" }]} />

      <div className="mesh-brand relative overflow-hidden rounded-3xl border border-gray-100 p-6 shadow-soft sm:p-8">
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700 ring-1 ring-inset ring-brand-100">
            <Tag className="h-3.5 w-3.5" />
            Kataloq
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
            Bütün məhsullar
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
            Yeniləmələr, gaming yığımları və ofis setapları üçün kompüter
            hissələri və aksesuarları.
          </p>
          <CatalogSearch />
        </div>
      </div>

      <CatalogChips categories={categories} />

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-gray-900">{products.total}</span>{" "}
          məhsul
        </p>
        <div className="flex items-center gap-2">
          <CatalogSort />
          <CatalogViewToggle />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[264px_1fr]">
        <CatalogFilters brands={brands} />

        <div>
          <CatalogActiveFilters categories={categories} brands={brands} />

          {products.items.length === 0 ? (
            <EmptyState
              icon={<PackageSearch className="h-8 w-8" />}
              title="Məhsul tapılmadı"
              description="Filtri dəyişin və ya başqa açar söz axtarın."
            />
          ) : (
            <>
              <div className={gridClass}>
                {products.items.map((product) => (
                  <ProductCard
                    product={product}
                    variant={view}
                    key={product.id}
                  />
                ))}
              </div>

              {products.totalPages > 1 ? (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {page > 1 ? (
                    <Link
                      href={buildHref(searchParams, page - 1)}
                      className="inline-flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-brand-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Əvvəlki
                    </Link>
                  ) : null}
                  <span className="px-2 text-sm text-gray-500">
                    {page} / {products.totalPages}
                  </span>
                  {page < products.totalPages ? (
                    <Link
                      href={buildHref(searchParams, page + 1)}
                      className="inline-flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-brand-300"
                    >
                      Növbəti
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

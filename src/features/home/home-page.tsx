import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import {
  CategoryIcon,
  ProductCard,
  SectionHeader,
} from "@/shared/components";
import { HeroSlider } from "@/features/home/hero-slider";
import { safeQuery } from "@/shared/lib/safe-query";
import { formatPrice } from "@/shared/utils/format-price";
import { getActiveBanners } from "@/shared/services/banners/banner.service";
import { getActiveCategories } from "@/shared/services/categories/category.service";
import { getActiveBrands } from "@/shared/services/brands/brand.service";
import {
  getFeaturedProducts,
  getNewProducts,
} from "@/shared/services/products/product.service";

export async function HomePage() {
  const [banners, categories, featured, newProducts, brands] =
    await Promise.all([
      safeQuery(getActiveBanners, []),
      safeQuery(getActiveCategories, []),
      safeQuery(() => getFeaturedProducts(6), []),
      safeQuery(() => getNewProducts(8), []),
      safeQuery(getActiveBrands, []),
    ]);

  const heroBanners = banners.filter((banner) => banner.position === "HERO");
  const heroSlides =
    heroBanners.length > 0
      ? heroBanners
      : [
          {
            id: "fallback-hero",
            title: "Etibarlı PK, hər gün işləyən.",
            subtitle:
              "SSD, RAM, GPU, CPU və gaming avadanlığı — rəsmi zəmanət və Bakı üzrə sürətli çatdırılma ilə.",
            badgeText: "Premium kompüter avadanlıqları",
            imageUrl:
              "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=80",
            linkUrl: "/products",
            position: "HERO" as const,
            showBadge: true,
            showTitle: true,
            showSubtitle: true,
            showPrimaryButton: true,
            showSecondaryButton: true,
          },
        ];
  const newGrid = newProducts.slice(0, 4);
  const collections = featured.slice(0, 3);

  return (
    <main className="pb-4">
      {/* Hero */}
      <section className="container-page pt-6 lg:pt-8">
        <div className="grid gap-4 lg:grid-cols-[264px_1fr]">
          {/* Category sidebar (desktop) */}
          <aside className="hidden rounded-3xl border border-gray-100 bg-white p-2 shadow-soft lg:flex lg:h-[440px] lg:flex-col">
            <p className="shrink-0 px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
              Kateqoriyalar
            </p>
            <nav className="scrollbar-slim min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  <CategoryIcon
                    slug={category.slug}
                    className="h-4.5 w-4.5 shrink-0 text-brand-600"
                  />
                  <span className="truncate">{category.name}</span>
                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
                </Link>
              ))}
            </nav>
            <Link
              href="/categories"
              className="mt-2 flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              Bütün kateqoriyalar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>

          {/* Hero slider */}
          <HeroSlider slides={heroSlides} />
        </div>

        {/* Category chips (mobile) */}
        {categories.length > 0 ? (
          <div className="no-scrollbar mt-4 flex gap-2.5 overflow-x-auto pb-1 lg:hidden">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-soft transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                <CategoryIcon
                  slug={category.slug}
                  className="h-4 w-4 text-brand-600"
                />
                {category.name}
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      {/* Collections */}
      {collections.length === 3 ? (
        <section className="container-page pt-14">
          <SectionHeader
            eyebrow="Kolleksiyalar"
            title="Komponentə görə al"
            description="Performansa ən çox təsir edən əsas hissələr."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {collections.map((product, index) => {
              const accent = [
                "from-brand-600 to-brand-800",
                "from-emerald-600 to-brand-800",
                "from-teal-700 to-brand-800",
              ][index];
              return (
                <Link
                  key={product.id}
                  href={`/products?category=${product.category.slug}`}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${accent} p-6 text-white shadow-card transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="grid-texture pointer-events-none absolute inset-0 opacity-30" />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                        {product.category.name}
                      </span>
                      <h3 className="mt-4 text-xl font-black">
                        {product.brand.name}
                      </h3>
                      <p className="mt-1 max-w-[15rem] text-sm text-white/75 line-clamp-2">
                        {product.name}
                      </p>
                    </div>
                    <div className="relative h-24 w-24 shrink-0 rounded-2xl bg-white/10 p-2 ring-1 ring-inset ring-white/15">
                      <Image
                        alt=""
                        src={product.images[0]}
                        fill
                        sizes="120px"
                        className="object-contain p-1 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="relative mt-6 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/85">
                      {formatPrice(product.price)} -dən
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold">
                      İndi al
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* New arrivals */}
      {newGrid.length > 0 ? (
        <section className="container-page pt-14">
          <SectionHeader
            eyebrow="Yeni gələnlər"
            title="Yeni məhsullar"
            description="Mağazaya əlavə olunan ən son komponentlər və avadanlıq."
            actionHref="/products"
            actionLabel="Daha çox"
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {newGrid.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Brand marquee */}
      {brands.length > 0 ? (
        <section className="container-page pt-14">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white py-7 shadow-soft">
            <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Təchiz etdiyimiz brendlər
            </p>
            <div className="marquee-mask overflow-hidden">
              <div className="marquee-track gap-4">
                {[...brands, ...brands].map((brand, index) => (
                  <span
                    key={`${brand.id}-${index}`}
                    className="flex h-14 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 px-8 text-lg font-black tracking-tight text-gray-500"
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

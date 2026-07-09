import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  CreditCard,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import {
  ButtonLink,
  CategoryCard,
  CategoryIcon,
  ProductCard,
  SectionHeader,
} from "@/shared/components";
import { safeQuery } from "@/shared/lib/safe-query";
import { formatPrice } from "@/shared/utils/format-price";
import { emptyPage } from "@/shared/types/pagination";
import { getActiveBanners } from "@/shared/services/banners/banner.service";
import { getActiveCategories } from "@/shared/services/categories/category.service";
import { getActiveBrands } from "@/shared/services/brands/brand.service";
import {
  getFeaturedProducts,
  getNewProducts,
  getStoreProducts,
} from "@/shared/services/products/product.service";

const benefits = [
  {
    title: "Orijinal məhsullar",
    description: "Yalnız etibarlı brendlərdən yoxlanılmış avadanlıq.",
    icon: BadgeCheck,
  },
  {
    title: "Rəsmi zəmanət",
    description: "Hər komponentə aydın zəmanət dəstəyi.",
    icon: ShieldCheck,
  },
  {
    title: "Sürətli çatdırılma",
    description: "Bakı üzrə eyni gün göndərmə və sürətli çatdırılma.",
    icon: Truck,
  },
  {
    title: "Canlı dəstək",
    description: "Əsl PK ustaları ilə danışın.",
    icon: Headphones,
  },
];

export async function HomePage() {
  const [banners, categories, featured, newProducts, brands, popular] =
    await Promise.all([
      safeQuery(getActiveBanners, []),
      safeQuery(getActiveCategories, []),
      safeQuery(() => getFeaturedProducts(8), []),
      safeQuery(() => getNewProducts(8), []),
      safeQuery(getActiveBrands, []),
      safeQuery(() => getStoreProducts({ pageSize: 8 }), emptyPage()),
    ]);

  const heroBanner = banners.find((banner) => banner.position === "HERO");
  const heroProduct = featured[0] ?? popular.items[0] ?? null;
  const featuredGrid = featured.slice(0, 4);
  const newGrid = newProducts.slice(0, 4);
  const bestSellers = popular.items.slice(0, 4);
  const collections = featured.slice(0, 3);

  const heroStats = [
    { value: `${popular.total}+`, label: "Məhsul" },
    { value: `${categories.length}+`, label: "Kateqoriya" },
    { value: `${brands.length}+`, label: "Brend" },
  ];

  return (
    <main className="pb-4">
      {/* Hero bento */}
      <section className="container-page pt-6 lg:pt-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="mesh-dark relative flex flex-col justify-between overflow-hidden rounded-3xl p-7 text-white shadow-card lg:col-span-2 lg:p-10">
            <div className="grid-texture pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ring-white/15">
                <Sparkles className="h-3.5 w-3.5 text-leaf-400" />
                Premium kompüter avadanlıqları
              </span>
              <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.05] tracking-tight md:text-5xl">
                {heroBanner?.title ?? "Etibarlı PK, hər gün işləyən."}
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
                {heroBanner?.subtitle ??
                  "SSD, RAM, GPU, CPU və gaming avadanlığı — rəsmi zəmanət və Bakı üzrə sürətli çatdırılma ilə orijinal komponentlər."}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={heroBanner?.linkUrl ?? "/products"} size="lg">
                  Bütün məhsullar
                  <ArrowRight className="h-4.5 w-4.5" />
                </ButtonLink>
                <ButtonLink href="/categories" size="lg" variant="dark">
                  Kateqoriyalara bax
                </ButtonLink>
              </div>
            </div>
            <div className="relative mt-8 grid max-w-md grid-cols-3 gap-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/10 px-3 py-3 ring-1 ring-inset ring-white/10 backdrop-blur"
                >
                  <p className="text-2xl font-black text-leaf-400">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {heroProduct ? (
            <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                  <Zap className="h-3.5 w-3.5" />
                  Həftənin təklifi
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  {heroProduct.category.name}
                </span>
              </div>
              <div className="relative mx-auto my-4 aspect-square w-full max-w-[240px]">
                <Image
                  alt={heroProduct.name}
                  src={heroProduct.images[0]}
                  fill
                  priority
                  sizes="(min-width: 1024px) 300px, 80vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
                {heroProduct.brand.name}
              </p>
              <h2 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-gray-900">
                {heroProduct.name}
              </h2>
              <div className="mt-3 flex items-end justify-between">
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black tracking-tight text-gray-900">
                    {formatPrice(heroProduct.price)}
                  </span>
                  {heroProduct.oldPrice ? (
                    <span className="pb-1 text-sm text-gray-400 line-through">
                      {formatPrice(heroProduct.oldPrice)}
                    </span>
                  ) : null}
                </div>
                <ButtonLink
                  href={`/products/${heroProduct.slug}`}
                  size="sm"
                  className="rounded-full"
                >
                  Bax
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          ) : null}
        </div>

        {categories.length > 0 ? (
          <div className="no-scrollbar mt-4 flex gap-2.5 overflow-x-auto pb-1">
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

      {/* Popular categories */}
      {categories.length > 0 ? (
        <section className="container-page pt-14">
          <SectionHeader
            eyebrow="Kəşf et"
            title="Populyar kateqoriyalar"
            description="Növbəti yığımınız üçün lazım olan hissələrə birbaşa keçin."
            actionHref="/categories"
            actionLabel="Bütün kateqoriyalar"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard category={category} key={category.id} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Featured */}
      {featuredGrid.length > 0 ? (
        <section className="container-page pt-14">
          <SectionHeader
            eyebrow="Seçilmiş"
            title="Həftənin təklifləri"
            description="Əsl yığımlar üçün seçilmiş komponentlər və aksesuarlar."
            actionHref="/products"
            actionLabel="Hamısına bax"
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featuredGrid.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </section>
      ) : null}

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

      {/* Laptop promo */}
      <section className="container-page pt-14">
        <div className="relative grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card md:grid-cols-2">
          <div className="relative order-2 min-h-[240px] md:order-1 md:min-h-full">
            <Image
              alt=""
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent md:bg-gradient-to-r" />
          </div>
          <div className="order-1 flex flex-col justify-center p-8 md:order-2 md:p-12">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700 ring-1 ring-inset ring-brand-100">
              Noutbuk və aksesuarlar
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
              İşə hazır noutbuklar və masa avadanlığı
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500">
              Təhsil və ofis üçün portativ kompüterlər, üstəlik setapınızı
              tamamlayan klaviatura, siçan və qulaqlıqlar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/products?category=laptop">
                Noutbuklar
              </ButtonLink>
              <ButtonLink href="/products?category=mouse" variant="outline">
                Aksesuarlar
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      {bestSellers.length > 0 ? (
        <section className="container-page pt-14">
          <SectionHeader
            eyebrow="Populyar"
            title="Çox satılanlar"
            description="Müştərilərin hazırda yığımlarına əlavə etdikləri."
            actionHref="/products"
            actionLabel="Hamısına bax"
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {bestSellers.map((product) => (
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

      {/* Why choose us */}
      <section className="container-page pt-14">
        <SectionHeader
          eyebrow="Niyə Brand Technology"
          title="Əsl ustalar üçün mağaza"
          description="Avadanlığı əminliklə almaq üçün lazım olan hər şey."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-brand-50 to-white p-6 text-center shadow-soft sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-brand-600" />
            <p className="text-sm font-semibold text-gray-700">
              Ödəniş çatdırılma zamanı və ya mağazada — onlayn ödəniş tələb
              olunmur.
            </p>
          </div>
          <ButtonLink href="/products" variant="outline">
            Alışa başla
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

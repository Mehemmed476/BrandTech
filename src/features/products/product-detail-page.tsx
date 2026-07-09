import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ListChecks,
  ShieldCheck,
  Truck,
  Undo2,
  XCircle,
} from "lucide-react";
import { Breadcrumb, ProductCard, SectionHeader } from "@/shared/components";
import { AddToCartControls } from "@/features/products/add-to-cart-controls";
import { ProductGallery } from "@/features/products/product-gallery";
import { formatPrice } from "@/shared/utils/format-price";
import {
  getRelatedProducts,
  getStoreProductBySlug,
} from "@/shared/services/products/product.service";

const assurances = [
  { icon: ShieldCheck, label: "Rəsmi zəmanət" },
  { icon: Truck, label: "Sürətli çatdırılma" },
  { icon: Undo2, label: "Asan qaytarma" },
];

export async function ProductDetailPage({ slug }: { slug: string }) {
  const product = await getStoreProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const inStock = product.stock > 0 && product.status === "ACTIVE";
  const lowStock = inStock && product.stock <= 8;
  const previous = product.oldPrice ? Number(product.oldPrice) : null;
  const savings = previous ? previous - Number(product.price) : 0;
  const discount =
    previous && previous > 0 ? Math.round((savings / previous) * 100) : null;

  const relatedProducts = await getRelatedProducts(
    product.category.id,
    product.id,
    4,
  );

  return (
    <main className="container-page py-6">
      <Breadcrumb
        items={[
          { label: "Məhsullar", href: "/products" },
          {
            label: product.category.name,
            href: `/products?category=${product.category.slug}`,
          },
          { label: product.name },
        ]}
      />

      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700 ring-1 ring-inset ring-brand-100">
              {product.brand.name}
            </span>
            {product.isNew ? (
              <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Yeni
              </span>
            ) : null}
            {product.isFeatured ? (
              <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Seçilmiş
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-gray-900 md:text-[34px]">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {product.sku ? (
              <span>
                SKU:{" "}
                <span className="font-medium text-gray-700">{product.sku}</span>
              </span>
            ) : null}
            <span className="hidden text-gray-300 sm:inline">•</span>
            <span>
              Kateqoriya:{" "}
              <span className="font-medium text-gray-700">
                {product.category.name}
              </span>
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-4xl font-black tracking-tight text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice ? (
                <span className="pb-1.5 text-lg text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              ) : null}
              {discount ? (
                <span className="mb-1 inline-flex items-center rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
                  {discount}% endirim
                </span>
              ) : null}
            </div>
            {savings > 0 ? (
              <p className="mt-1.5 text-sm font-medium text-brand-700">
                {formatPrice(savings)} qənaət edirsiniz
              </p>
            ) : null}

            <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
              {inStock ? (
                <>
                  <CheckCircle2 className="h-4.5 w-4.5 text-brand-600" />
                  <span
                    className={lowStock ? "text-amber-600" : "text-brand-700"}
                  >
                    {lowStock
                      ? `Stokda son ${product.stock} ədəd`
                      : `Stokda var · ${product.stock} ədəd`}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4.5 w-4.5 text-gray-400" />
                  <span className="text-gray-500">Stokda yoxdur</span>
                </>
              )}
            </div>

            <div className="mt-5">
              <AddToCartControls
                disabled={!inStock}
                item={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  brand: product.brand.name,
                  image: product.images[0],
                  price: Number(product.price),
                  stock: product.stock,
                }}
              />
            </div>
          </div>

          {product.description ? (
            <p className="mt-5 leading-relaxed text-gray-600">
              {product.description}
            </p>
          ) : null}

          <div className="mt-6 grid grid-cols-3 gap-3">
            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-2 py-4 text-center shadow-soft"
                >
                  <Icon className="h-5 w-5 text-brand-600" />
                  <span className="text-xs font-semibold text-gray-600">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {product.specifications.length > 0 ? (
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Texniki xüsusiyyətlər
              </h2>
            </div>
            <dl className="overflow-hidden rounded-2xl border border-gray-100">
              {product.specifications.map((spec, index) => (
                <div
                  key={`${spec.key}-${index}`}
                  className={`flex items-center justify-between gap-4 px-4 py-3.5 text-sm ${
                    index % 2 === 0 ? "bg-gray-50/70" : "bg-white"
                  }`}
                >
                  <dt className="font-medium text-gray-500">{spec.key}</dt>
                  <dd className="text-right font-semibold text-gray-900">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold text-gray-900">Məhsul haqqında</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              {product.description ||
                "Bu məhsul üçün təsvir tezliklə əlavə olunacaq."}
            </p>
            <ul className="mt-5 space-y-2.5">
              {product.specifications.slice(0, 4).map((spec, index) => (
                <li
                  key={`${spec.key}-${index}`}
                  className="flex items-start gap-2.5 text-sm text-gray-600"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  <span>
                    <span className="font-semibold text-gray-800">
                      {spec.key}:
                    </span>{" "}
                    {spec.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {relatedProducts.length > 0 ? (
        <section className="mt-14">
          <SectionHeader
            title="Oxşar məhsullar"
            description={`${product.category.name} kateqoriyasından daha çox`}
            actionHref={`/products?category=${product.category.slug}`}
            actionLabel="Kateqoriyaya bax"
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard product={item} key={item.id} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

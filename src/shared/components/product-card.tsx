import Link from "next/link";
import Image from "next/image";
import { Eye, Heart } from "lucide-react";
import type { StoreProduct } from "@/shared/types/storefront";
import { formatPrice } from "@/shared/utils/format-price";
import { cn } from "@/shared/utils/cn";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";

function discountPercent(price: string, oldPrice?: string | null) {
  if (!oldPrice) return null;
  const current = Number(price);
  const previous = Number(oldPrice);
  if (!previous || previous <= current) return null;
  return Math.round(((previous - current) / previous) * 100);
}

export function ProductCard({
  product,
  className,
}: {
  product: StoreProduct;
  className?: string;
}) {
  const inStock = product.stock > 0 && product.status === "ACTIVE";
  const lowStock = inStock && product.stock <= 8;
  const discount = discountPercent(product.price, product.oldPrice);
  const href = `/products/${product.slug}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-card",
        className,
      )}
    >
      {/* Media */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50/40 p-5">
        <Link href={href} className="block h-full w-full">
          <Image
            alt={product.name}
            className="h-full w-full object-contain drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-[1.08]"
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 90vw"
            src={product.images[0]}
          />
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount ? (
            <span className="inline-flex items-center rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              −{discount}%
            </span>
          ) : null}
          {product.isNew ? (
            <span className="inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              Yeni
            </span>
          ) : null}
          {product.isFeatured ? (
            <span className="inline-flex items-center rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              Seçilmiş
            </span>
          ) : null}
        </div>

        {/* Quick actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            type="button"
            aria-label="Add to favorites"
            className="glass flex h-9 w-9 translate-x-2 items-center justify-center rounded-full text-gray-600 shadow-soft ring-1 ring-white/70 transition-all duration-300 hover:text-rose-500 group-hover:translate-x-0"
          >
            <Heart className="h-4 w-4" />
          </button>
          <Link
            href={href}
            aria-label="Quick view"
            className="glass flex h-9 w-9 translate-x-2 items-center justify-center rounded-full text-gray-600 shadow-soft ring-1 ring-white/70 transition-all duration-300 hover:text-brand-700 group-hover:translate-x-0"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>

        {/* Stock chip */}
        <div className="absolute bottom-3 left-3">
          {inStock ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold shadow-sm ring-1 ring-black/5 backdrop-blur",
                lowStock ? "text-amber-600" : "text-brand-700",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  lowStock ? "bg-amber-500" : "bg-brand-500",
                )}
              />
              {lowStock ? `Son ${product.stock} ədəd` : "Stokda var"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-gray-500 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              Stokda yoxdur
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
          {product.brand.name}
        </p>
        <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-gray-800">
          <Link className="transition-colors hover:text-brand-700" href={href}>
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-3">
          <div className="flex items-end gap-2">
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice ? (
              <span className="pb-0.5 text-sm font-medium text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
          </div>

          <AddToCartButton
            className="mt-3"
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
    </article>
  );
}

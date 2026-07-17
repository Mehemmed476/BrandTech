"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ExternalLink, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CartProvider } from "@/features/cart/cart-context";
import { ProductCard } from "@/shared/components/product-card";
import type { AdminProductRow } from "@/shared/services/products/product.service";
import type { StoreProduct } from "@/shared/types/storefront";

export function ProductCardPreview({ product }: { product: AdminProductRow }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const previewProduct = useMemo<StoreProduct>(
    () => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku ?? undefined,
      brand: {
        id: "preview-brand",
        name: product.brandName ?? "Brendsiz",
        slug: "",
      },
      category: {
        id: "preview-category",
        name: product.categoryName,
        slug: "",
        productCount: 0,
      },
      description: "",
      price: product.price,
      oldPrice: product.oldPrice,
      stock: product.stock,
      status: product.status,
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      images: [product.image],
      specifications: [],
    }),
    [product],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${product.name} kart önizləməsini aç`}
        className="group flex w-full items-center gap-3 rounded-lg text-left outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-white p-1 ring-1 ring-transparent transition group-hover:ring-brand-200">
          <Image
            alt=""
            src={product.image}
            fill
            sizes="40px"
            className="object-contain"
          />
        </span>
        <span className="max-w-[240px] truncate font-semibold text-gray-900 transition group-hover:text-brand-700">
          {product.name}
        </span>
        <Eye className="ml-auto h-4 w-4 shrink-0 text-gray-300 opacity-0 transition group-hover:text-brand-600 group-hover:opacity-100" />
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <div
                className="absolute inset-0 bg-gray-950/55 backdrop-blur-sm"
                aria-hidden="true"
                onClick={close}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`product-preview-${product.id}`}
                className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/70 bg-white shadow-pop"
              >
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
                  <div>
                    <h2
                      id={`product-preview-${product.id}`}
                      className="font-bold text-gray-900"
                    >
                      Kart önizləməsi
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Məhsul mağazada bu formada görünəcək.
                    </p>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Önizləməni bağla"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="bg-gray-50/80 p-5 sm:p-6">
                  <CartProvider>
                    <div className="pointer-events-none mx-auto w-full max-w-[300px] select-none">
                      <ProductCard product={previewProduct} />
                    </div>
                  </CartProvider>
                  <p className="mt-3 text-center text-[11px] text-gray-400">
                    Önizləmə rejimində kart düymələri aktiv deyil.
                  </p>
                </div>

                <div className="flex justify-end border-t border-gray-100 px-5 py-4">
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Mağazada aç
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

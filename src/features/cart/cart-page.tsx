"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { ButtonLink, EmptyState } from "@/shared/components";
import { useCart } from "@/features/cart/cart-context";
import { formatPrice } from "@/shared/utils/format-price";

const FREE_DELIVERY_THRESHOLD = 150;

export function CartPage() {
  const { items, subtotal, totalItems, isReady, updateQuantity, removeItem } =
    useCart();

  if (!isReady) {
    return (
      <main className="container-page py-14">
        <div className="h-64 animate-pulse rounded-3xl bg-gradient-to-r from-brand-50 via-gray-100 to-brand-50" />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-page py-14">
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title="Səbətiniz boşdur"
          description="Davam etmək üçün avadanlıq və aksesuarlar əlavə edin."
          action={<ButtonLink href="/products">Məhsullara bax</ButtonLink>}
        />
      </main>
    );
  }

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 10;
  const total = subtotal + delivery;
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <main className="container-page py-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Səbət
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Səbətdə {totalItems} məhsul
          </p>
        </div>
        <Link
          href="/products"
          className="hidden text-sm font-semibold text-brand-700 hover:underline sm:block"
        >
          Alışa davam et
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          {remaining > 0 ? (
            <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
              <Truck className="h-5 w-5 shrink-0 text-brand-600" />
              <span>
                Pulsuz çatdırılma üçün daha{" "}
                <span className="font-bold">{formatPrice(remaining)}</span>{" "}
                əlavə edin.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">
              <Truck className="h-5 w-5 shrink-0 text-brand-600" />
              Pulsuz çatdırılma qazandınız.
            </div>
          )}

          {items.map((line) => (
            <article
              key={line.id}
              className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-soft sm:grid-cols-[104px_1fr_auto]"
            >
              <Link
                href={`/products/${line.slug}`}
                className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-white p-2"
              >
                <Image
                  alt={line.name}
                  src={line.image}
                  fill
                  sizes="104px"
                  className="object-contain"
                />
              </Link>

              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
                  {line.brand}
                </p>
                <h2 className="mt-1 font-semibold leading-snug text-gray-900">
                  <Link
                    href={`/products/${line.slug}`}
                    className="hover:text-brand-700"
                  >
                    {line.name}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {formatPrice(line.price)} / ədəd
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="inline-flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-1.5">
                    <button
                      type="button"
                      aria-label="Sayı azalt"
                      onClick={() => updateQuantity(line.id, line.quantity - 1)}
                      disabled={line.quantity <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold text-gray-900">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Sayı artır"
                      onClick={() => updateQuantity(line.id, line.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    Sil
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-black text-gray-900">
                  {formatPrice(line.price * line.quantity)}
                </p>
              </div>
            </article>
          ))}
        </section>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-gray-900">
              Sifariş xülasəsi
            </h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ara cəm</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Çatdırılma</span>
                <span className="font-semibold text-gray-900">
                  {delivery === 0 ? "Pulsuz" : formatPrice(delivery)}
                </span>
              </div>
              <div className="mt-2 border-t border-gray-100 pt-4">
                <div className="flex items-end justify-between">
                  <span className="font-bold text-gray-900">Cəmi</span>
                  <span className="text-2xl font-black tracking-tight text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
              Sifarişi rəsmiləşdir
            </ButtonLink>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4 text-brand-500" />
              Təhlükəsiz sifariş · Zəmanət daxil
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

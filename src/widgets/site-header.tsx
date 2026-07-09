"use client";

import Link from "next/link";
import {
  ChevronDown,
  Clock,
  Headphones,
  LayoutGrid,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/features/cart/cart-context";
import { MegaCategoryMenu } from "@/widgets/mega-category-menu";
import type { StoreCategory } from "@/shared/types/storefront";
import type { StoreSettings } from "@/shared/types/settings";

function Logo({
  storeName,
  onClick,
}: {
  storeName: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex shrink-0 items-center gap-2.5"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-base font-black text-white shadow-[0_6px_16px_-6px_rgba(46,125,50,0.7)]">
        BT
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-leaf-400 ring-2 ring-white" />
      </span>
      <span className="hidden leading-none sm:block">
        <span className="block text-[15px] font-extrabold tracking-tight text-gray-900">
          {storeName}
        </span>
        <span className="mt-1 block text-[11px] font-semibold text-brand-600">
          Kompüter avadanlıqları mağazası
        </span>
      </span>
    </Link>
  );
}

function SearchBar({ id }: { id: string }) {
  return (
    <form action="/products" className="relative w-full" role="search">
      <label className="sr-only" htmlFor={id}>
        Məhsul axtar
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      />
      <input
        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-11 pr-24 text-sm text-gray-800 shadow-inner outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
        id={id}
        name="q"
        placeholder="SSD, RAM, GPU, monitor axtar…"
        type="search"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1.5 inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Axtar
      </button>
    </form>
  );
}

function CartButton() {
  const { totalItems, isReady } = useCart();
  const count = isReady ? totalItems : 0;
  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 shadow-soft transition hover:border-brand-300 hover:text-brand-700"
      aria-label="Səbəti aç"
    >
      <span className="relative">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {count}
          </span>
        ) : null}
      </span>
      <span className="hidden lg:inline">Səbət</span>
    </Link>
  );
}

export function SiteHeader({
  settings,
  categories,
}: {
  settings: StoreSettings;
  categories: StoreCategory[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const quickLinks = categories.slice(0, 6);

  return (
    <header>
      {/* Top info bar */}
      <div className="hidden bg-gray-900 text-white md:block">
        <div className="container-page flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-5 text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-leaf-400" />
              {settings.workingHours}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-leaf-400" />
              {settings.deliveryText}
            </span>
          </div>
          <div className="flex items-center gap-5 text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-leaf-400" />
              {settings.warrantyText}
            </span>
            <a
              className="inline-flex items-center gap-1.5 transition hover:text-white"
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
            >
              <MessageCircle className="h-3.5 w-3.5 text-leaf-400" />
              WhatsApp
            </a>
            <a
              className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-leaf-400"
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
            >
              <Phone className="h-3.5 w-3.5 text-leaf-400" />
              {settings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Sticky main bar */}
      <div className="sticky top-0 z-50 border-b border-gray-100 glass">
        <div className="container-page flex h-[72px] items-center gap-3 lg:gap-5">
          <Logo storeName={settings.storeName} />

          <div className="group relative hidden lg:block">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
            >
              <LayoutGrid className="h-4 w-4" />
              Kateqoriyalar
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <MegaCategoryMenu categories={categories} />
            </div>
          </div>

          <div className="hidden max-w-2xl flex-1 lg:block">
            <SearchBar id="site-search" />
          </div>

          <div className="ml-auto flex items-center gap-1.5 lg:gap-2">
            <Link
              href="/admin"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-700 sm:inline-flex"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                <UserRound className="h-4.5 w-4.5" />
              </span>
              <span className="hidden leading-none xl:block">
                <span className="block text-[11px] text-gray-400">Hesab</span>
                <span className="block">Admin / Giriş</span>
              </span>
            </Link>

            <CartButton />

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-800 shadow-soft transition hover:border-brand-300 hover:text-brand-700 lg:hidden"
              onClick={() => setIsOpen((value) => !value)}
              aria-label="Menyunu aç"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Quick category strip */}
        <div className="hidden border-t border-gray-100 lg:block">
          <div className="container-page flex h-11 items-center gap-1 text-sm">
            <Link
              href="/products"
              className="rounded-lg px-3 py-1.5 font-medium text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
            >
              Bütün məhsullar
            </Link>
            {quickLinks.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="rounded-lg px-3 py-1.5 font-medium text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/products"
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              <Headphones className="h-4 w-4" />
              Seçimdə kömək lazımdır?
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {isOpen ? (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />
          <div className="fixed inset-x-0 top-0 z-50 max-h-[92vh] overflow-y-auto rounded-b-3xl border-b border-gray-100 bg-white p-4 shadow-pop">
            <div className="mb-4 flex items-center justify-between">
              <Logo storeName={settings.storeName} onClick={close} />
              <button
                type="button"
                onClick={close}
                aria-label="Menyunu bağla"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SearchBar id="mobile-search" />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/products"
                onClick={close}
                className="rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Məhsullar
              </Link>
              <Link
                href="/admin"
                onClick={close}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-800"
              >
                Admin / Giriş
              </Link>
            </div>

            <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
              Kateqoriyalar
            </p>
            <MegaCategoryMenu
              categories={categories}
              compact
              onNavigate={close}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

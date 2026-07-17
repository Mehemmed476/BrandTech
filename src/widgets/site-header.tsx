"use client";

import Link from "next/link";
import {
  ChevronDown,
  Clock,
  LayoutGrid,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/features/cart/cart-context";
import { HeaderSearch } from "@/widgets/header-search";
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
          Kompüter avadanlıqları
        </span>
      </span>
    </Link>
  );
}

function CartButton() {
  const { totalItems, isReady } = useCart();
  const count = isReady ? totalItems : 0;
  return (
    <Link
      href="/cart"
      aria-label="Səbət"
      className="relative inline-flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-700"
    >
      <span className="relative">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {count}
          </span>
        ) : null}
      </span>
      <span className="hidden xl:inline">Səbət</span>
    </Link>
  );
}

const navLinkClass =
  "inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-700";

export function SiteHeader({
  settings,
  categories,
}: {
  settings: StoreSettings;
  categories: StoreCategory[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <header>
      {/* Top info bar */}
      <div className="hidden bg-gray-900 text-white md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-leaf-400" />
              {settings.workingHours}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-leaf-400" />
              {settings.deliveryText}
            </span>
          </div>
          <div className="flex items-center gap-5">
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
        <div className="container-page flex h-16 items-center gap-3 lg:gap-6">
          <Logo storeName={settings.storeName} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            <div className="group relative">
              <Link href="/categories" className={navLinkClass}>
                <LayoutGrid className="h-4 w-4" />
                Kateqoriyalar
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <MegaCategoryMenu categories={categories} />
              </div>
            </div>
            <Link href="/products" className={navLinkClass}>
              Məhsullar
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden flex-1 lg:block">
            <HeaderSearch id="site-search" />
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <Link
              href="/admin"
              aria-label="Admin / Giriş"
              className="hidden h-10 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-700 sm:inline-flex"
            >
              <UserRound className="h-5 w-5" />
              <span className="hidden xl:inline">Giriş</span>
            </Link>

            <CartButton />

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-brand-50 hover:text-brand-700 lg:hidden"
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

            <HeaderSearch id="mobile-search" onNavigate={close} />

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

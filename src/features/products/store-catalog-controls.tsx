"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryIcon } from "@/shared/components";
import { cn } from "@/shared/utils/cn";
import type { StoreBrand, StoreCategory } from "@/shared/types/storefront";

const sortOptions = [
  { value: "featured", label: "Seçilmişlər öndə" },
  { value: "newest", label: "Ən yeni" },
  { value: "price-asc", label: "Qiymət: ucuzdan bahaya" },
  { value: "price-desc", label: "Qiymət: bahadan ucuza" },
  { value: "name", label: "Ad: A–Z" },
];

function useParamUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return { update, searchParams };
}

export function CatalogSearch() {
  const { update, searchParams } = useParamUpdater();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({ q: value.trim() });
  };

  return (
    <form onSubmit={submit} className="relative mt-5 max-w-xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Məhsul, brend və ya kateqoriya axtar"
        className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 shadow-soft outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
        type="search"
      />
    </form>
  );
}

export function CatalogChips({ categories }: { categories: StoreCategory[] }) {
  const { update, searchParams } = useParamUpdater();
  const active = searchParams.get("category") ?? "";

  return (
    <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => update({ category: "" })}
        className={cn(
          "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
          active === ""
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-gray-200 bg-white text-gray-700 hover:border-brand-300",
        )}
      >
        Hamısı
      </button>
      {categories.map((category) => {
        const isActive = active === category.slug;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => update({ category: category.slug })}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition",
              isActive
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-brand-300",
            )}
          >
            <CategoryIcon slug={category.slug} className="h-4 w-4" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

export function CatalogSort() {
  const { update, searchParams } = useParamUpdater();
  return (
    <label className="flex items-center gap-2">
      <span className="hidden text-sm text-gray-500 sm:inline">Sırala</span>
      <select
        value={searchParams.get("sort") ?? "featured"}
        onChange={(event) => update({ sort: event.target.value })}
        className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 shadow-soft outline-none focus:border-brand-400"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterBody({ brands }: { brands: StoreBrand[] }) {
  const { update, searchParams } = useParamUpdater();
  const activeBrand = searchParams.get("brand") ?? "";
  const [min, setMin] = useState(searchParams.get("min") ?? "");
  const [max, setMax] = useState(searchParams.get("max") ?? "");

  return (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
          Brend
        </h3>
        <div className="space-y-1">
          {brands.map((brand) => {
            const isActive = activeBrand === brand.slug;
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => update({ brand: isActive ? "" : brand.slug })}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {brand.name}
                {isActive ? <X className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
          Qiymət (₼)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={min}
            onChange={(event) => setMin(event.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-brand-400 focus:bg-white"
            placeholder="Min"
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={max}
            onChange={(event) => setMax(event.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-brand-400 focus:bg-white"
            placeholder="Maks"
          />
        </div>
        <button
          type="button"
          onClick={() => update({ min, max })}
          className="mt-3 h-10 w-full rounded-xl bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Tətbiq et
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          setMin("");
          setMax("");
          update({ brand: "", min: "", max: "", q: "", category: "" });
        }}
        className="text-sm font-semibold text-gray-400 transition hover:text-brand-700"
      >
        Filtri təmizlə
      </button>
    </div>
  );
}

export function CatalogFilters({ brands }: { brands: StoreBrand[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-soft lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtrlər
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-soft lg:block">
        <div className="mb-5 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          <h2 className="font-bold text-gray-900">Filtrlər</h2>
        </div>
        <FilterBody brands={brands} />
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-pop">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-bold text-gray-900">Filtrlər</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Bağla"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterBody brands={brands} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

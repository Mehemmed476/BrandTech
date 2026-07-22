"use client";

import {
  Grid3x3,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
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

  // Debounced real-time search: update the URL as the user types.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (value.trim() === current) return;
    const timer = setTimeout(() => update({ q: value.trim() }), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
            <CategoryIcon
              slug={category.slug}
              iconName={category.iconName}
              className="h-4 w-4"
            />
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

export function CatalogViewToggle() {
  const { update, searchParams } = useParamUpdater();
  const view =
    searchParams.get("view") === "comfortable" ? "comfortable" : "compact";

  return (
    <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-soft">
      <button
        type="button"
        onClick={() => update({ view: "compact" })}
        aria-label="Sıx görünüş"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition",
          view === "compact"
            ? "bg-brand-600 text-white"
            : "text-gray-500 hover:text-brand-700",
        )}
      >
        <Grid3x3 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => update({ view: "comfortable" })}
        aria-label="Geniş görünüş"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition",
          view === "comfortable"
            ? "bg-brand-600 text-white"
            : "text-gray-500 hover:text-brand-700",
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}

const conditionFilters = [
  { key: "instock", label: "Stokda var" },
  { key: "sale", label: "Endirimli" },
  { key: "new", label: "Yeni" },
  { key: "featured", label: "Seçilmiş" },
];

const pricePresets = [
  { label: "100 ₼-a qədər", min: "", max: "100" },
  { label: "100 – 500 ₼", min: "100", max: "500" },
  { label: "500 – 1000 ₼", min: "500", max: "1000" },
  { label: "1000 ₼-dan çox", min: "1000", max: "" },
];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-gray-100 pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterBody({ brands }: { brands: StoreBrand[] }) {
  const { update, searchParams } = useParamUpdater();

  const selectedBrands = (searchParams.get("brand") ?? "")
    .split(",")
    .filter(Boolean);
  const [min, setMin] = useState(searchParams.get("min") ?? "");
  const [max, setMax] = useState(searchParams.get("max") ?? "");

  const toggleBrand = (slug: string) => {
    const next = selectedBrands.includes(slug)
      ? selectedBrands.filter((value) => value !== slug)
      : [...selectedBrands, slug];
    update({ brand: next.join(",") });
  };

  const flag = (key: string) => searchParams.get(key) === "1";
  const toggleFlag = (key: string) => update({ [key]: flag(key) ? "" : "1" });

  return (
    <div className="space-y-5">
      <FilterSection title="Vəziyyət">
        <div className="space-y-1.5">
          {conditionFilters.map((filter) => (
            <label
              key={filter.key}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={flag(filter.key)}
                onChange={() => toggleFlag(filter.key)}
                className="h-4 w-4 rounded border-gray-300 accent-brand-600"
              />
              {filter.label}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brend">
        <div className="scrollbar-slim max-h-52 space-y-1.5 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label
              key={brand.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.slug)}
                onChange={() => toggleBrand(brand.slug)}
                className="h-4 w-4 rounded border-gray-300 accent-brand-600"
              />
              {brand.name}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Qiymət (₼)">
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
          className="mt-2 h-10 w-full rounded-xl bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Tətbiq et
        </button>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pricePresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setMin(preset.min);
                setMax(preset.max);
                update({ min: preset.min, max: preset.max });
              }}
              className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:border-brand-300 hover:text-brand-700"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <button
        type="button"
        onClick={() => {
          setMin("");
          setMax("");
          update({
            brand: "",
            min: "",
            max: "",
            q: "",
            category: "",
            instock: "",
            sale: "",
            new: "",
            featured: "",
          });
        }}
        className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 transition hover:border-rose-200 hover:text-rose-500"
      >
        Filtri təmizlə
      </button>
    </div>
  );
}

/** Removable chips summarising the currently applied filters. */
export function CatalogActiveFilters({
  categories,
  brands,
}: {
  categories: StoreCategory[];
  brands: StoreBrand[];
}) {
  const { update, searchParams } = useParamUpdater();

  const chips: { label: string; onRemove: () => void }[] = [];

  const q = searchParams.get("q");
  if (q) chips.push({ label: `"${q}"`, onRemove: () => update({ q: "" }) });

  const categorySlug = searchParams.get("category");
  if (categorySlug) {
    const name =
      categories.find((c) => c.slug === categorySlug)?.name ?? categorySlug;
    chips.push({ label: name, onRemove: () => update({ category: "" }) });
  }

  const selectedBrands = (searchParams.get("brand") ?? "")
    .split(",")
    .filter(Boolean);
  selectedBrands.forEach((slug) => {
    const name = brands.find((b) => b.slug === slug)?.name ?? slug;
    chips.push({
      label: name,
      onRemove: () =>
        update({ brand: selectedBrands.filter((s) => s !== slug).join(",") }),
    });
  });

  const min = searchParams.get("min");
  const max = searchParams.get("max");
  if (min || max) {
    chips.push({
      label: `${min || "0"} – ${max || "∞"} ₼`,
      onRemove: () => update({ min: "", max: "" }),
    });
  }

  [
    { key: "instock", label: "Stokda var" },
    { key: "sale", label: "Endirimli" },
    { key: "new", label: "Yeni" },
    { key: "featured", label: "Seçilmiş" },
  ].forEach((filter) => {
    if (searchParams.get(filter.key) === "1") {
      chips.push({
        label: filter.label,
        onRemove: () => update({ [filter.key]: "" }),
      });
    }
  });

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip, index) => (
        <button
          key={`${chip.label}-${index}`}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100 transition hover:bg-brand-100"
        >
          {chip.label}
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
      <button
        type="button"
        onClick={() =>
          update({
            q: "",
            category: "",
            brand: "",
            min: "",
            max: "",
            instock: "",
            sale: "",
            new: "",
            featured: "",
          })
        }
        className="text-xs font-semibold text-gray-400 transition hover:text-rose-500"
      >
        Hamısını təmizlə
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

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CategoryIcon } from "@/shared/components/category-icon";
import type { StoreCategory } from "@/shared/types/storefront";

export function MegaCategoryMenu({
  categories,
  compact = false,
  onNavigate,
}: {
  categories: StoreCategory[];
  compact?: boolean;
  onNavigate?: () => void;
}) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <Link
            className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            href={`/products?category=${category.slug}`}
            key={category.id}
            onClick={onNavigate}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <CategoryIcon
                slug={category.slug}
                iconName={category.iconName}
                className="h-4 w-4"
              />
            </span>
            {category.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid w-[780px] max-w-[92vw] grid-cols-[1fr_260px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-pop ring-1 ring-black/5">
      <div className="grid grid-cols-2 gap-1 p-3">
        {categories.map((category) => (
          <Link
            className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-brand-50"
            href={`/products?category=${category.slug}`}
            key={category.id}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition group-hover/item:bg-brand-600 group-hover/item:text-white">
              <CategoryIcon
                slug={category.slug}
                iconName={category.iconName}
                className="h-5 w-5"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-gray-800 group-hover/item:text-brand-700">
                {category.name}
              </span>
              <span className="block truncate text-xs text-gray-400">
                {category.productCount} məhsul
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mesh-dark relative flex flex-col justify-between p-5 text-white">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ring-white/15">
            <Sparkles className="h-3.5 w-3.5" />
            Həftəlik endirimlər
          </span>
          <p className="mt-4 text-lg font-extrabold leading-snug">
            Ağıllı qur. Əsas komponentlərə qənaət et.
          </p>
          <p className="mt-2 text-sm text-white/70">
            Rəsmi zəmanət və sürətli çatdırılma ilə SSD, RAM və GPU dəstləri.
          </p>
        </div>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
        >
          Endirimlərə bax
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

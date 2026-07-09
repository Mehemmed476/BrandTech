import { LayoutGrid } from "lucide-react";
import { Breadcrumb, CategoryCard, EmptyState } from "@/shared/components";
import { safeQuery } from "@/shared/lib/safe-query";
import { getActiveCategories } from "@/shared/services/categories/category.service";

export async function CategoryListPage() {
  const categories = await safeQuery(getActiveCategories, []);
  const totalProducts = categories.reduce(
    (sum, category) => sum + category.productCount,
    0,
  );

  return (
    <main className="container-page py-6">
      <Breadcrumb items={[{ label: "Kateqoriyalar" }]} />

      <div className="mesh-brand relative overflow-hidden rounded-3xl border border-gray-100 p-6 shadow-soft sm:p-8">
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700 ring-1 ring-inset ring-brand-100">
            <LayoutGrid className="h-3.5 w-3.5" />
            Kateqoriyalar
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
            Bütün kateqoriyalar
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
            {categories.length} kateqoriya · {totalProducts}+ məhsul —
            komponentlər, periferiya, şəbəkə və hazır sistemlər.
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<LayoutGrid className="h-8 w-8" />}
            title="Kateqoriya tapılmadı"
            description="Tezliklə kateqoriyalar əlavə olunacaq."
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>
      )}
    </main>
  );
}

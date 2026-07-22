import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { StoreCategory } from "@/shared/types/storefront";
import { CategoryIcon } from "@/shared/components/category-icon";
import { cn } from "@/shared/utils/cn";

export function CategoryCard({
  category,
  className,
}: {
  category: StoreCategory;
  className?: string;
}) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-card",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {category.imageUrl ? (
          <Image
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={category.imageUrl}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/10 to-transparent" />
        <span className="glass absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl text-brand-700 shadow-soft ring-1 ring-white/60">
          <CategoryIcon
            slug={category.slug}
            iconName={category.iconName}
            className="h-5 w-5"
          />
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
          <div>
            <h3 className="text-base font-bold text-white drop-shadow-sm">
              {category.name}
            </h3>
            <p className="text-xs font-medium text-white/80">
              {category.productCount} products
            </p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

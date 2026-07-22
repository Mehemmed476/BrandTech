"use client";

import Link from "next/link";
import { useMemo, useState, type FocusEvent } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { CategoryIcon } from "@/shared/components";
import type { StoreCategory } from "@/shared/types/storefront";
import { cn } from "@/shared/utils/cn";

const ROOT_KEY = "__root__";

function groupCategories(categories: StoreCategory[]) {
  const ids = new Set(categories.map((category) => category.id));
  const groups = new Map<string, StoreCategory[]>();

  for (const category of categories) {
    const parentKey =
      category.parentId && ids.has(category.parentId)
        ? category.parentId
        : ROOT_KEY;
    const siblings = groups.get(parentKey) ?? [];
    siblings.push(category);
    groups.set(parentKey, siblings);
  }

  return groups;
}

export function HomeCategorySidebar({
  categories,
}: {
  categories: StoreCategory[];
}) {
  const groups = useMemo(() => groupCategories(categories), [categories]);
  const roots = groups.get(ROOT_KEY) ?? [];
  const [activePath, setActivePath] = useState<string[]>([]);

  const openLevel = (level: number, id: string) => {
    setActivePath((current) => [...current.slice(0, level), id]);
  };

  const closeWhenFocusLeaves = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActivePath([]);
    }
  };

  const columns: Array<{
    level: number;
    parent: StoreCategory;
    items: StoreCategory[];
  }> = [];
  let parentId = activePath[0];
  let level = 1;
  while (parentId) {
    const items = groups.get(parentId) ?? [];
    const parent = categories.find((category) => category.id === parentId);
    if (!parent || items.length === 0) break;
    columns.push({ level, parent, items });
    parentId = activePath[level];
    level += 1;
  }

  return (
    <aside
      className="relative z-30 hidden rounded-3xl border border-gray-100 bg-white p-2 shadow-soft lg:flex lg:h-[440px] lg:flex-col"
      onMouseLeave={() => setActivePath([])}
      onBlur={closeWhenFocusLeaves}
    >
      <p className="shrink-0 px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
        Kateqoriyalar
      </p>
      <nav
        className="scrollbar-slim min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-1"
        aria-label="Ana kateqoriyalar"
      >
        {roots.map((category) => {
          const hasChildren = (groups.get(category.id)?.length ?? 0) > 0;
          const active = activePath[0] === category.id;
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              onMouseEnter={() => openLevel(0, category.id)}
              onFocus={() => openLevel(0, category.id)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-700 hover:bg-brand-50 hover:text-brand-700",
              )}
            >
              <CategoryIcon
                slug={category.slug}
                iconName={category.iconName}
                className="h-4.5 w-4.5 shrink-0 text-brand-600"
              />
              <span className="truncate">{category.name}</span>
              {hasChildren ? (
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/categories"
        className="mt-2 flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
      >
        Bütün kateqoriyalar
        <ArrowRight className="h-4 w-4" />
      </Link>

      {columns.length > 0 ? (
        <div className="absolute left-[calc(100%-1px)] top-0 flex h-[440px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-pop ring-1 ring-black/5">
          {columns.map((column, columnIndex) => (
            <section
              key={column.parent.id}
              className={cn(
                "scrollbar-slim w-60 shrink-0 overflow-y-auto p-2",
                columnIndex > 0 && "border-l border-gray-100",
              )}
              aria-label={`${column.parent.name} alt kateqoriyaları`}
            >
              <Link
                href={`/products?category=${column.parent.slug}`}
                className="mb-1 block rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-700 hover:bg-brand-50"
              >
                Bütün {column.parent.name}
              </Link>
              {column.items.map((category) => {
                const hasChildren = (groups.get(category.id)?.length ?? 0) > 0;
                const active = activePath[column.level] === category.id;
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    onMouseEnter={() => openLevel(column.level, category.id)}
                    onFocus={() => openLevel(column.level, category.id)}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-700 hover:bg-brand-50 hover:text-brand-700",
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <CategoryIcon
                        slug={category.slug}
                        iconName={category.iconName}
                        className="h-4 w-4"
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {category.name}
                    </span>
                    {hasChildren ? (
                      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-brand-500" />
                    ) : null}
                  </Link>
                );
              })}
            </section>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

import { prisma } from "@/shared/lib/prisma";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "@/shared/schemas/category.schema";
import type { StoreCategory } from "@/shared/types/storefront";

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  iconName: string;
  parentId: string;
  parentName: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
};

export type CategoryOption = { id: string; name: string };

export async function getActiveCategories(): Promise<StoreCategory[]> {
  const rows = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return rows.map((row) => ({
    id: row.id,
    parentId: row.parentId ?? undefined,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    iconName: row.iconName ?? undefined,
    productCount: row._count.products,
  }));
}

export async function getAdminCategories(): Promise<AdminCategoryRow[]> {
  const rows = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true } },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    imageUrl: row.imageUrl ?? "",
    iconName: row.iconName ?? "",
    parentId: row.parentId ?? "",
    parentName: row.parent?.name ?? null,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    productCount: row._count.products,
  }));
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });
}

export async function getAdminCategoryById(
  id: string,
): Promise<AdminCategoryRow | null> {
  const row = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true } },
    },
  });
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    imageUrl: row.imageUrl ?? "",
    iconName: row.iconName ?? "",
    parentId: row.parentId ?? "",
    parentName: row.parent?.name ?? null,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    productCount: row._count.products,
  };
}

export async function createCategory(input: unknown) {
  const data = categoryCreateSchema.parse(input);
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      iconName: data.iconName || null,
      parentId: data.parentId || null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    },
  });
}

export async function updateCategory(id: string, input: unknown) {
  const data = categoryUpdateSchema.parse(input);
  // A category cannot be its own parent.
  const parentId = data.parentId && data.parentId !== id ? data.parentId : null;
  return prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description:
        data.description !== undefined ? data.description || null : undefined,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl || null : undefined,
      iconName: data.iconName !== undefined ? data.iconName || null : undefined,
      parentId: data.parentId !== undefined ? parentId : undefined,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    },
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

/** Slugs + last-modified dates for the sitemap. */
export async function getCategorySitemapData() {
  return prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });
}

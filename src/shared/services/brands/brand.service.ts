import { prisma } from "@/shared/lib/prisma";
import {
  brandCreateSchema,
  brandUpdateSchema,
} from "@/shared/schemas/brand.schema";
import type { StoreBrand } from "@/shared/types/storefront";

export type AdminBrandRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  isActive: boolean;
  productCount: number;
};

export type BrandOption = { id: string; name: string };

export async function getActiveBrands(): Promise<StoreBrand[]> {
  const rows = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
  return rows;
}

export async function getAdminBrands(): Promise<AdminBrandRow[]> {
  const rows = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logoUrl ?? "",
    isActive: row.isActive,
    productCount: row._count.products,
  }));
}

export async function getBrandOptions(): Promise<BrandOption[]> {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function getAdminBrandById(
  id: string,
): Promise<AdminBrandRow | null> {
  const row = await prisma.brand.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logoUrl ?? "",
    isActive: row.isActive,
    productCount: row._count.products,
  };
}

export async function createBrand(input: unknown) {
  const data = brandCreateSchema.parse(input);
  return prisma.brand.create({
    data: {
      name: data.name,
      slug: data.slug,
      logoUrl: data.logoUrl || null,
      isActive: data.isActive,
    },
  });
}

export async function updateBrand(id: string, input: unknown) {
  const data = brandUpdateSchema.parse(input);
  return prisma.brand.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      logoUrl: data.logoUrl !== undefined ? data.logoUrl || null : undefined,
      isActive: data.isActive,
    },
  });
}

export async function deleteBrand(id: string) {
  return prisma.brand.delete({ where: { id } });
}

import { z } from "zod";
import type { BannerPosition } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import {
  bannerCreateSchema,
  bannerUpdateSchema,
} from "@/shared/schemas/banner.schema";
import type { StoreBanner } from "@/shared/types/storefront";

export type BannerCreateInput = z.infer<typeof bannerCreateSchema>;
export type BannerUpdateInput = z.infer<typeof bannerUpdateSchema>;

export type AdminBannerRow = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  position: BannerPosition;
  isActive: boolean;
  sortOrder: number;
};

export async function getActiveBanners(): Promise<StoreBanner[]> {
  const rows = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    imageUrl: row.imageUrl,
    linkUrl: row.linkUrl ?? undefined,
    position: row.position,
  }));
}

export async function getAdminBanners(): Promise<AdminBannerRow[]> {
  const rows = await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { sortOrder: "asc" }],
  });
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    imageUrl: row.imageUrl,
    linkUrl: row.linkUrl ?? "",
    position: row.position,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  }));
}

export async function getAdminBannerById(
  id: string,
): Promise<AdminBannerRow | null> {
  const row = await prisma.banner.findUnique({ where: { id } });
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    imageUrl: row.imageUrl,
    linkUrl: row.linkUrl ?? "",
    position: row.position,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

export async function createBanner(input: unknown) {
  const data = bannerCreateSchema.parse(input);
  return prisma.banner.create({
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl || null,
      position: data.position,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    },
  });
}

export async function updateBanner(id: string, input: unknown) {
  const data = bannerUpdateSchema.parse(input);
  return prisma.banner.update({
    where: { id },
    data: {
      title: data.title,
      subtitle: data.subtitle !== undefined ? data.subtitle || null : undefined,
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl !== undefined ? data.linkUrl || null : undefined,
      position: data.position,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    },
  });
}

export async function deleteBanner(id: string) {
  return prisma.banner.delete({ where: { id } });
}

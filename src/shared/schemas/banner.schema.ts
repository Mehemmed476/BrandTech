import { z } from "zod";

export const bannerPositionSchema = z.enum(["HERO", "CATEGORY", "PROMO"]);

export const bannerCreateSchema = z.object({
  title: z.string().trim().min(2).max(200),
  subtitle: z.string().trim().max(400).optional().nullable(),
  imageUrl: z.string().trim().min(1).max(1000),
  linkUrl: z.string().trim().max(1000).optional().nullable(),
  position: bannerPositionSchema.default("HERO"),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const bannerUpdateSchema = bannerCreateSchema.partial();

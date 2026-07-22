import { z } from "zod";
import { imageRefSchema } from "@/shared/schemas/brand.schema";

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(160),
  description: z.string().trim().max(1000).optional().nullable(),
  imageUrl: imageRefSchema,
  iconName: z.string().trim().max(80).optional().nullable(),
  parentId: z.string().trim().min(1).optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

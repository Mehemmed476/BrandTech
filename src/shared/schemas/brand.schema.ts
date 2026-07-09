import { z } from "zod";

export const brandCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(160),
  logoUrl: z.string().trim().url().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const brandUpdateSchema = brandCreateSchema.partial();

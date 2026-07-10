import { z } from "zod";

// Accepts an uploaded path (/uploads/...) or an absolute http(s) URL, or empty.
export const imageRefSchema = z
  .string()
  .trim()
  .max(1000)
  .refine(
    (value) => !value || value.startsWith("/") || /^https?:\/\//i.test(value),
    { message: "Yanlış şəkil ünvanı" },
  )
  .optional()
  .nullable();

export const brandCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(160),
  logoUrl: imageRefSchema,
  isActive: z.boolean().default(true),
});

export const brandUpdateSchema = brandCreateSchema.partial();

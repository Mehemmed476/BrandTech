import { z } from "zod";

const moneySchema = z.coerce.number().finite().nonnegative();

export const productStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "OUT_OF_STOCK",
]);

export const productImageInputSchema = z.object({
  imageUrl: z.string().trim().min(1),
  altText: z.string().trim().max(180).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isMain: z.boolean().default(false),
});

export const productSpecificationInputSchema = z.object({
  key: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(500),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const productCreateSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(220),
  sku: z.string().trim().max(120).optional().nullable(),
  description: z.string().trim().max(5000).optional().nullable(),
  price: moneySchema,
  oldPrice: moneySchema.optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  status: productStatusSchema.default("ACTIVE"),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  categoryId: z.string().trim().min(1),
  brandId: z.string().trim().min(1).optional().nullable(),
  images: z.array(productImageInputSchema).default([]),
  specifications: z.array(productSpecificationInputSchema).default([]),
});

export const productUpdateSchema = productCreateSchema.partial();

import { z } from "zod";

const moneySchema = z.coerce.number().finite().nonnegative();

export const orderCreateItemSchema = z.object({
  productId: z.string().trim().min(1).optional().nullable(),
  productName: z.string().trim().min(2).max(200),
  productSku: z.string().trim().max(120).optional().nullable(),
  quantity: z.coerce.number().int().positive(),
  unitPrice: moneySchema,
  totalPrice: moneySchema,
});

export const orderCreateSchema = z.object({
  userId: z.string().trim().min(1).optional().nullable(),
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(32),
  email: z.string().trim().email().optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  note: z.string().trim().max(1000).optional().nullable(),
  subtotal: moneySchema,
  deliveryPrice: moneySchema.default(0),
  total: moneySchema,
  items: z.array(orderCreateItemSchema).min(1),
});

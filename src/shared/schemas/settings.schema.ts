import { z } from "zod";

const optionalText = z.string().trim().max(500).optional().default("");

export const settingsUpdateSchema = z.object({
  storeName: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(60).optional().default(""),
  whatsapp: z.string().trim().max(60).optional().default(""),
  email: z.string().trim().max(160).optional().default(""),
  address: optionalText,
  workingHours: optionalText,
  deliveryText: optionalText,
  warrantyText: optionalText,
  instagram: z.string().trim().max(300).optional().default(""),
  facebook: z.string().trim().max(300).optional().default(""),
  youtube: z.string().trim().max(300).optional().default(""),
});

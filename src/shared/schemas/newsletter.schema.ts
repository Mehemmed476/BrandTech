import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Düzgün e-poçt ünvanı daxil edin.")
    .max(320),
});

export const newsletterCampaignSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, "Mövzu ən azı 3 simvol olmalıdır.")
    .max(160),
  message: z
    .string()
    .trim()
    .min(10, "Mesaj ən azı 10 simvol olmalıdır.")
    .max(20_000),
});

export type NewsletterCampaignInput = z.infer<typeof newsletterCampaignSchema>;

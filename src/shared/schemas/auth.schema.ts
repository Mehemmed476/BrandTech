import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().trim().min(3),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().optional().nullable(),
  phone: z.string().trim().min(7).max(32).optional().nullable(),
  password: z.string().min(8).max(128),
});

const optionalEmail = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .toLowerCase()
    .email("Düzgün e-poçt ünvanı daxil edin.")
    .optional(),
);

const optionalPhone = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .min(7, "Telefon ən azı 7 simvol olmalıdır.")
    .max(32)
    .optional(),
);

export const adminUserSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Ad ən azı 2 simvol olmalıdır.")
      .max(120),
    email: optionalEmail,
    phone: optionalPhone,
    password: z.string().min(8, "Şifrə ən azı 8 simvol olmalıdır.").max(128),
  })
  .refine((data) => data.email || data.phone, {
    message: "E-poçt və ya telefon nömrəsindən birini daxil edin.",
    path: ["email"],
  });

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Şifrə ən azı 8 simvol olmalıdır.").max(128),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifrələr eyni deyil.",
    path: ["confirmPassword"],
  });

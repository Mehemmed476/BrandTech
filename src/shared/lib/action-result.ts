import type { ZodError } from "zod";

export type ActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  /** Optional payload, e.g. a created order number. */
  data?: Record<string, unknown>;
};

export const actionOk = (
  message = "Əməliyyat uğurla tamamlandı.",
  data?: Record<string, unknown>,
): ActionResult => ({ ok: true, message, data });

export const actionFail = (
  message = "Xəta baş verdi. Yenidən cəhd edin.",
  fieldErrors?: Record<string, string>,
): ActionResult => ({ ok: false, message, fieldErrors });

/** Flatten a ZodError into a simple field -> message map. */
export function zodFieldErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!result[key]) {
      result[key] = issue.message;
    }
  }
  return result;
}

/** Map common database errors to friendly Azerbaijani messages. */
export function databaseErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  if (code === "P2002") {
    return "Bu qeyd artıq mövcuddur (təkrar dəyər).";
  }
  if (code === "P2003") {
    return "Bu qeyd başqa məlumatlarla əlaqəlidir və silinə bilməz.";
  }
  if (code === "P2025") {
    return "Qeyd tapılmadı.";
  }
  return "Verilənlər bazası xətası. Bağlantını yoxlayın.";
}

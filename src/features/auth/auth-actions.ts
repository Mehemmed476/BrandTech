"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  actionFail,
  actionOk,
  databaseErrorMessage,
  zodFieldErrors,
  type ActionResult,
} from "@/shared/lib/action-result";
import {
  clearSessionCookie,
  setSessionCookie,
  signSession,
} from "@/shared/lib/auth";
import { loginSchema } from "@/shared/schemas/auth.schema";
import { authenticateAdmin } from "@/shared/services/auth/auth.service";

export async function loginAction(input: unknown): Promise<ActionResult> {
  try {
    const data = loginSchema.parse(input);
    const user = await authenticateAdmin(data.identifier, data.password);
    if (!user) {
      return actionFail("E-poçt/telefon və ya şifrə yanlışdır.");
    }
    await setSessionCookie(signSession(user));
    return actionOk("Xoş gəldiniz!");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

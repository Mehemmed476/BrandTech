"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import {
  actionFail,
  actionOk,
  databaseErrorMessage,
  zodFieldErrors,
  type ActionResult,
} from "@/shared/lib/action-result";
import { saveStoreSettings } from "@/shared/services/settings/settings.service";
import { adminGuard } from "@/shared/lib/auth";

export async function saveSettingsAction(
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await saveStoreSettings(input);
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return actionOk("Parametrlər yadda saxlanıldı.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

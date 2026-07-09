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
import {
  createBanner,
  deleteBanner,
  updateBanner,
} from "@/shared/services/banners/banner.service";
import { adminGuard } from "@/shared/lib/auth";

function revalidate() {
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function createBannerAction(
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await createBanner(input);
    revalidate();
    return actionOk("Banner əlavə edildi.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function updateBannerAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await updateBanner(id, input);
    revalidate();
    return actionOk("Banner yeniləndi.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function deleteBannerAction(id: string): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await deleteBanner(id);
    revalidate();
    return actionOk("Banner silindi.");
  } catch (error) {
    return actionFail(databaseErrorMessage(error));
  }
}

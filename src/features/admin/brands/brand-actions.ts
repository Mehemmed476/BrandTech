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
  createBrand,
  deleteBrand,
  updateBrand,
} from "@/shared/services/brands/brand.service";
import { adminGuard } from "@/shared/lib/auth";

function revalidate() {
  revalidatePath("/admin/brands");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function createBrandAction(input: unknown): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await createBrand(input);
    revalidate();
    return actionOk("Brend əlavə edildi.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function updateBrandAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await updateBrand(id, input);
    revalidate();
    return actionOk("Brend yeniləndi.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function deleteBrandAction(id: string): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await deleteBrand(id);
    revalidate();
    return actionOk("Brend silindi.");
  } catch (error) {
    return actionFail(databaseErrorMessage(error));
  }
}

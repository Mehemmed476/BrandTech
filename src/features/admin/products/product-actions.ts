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
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/shared/services/products/product.service";
import { adminGuard } from "@/shared/lib/auth";

function revalidate() {
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function createProductAction(
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await createProduct(input);
    revalidate();
    return actionOk("Məhsul əlavə edildi.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function updateProductAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await updateProduct(id, input);
    revalidate();
    return actionOk("Məhsul yeniləndi.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await deleteProduct(id);
    revalidate();
    return actionOk("Məhsul silindi.");
  } catch (error) {
    return actionFail(databaseErrorMessage(error));
  }
}

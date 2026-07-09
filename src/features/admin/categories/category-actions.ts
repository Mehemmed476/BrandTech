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
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/shared/services/categories/category.service";
import { adminGuard } from "@/shared/lib/auth";

function revalidate() {
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
}

export async function createCategoryAction(
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await createCategory(input);
    revalidate();
    return actionOk("Kateqoriya əlavə edildi.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function updateCategoryAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await updateCategory(id, input);
    revalidate();
    return actionOk("Kateqoriya yeniləndi.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await deleteCategory(id);
    revalidate();
    return actionOk("Kateqoriya silindi.");
  } catch (error) {
    return actionFail(databaseErrorMessage(error));
  }
}

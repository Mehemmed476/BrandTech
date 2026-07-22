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
import { adminGuard, getSession } from "@/shared/lib/auth";
import {
  AdminUserOperationError,
  changeAdminPassword,
  createAdminUser,
  deleteAdminUser,
} from "@/shared/services/admin-users/admin-user.service";

export async function createAdminUserAction(
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await createAdminUser(input);
    revalidatePath("/admin/users");
    return actionOk("Admin istifadəçisi yaradıldı.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Məlumatları yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function changeAdminPasswordAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await changeAdminPassword(id, input);
    revalidatePath("/admin/users");
    return actionOk(
      "Şifrə dəyişdirildi. Hesabın əvvəlki sessiyaları bağlandı.",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Şifrələri yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function deleteAdminUserAction(id: string): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    const session = await getSession();
    if (!session) return actionFail("Admin sessiyası tapılmadı.");
    await deleteAdminUser(id, session.id);
    revalidatePath("/admin/users");
    return actionOk("Admin istifadəçisi silindi.");
  } catch (error) {
    if (error instanceof AdminUserOperationError) {
      return actionFail(error.message);
    }
    return actionFail(databaseErrorMessage(error));
  }
}

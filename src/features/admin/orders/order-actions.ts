"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import {
  actionFail,
  actionOk,
  databaseErrorMessage,
  type ActionResult,
} from "@/shared/lib/action-result";
import { orderStatusOrder } from "@/shared/constants/labels";
import { updateOrderStatus } from "@/shared/services/orders/order.service";
import { adminGuard } from "@/shared/lib/auth";

export async function updateOrderStatusAction(
  id: string,
  status: string,
): Promise<ActionResult> {
  const denied = await adminGuard();
  if (denied) return denied;
  if (!orderStatusOrder.includes(status as OrderStatus)) {
    return actionFail("Yanlış status.");
  }
  try {
    await updateOrderStatus(id, status as OrderStatus);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin");
    return actionOk("Sifariş statusu yeniləndi.");
  } catch (error) {
    return actionFail(databaseErrorMessage(error));
  }
}

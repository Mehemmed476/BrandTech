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
import { createOrder } from "@/shared/services/orders/order.service";

export async function placeOrderAction(input: unknown): Promise<ActionResult> {
  try {
    const { orderNumber } = await createOrder(input);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/products");
    return actionOk("Sifarişiniz qəbul edildi.", { orderNumber });
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail(
        "Sifariş məlumatlarını yoxlayın.",
        zodFieldErrors(error),
      );
    }
    return actionFail(databaseErrorMessage(error));
  }
}

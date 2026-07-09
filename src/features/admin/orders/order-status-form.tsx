"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components";
import { orderStatusLabels, orderStatusOrder } from "@/shared/constants/labels";
import { inputClass } from "@/features/admin/form-ui";
import { updateOrderStatusAction } from "@/features/admin/orders/order-actions";

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const save = () => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, status);
      toast(result.message, result.ok ? "success" : "error");
      if (result.ok) router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className={`${inputClass} pr-8`}
      >
        {orderStatusOrder.map((value) => (
          <option key={value} value={value}>
            {orderStatusLabels[value]}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={save}
        disabled={pending || status === currentStatus}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-50"
      >
        {pending ? "Gözləyin…" : "Statusu yenilə"}
      </button>
    </div>
  );
}

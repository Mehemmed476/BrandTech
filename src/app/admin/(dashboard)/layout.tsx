import type { ReactNode } from "react";
import { AdminShell } from "@/features/admin/admin-shell";
import { requireAdmin } from "@/shared/lib/auth";
import { safeQuery } from "@/shared/lib/safe-query";
import { getPendingOrderCount } from "@/shared/services/orders/order.service";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();
  const pendingOrders = await safeQuery(getPendingOrderCount, 0);

  return (
    <AdminShell user={user} pendingOrders={pendingOrders}>
      {children}
    </AdminShell>
  );
}

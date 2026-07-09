import type { ReactNode } from "react";
import { AdminShell } from "@/features/admin/admin-shell";
import { requireAdmin } from "@/shared/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();
  return <AdminShell user={user}>{children}</AdminShell>;
}

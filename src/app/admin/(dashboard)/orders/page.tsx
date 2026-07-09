import type { Metadata } from "next";
import {
  AdminOrdersPage,
  type OrderSearchParams,
} from "@/features/admin/orders/order-list";

export const metadata: Metadata = { title: "Sifarişlər" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<OrderSearchParams>;
}) {
  const params = await searchParams;
  return <AdminOrdersPage searchParams={params} />;
}

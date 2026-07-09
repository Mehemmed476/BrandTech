import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderDetail } from "@/features/admin/orders/order-detail";
import { getAdminOrderById } from "@/shared/services/orders/order.service";

export const metadata: Metadata = { title: "Sifariş detalı" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();
  return <OrderDetail order={order} />;
}

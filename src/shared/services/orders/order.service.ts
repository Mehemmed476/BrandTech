import type { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import { orderCreateSchema } from "@/shared/schemas/order.schema";
import type { Paginated } from "@/shared/types/pagination";

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  status: OrderStatus;
  total: string;
  itemCount: number;
  createdAt: string;
};

export type AdminOrderDetail = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  city: string | null;
  address: string | null;
  note: string | null;
  status: OrderStatus;
  subtotal: string;
  deliveryPrice: string;
  total: string;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    productSku: string | null;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }[];
};

async function generateOrderNumber(
  tx: Prisma.TransactionClient,
): Promise<string> {
  const count = await tx.order.count();
  return `BT-${1000 + count + 1}`;
}

export async function createOrder(
  input: unknown,
): Promise<{ orderNumber: string; id: string }> {
  const data = orderCreateSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const orderNumber = await generateOrderNumber(tx);

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: data.userId || null,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || null,
        city: data.city || null,
        address: data.address || null,
        note: data.note || null,
        subtotal: data.subtotal,
        deliveryPrice: data.deliveryPrice,
        total: data.total,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId || null,
            productName: item.productName,
            productSku: item.productSku || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    // Reduce stock for known products (never below zero).
    for (const item of data.items) {
      if (!item.productId) continue;
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { stock: true },
      });
      if (!product) continue;
      const nextStock = Math.max(0, product.stock - item.quantity);
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: nextStock },
      });
    }

    return { orderNumber, id: order.id };
  });
}

export type AdminOrderQuery = {
  q?: string;
  status?: OrderStatus;
  page?: number;
  pageSize?: number;
};

export async function getAdminOrders(
  query: AdminOrderQuery = {},
): Promise<Paginated<AdminOrderRow>> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 10));

  const where: Prisma.OrderWhereInput = {};
  if (query.q) {
    where.OR = [
      { orderNumber: { contains: query.q, mode: "insensitive" } },
      { customerName: { contains: query.q, mode: "insensitive" } },
      { phone: { contains: query.q, mode: "insensitive" } },
    ];
  }
  if (query.status) where.status = query.status;

  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { items: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    items: rows.map((row) => ({
      id: row.id,
      orderNumber: row.orderNumber,
      customerName: row.customerName,
      phone: row.phone,
      status: row.status,
      total: row.total.toString(),
      itemCount: row._count.items,
      createdAt: row.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAdminOrderById(
  id: string,
): Promise<AdminOrderDetail | null> {
  const row = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!row) return null;
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    customerName: row.customerName,
    phone: row.phone,
    email: row.email,
    city: row.city,
    address: row.address,
    note: row.note,
    status: row.status,
    subtotal: row.subtotal.toString(),
    deliveryPrice: row.deliveryPrice.toString(),
    total: row.total.toString(),
    createdAt: row.createdAt.toISOString(),
    items: row.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      productSku: item.productSku,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      totalPrice: item.totalPrice.toString(),
    })),
  };
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({ where: { id }, data: { status } });
}

export async function getPendingOrderCount(): Promise<number> {
  return prisma.order.count({ where: { status: "PENDING" } });
}

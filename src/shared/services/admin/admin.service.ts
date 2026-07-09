import { prisma } from "@/shared/lib/prisma";
import { PLACEHOLDER_IMAGE } from "@/shared/constants/images";
import { getLowStockProducts } from "@/shared/services/products/product.service";
import { getAdminOrders } from "@/shared/services/orders/order.service";

export type DashboardStats = {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockCount: number;
  revenue: string;
};

export type LatestProduct = {
  id: string;
  name: string;
  image: string;
  price: string;
  categoryName: string;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalProducts,
    totalCategories,
    totalBrands,
    totalOrders,
    pendingOrders,
    lowStockCount,
    revenueAgg,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { stock: { lte: 10 } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
  ]);

  return {
    totalProducts,
    totalCategories,
    totalBrands,
    totalOrders,
    pendingOrders,
    lowStockCount,
    revenue: (revenueAgg._sum.total ?? 0).toString(),
  };
}

export async function getLatestProducts(limit = 5): Promise<LatestProduct[]> {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      category: { select: { name: true } },
      images: {
        orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }],
        take: 1,
      },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    image: row.images[0]?.imageUrl ?? PLACEHOLDER_IMAGE,
    price: row.price.toString(),
    categoryName: row.category.name,
  }));
}

export async function getDashboardData() {
  const [stats, lowStock, latestProducts, latestOrders] = await Promise.all([
    getDashboardStats(),
    getLowStockProducts(10, 5),
    getLatestProducts(5),
    getAdminOrders({ pageSize: 5 }),
  ]);
  return {
    stats,
    lowStock,
    latestProducts,
    latestOrders: latestOrders.items,
  };
}

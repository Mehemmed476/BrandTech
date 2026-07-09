import type {
  BannerPosition,
  OrderStatus,
  ProductStatus,
} from "@prisma/client";

/**
 * Azerbaijani labels for database enums, shared across the storefront and the
 * admin panel so status wording stays consistent everywhere.
 */

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Gözləyir",
  CONFIRMED: "Təsdiqləndi",
  PROCESSING: "Hazırlanır",
  COMPLETED: "Tamamlandı",
  CANCELLED: "Ləğv edildi",
};

export const orderStatusOrder: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];

export const productStatusLabels: Record<ProductStatus, string> = {
  ACTIVE: "Aktiv",
  INACTIVE: "Deaktiv",
  OUT_OF_STOCK: "Stokda yoxdur",
};

export const bannerPositionLabels: Record<BannerPosition, string> = {
  HERO: "Əsas banner",
  CATEGORY: "Kateqoriya",
  PROMO: "Promo",
};

export type StatusTone = "green" | "amber" | "sky" | "rose" | "gray";

export const orderStatusTones: Record<OrderStatus, StatusTone> = {
  PENDING: "amber",
  CONFIRMED: "sky",
  PROCESSING: "amber",
  COMPLETED: "green",
  CANCELLED: "rose",
};

export const productStatusTones: Record<ProductStatus, StatusTone> = {
  ACTIVE: "green",
  INACTIVE: "gray",
  OUT_OF_STOCK: "rose",
};

export function orderStatusLabel(status: OrderStatus): string {
  return orderStatusLabels[status] ?? status;
}

export function productStatusLabel(status: ProductStatus): string {
  return productStatusLabels[status] ?? status;
}

export function bannerPositionLabel(position: BannerPosition): string {
  return bannerPositionLabels[position] ?? position;
}

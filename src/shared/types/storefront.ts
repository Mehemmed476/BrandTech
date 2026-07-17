export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
};

export type StoreBrand = {
  id: string;
  name: string;
  slug: string;
};

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  brand: StoreBrand;
  category: StoreCategory;
  description: string;
  price: string;
  oldPrice?: string | null;
  stock: number;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  isFeatured: boolean;
  isNew: boolean;
  images: string[];
  specifications: Array<{
    key: string;
    value: string;
  }>;
};

export type StoreBanner = {
  id: string;
  title: string;
  subtitle?: string;
  badgeText: string;
  imageUrl: string;
  linkUrl?: string;
  position: "HERO" | "CATEGORY" | "PROMO";
  showBadge: boolean;
  showTitle: boolean;
  showSubtitle: boolean;
  showPrimaryButton: boolean;
  showSecondaryButton: boolean;
};

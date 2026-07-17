import type { Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import { PLACEHOLDER_IMAGE } from "@/shared/constants/images";
import {
  productCreateSchema,
  productUpdateSchema,
} from "@/shared/schemas/product.schema";
import type { ProductCreateInput } from "@/shared/types/catalog.types";
import type { Paginated } from "@/shared/types/pagination";
import type { StoreProduct } from "@/shared/types/storefront";

const storeInclude = {
  brand: true,
  category: true,
  images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }] },
  specifications: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof storeInclude;
}>;

// -------------------------------------------------------------------------
// View models
// -------------------------------------------------------------------------

export type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: string;
  oldPrice: string | null;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  brandName: string | null;
  categoryName: string;
  image: string;
};

export type AdminProductDetail = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  oldPrice: string;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  categoryId: string;
  brandId: string;
  images: { imageUrl: string; altText: string; isMain: boolean }[];
  specifications: { key: string; value: string }[];
};

function mapStoreProduct(row: ProductWithRelations): StoreProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku ?? undefined,
    brand: row.brand
      ? { id: row.brand.id, name: row.brand.name, slug: row.brand.slug }
      : { id: "", name: "Brendsiz", slug: "" },
    category: {
      id: row.category.id,
      name: row.category.name,
      slug: row.category.slug,
      productCount: 0,
    },
    description: row.description ?? "",
    price: row.price.toString(),
    oldPrice: row.oldPrice ? row.oldPrice.toString() : null,
    stock: row.stock,
    status: row.status,
    isFeatured: row.isFeatured,
    isNew: row.isNew,
    images:
      row.images.length > 0
        ? row.images.map((image) => image.imageUrl)
        : [PLACEHOLDER_IMAGE],
    specifications: row.specifications.map((spec) => ({
      key: spec.key,
      value: spec.value,
    })),
  };
}

function mapAdminRow(row: ProductWithRelations): AdminProductRow {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    price: row.price.toString(),
    oldPrice: row.oldPrice ? row.oldPrice.toString() : null,
    stock: row.stock,
    status: row.status,
    isFeatured: row.isFeatured,
    isNew: row.isNew,
    brandName: row.brand?.name ?? null,
    categoryName: row.category.name,
    image: row.images[0]?.imageUrl ?? PLACEHOLDER_IMAGE,
  };
}

// -------------------------------------------------------------------------
// Storefront reads
// -------------------------------------------------------------------------

export type StoreProductQuery = {
  q?: string;
  category?: string; // slug
  brand?: string; // slug
  brands?: string[]; // slugs (multi-select)
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  onSale?: boolean;
  sort?: "featured" | "newest" | "price-asc" | "price-desc" | "name";
  page?: number;
  pageSize?: number;
};

function storeOrderBy(
  sort: StoreProductQuery["sort"],
): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return [{ createdAt: "desc" }];
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "name":
      return [{ name: "asc" }];
    default:
      return [{ isFeatured: "desc" }, { createdAt: "desc" }];
  }
}

export async function getStoreProducts(
  query: StoreProductQuery = {},
): Promise<Paginated<StoreProduct>> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, query.pageSize ?? 12));

  const where: Prisma.ProductWhereInput = { status: { not: "INACTIVE" } };
  if (query.q) {
    where.OR = [
      { name: { contains: query.q, mode: "insensitive" } },
      { sku: { contains: query.q, mode: "insensitive" } },
      { brand: { name: { contains: query.q, mode: "insensitive" } } },
      { category: { name: { contains: query.q, mode: "insensitive" } } },
    ];
  }
  if (query.category) where.category = { slug: query.category };
  if (query.brands && query.brands.length > 0) {
    where.brand = { slug: { in: query.brands } };
  } else if (query.brand) {
    where.brand = { slug: query.brand };
  }
  if (query.minPrice != null || query.maxPrice != null) {
    where.price = {};
    if (query.minPrice != null) where.price.gte = query.minPrice;
    if (query.maxPrice != null) where.price.lte = query.maxPrice;
  }
  if (query.inStock) where.stock = { gt: 0 };
  if (query.isNew) where.isNew = true;
  if (query.isFeatured) where.isFeatured = true;
  if (query.onSale) where.oldPrice = { not: null };

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: storeInclude,
      orderBy: storeOrderBy(query.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: rows.map(mapStoreProduct),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getFeaturedProducts(limit = 8): Promise<StoreProduct[]> {
  const rows = await prisma.product.findMany({
    where: { isFeatured: true, status: { not: "INACTIVE" } },
    include: storeInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapStoreProduct);
}

export async function getNewProducts(limit = 8): Promise<StoreProduct[]> {
  const rows = await prisma.product.findMany({
    where: { isNew: true, status: { not: "INACTIVE" } },
    include: storeInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapStoreProduct);
}

export async function getStoreProductBySlug(
  slug: string,
): Promise<StoreProduct | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: storeInclude,
  });
  return row ? mapStoreProduct(row) : null;
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<StoreProduct[]> {
  const rows = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
      status: { not: "INACTIVE" },
    },
    include: storeInclude,
    take: limit,
  });
  return rows.map(mapStoreProduct);
}

// -------------------------------------------------------------------------
// Admin reads
// -------------------------------------------------------------------------

export type AdminProductQuery = {
  q?: string;
  categoryId?: string;
  brandId?: string;
  status?: ProductStatus;
  page?: number;
  pageSize?: number;
};

export async function getAdminProducts(
  query: AdminProductQuery = {},
): Promise<Paginated<AdminProductRow>> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 10));

  const where: Prisma.ProductWhereInput = {};
  if (query.q) {
    where.OR = [
      { name: { contains: query.q, mode: "insensitive" } },
      { sku: { contains: query.q, mode: "insensitive" } },
    ];
  }
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.brandId) where.brandId = query.brandId;
  if (query.status) where.status = query.status;

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: storeInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: rows.map(mapAdminRow),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAdminProductById(
  id: string,
): Promise<AdminProductDetail | null> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: storeInclude,
  });
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku ?? "",
    description: row.description ?? "",
    price: row.price.toString(),
    oldPrice: row.oldPrice ? row.oldPrice.toString() : "",
    stock: row.stock,
    status: row.status,
    isFeatured: row.isFeatured,
    isNew: row.isNew,
    categoryId: row.categoryId,
    brandId: row.brandId ?? "",
    images: row.images.map((image) => ({
      imageUrl: image.imageUrl,
      altText: image.altText ?? "",
      isMain: image.isMain,
    })),
    specifications: row.specifications.map((spec) => ({
      key: spec.key,
      value: spec.value,
    })),
  };
}

// -------------------------------------------------------------------------
// Dashboard helpers
// -------------------------------------------------------------------------

export async function getLowStockProducts(
  threshold = 10,
  limit = 5,
): Promise<AdminProductRow[]> {
  const rows = await prisma.product.findMany({
    where: { stock: { lte: threshold } },
    include: storeInclude,
    orderBy: { stock: "asc" },
    take: limit,
  });
  return rows.map(mapAdminRow);
}

// -------------------------------------------------------------------------
// Mutations
// -------------------------------------------------------------------------

function pickMainIndex(images: ProductCreateInput["images"]): number {
  const explicit = images.findIndex((image) => image.isMain);
  return explicit >= 0 ? explicit : 0;
}

export async function createProduct(input: unknown) {
  const data = productCreateSchema.parse(input);
  const mainIndex = pickMainIndex(data.images);

  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      sku: data.sku || null,
      description: data.description || null,
      price: data.price,
      oldPrice: data.oldPrice ?? null,
      stock: data.stock,
      status: data.status,
      isFeatured: data.isFeatured,
      isNew: data.isNew,
      categoryId: data.categoryId,
      brandId: data.brandId || null,
      images: {
        create: data.images.map((image, index) => ({
          imageUrl: image.imageUrl,
          altText: image.altText || null,
          sortOrder: index,
          isMain: index === mainIndex,
        })),
      },
      specifications: {
        create: data.specifications.map((spec, index) => ({
          key: spec.key,
          value: spec.value,
          sortOrder: index,
        })),
      },
    },
  });
}

export async function updateProduct(id: string, input: unknown) {
  const data = productUpdateSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku !== undefined ? data.sku || null : undefined,
        description:
          data.description !== undefined ? data.description || null : undefined,
        price: data.price,
        oldPrice:
          data.oldPrice !== undefined ? (data.oldPrice ?? null) : undefined,
        stock: data.stock,
        status: data.status,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        categoryId: data.categoryId,
        brandId: data.brandId !== undefined ? data.brandId || null : undefined,
      },
    });

    if (data.images) {
      const mainIndex = pickMainIndex(data.images);
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((image, index) => ({
            productId: id,
            imageUrl: image.imageUrl,
            altText: image.altText || null,
            sortOrder: index,
            isMain: index === mainIndex,
          })),
        });
      }
    }

    if (data.specifications) {
      await tx.productSpecification.deleteMany({ where: { productId: id } });
      if (data.specifications.length > 0) {
        await tx.productSpecification.createMany({
          data: data.specifications.map((spec, index) => ({
            productId: id,
            key: spec.key,
            value: spec.value,
            sortOrder: index,
          })),
        });
      }
    }
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: string;
  image: string;
  brandName: string | null;
};

/** Lightweight product search for the live autocomplete dropdown. */
export async function searchProducts(
  q: string,
  limit = 6,
): Promise<SearchResult[]> {
  const term = q.trim();
  if (term.length < 2) return [];

  const rows = await prisma.product.findMany({
    where: {
      status: { not: "INACTIVE" },
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { sku: { contains: term, mode: "insensitive" } },
        { brand: { name: { contains: term, mode: "insensitive" } } },
        { category: { name: { contains: term, mode: "insensitive" } } },
      ],
    },
    include: {
      brand: { select: { name: true } },
      images: {
        orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }],
        take: 1,
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price.toString(),
    image: row.images[0]?.imageUrl ?? PLACEHOLDER_IMAGE,
    brandName: row.brand?.name ?? null,
  }));
}

/** Slugs + last-modified dates for the sitemap. */
export async function getProductSitemapData() {
  return prisma.product.findMany({
    where: { status: { not: "INACTIVE" } },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

import Image from "next/image";
import { PackageSearch, Plus } from "lucide-react";
import type { ProductStatus } from "@prisma/client";
import { ButtonLink, EmptyState } from "@/shared/components";
import {
  AdminPageHeader,
  EditLink,
  StatusPill,
  TableCard,
  tdClass,
  thClass,
} from "@/features/admin/admin-ui";
import { DeleteAction } from "@/features/admin/delete-action";
import { Pagination } from "@/features/admin/pagination";
import { ProductFilters } from "@/features/admin/products/product-filters";
import { deleteProductAction } from "@/features/admin/products/product-actions";
import {
  productStatusLabel,
  productStatusTones,
} from "@/shared/constants/labels";
import { formatPrice } from "@/shared/utils/format-price";
import { getAdminProducts } from "@/shared/services/products/product.service";
import { getCategoryOptions } from "@/shared/services/categories/category.service";
import { getBrandOptions } from "@/shared/services/brands/brand.service";

export type ProductSearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  status?: string;
  page?: string;
};

export async function AdminProductsPage({
  searchParams,
}: {
  searchParams: ProductSearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const [products, categoryOptions, brandOptions] = await Promise.all([
    getAdminProducts({
      q: searchParams.q,
      categoryId: searchParams.category,
      brandId: searchParams.brand,
      status: (searchParams.status as ProductStatus) || undefined,
      page,
    }),
    getCategoryOptions(),
    getBrandOptions(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Məhsullar"
        description={`${products.total} məhsul`}
        action={
          <ButtonLink href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Məhsul əlavə et
          </ButtonLink>
        }
      />

      <ProductFilters
        categoryOptions={categoryOptions}
        brandOptions={brandOptions}
      />

      {products.items.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="h-8 w-8" />}
          title="Məhsul tapılmadı"
          description="Filtri dəyişin və ya yeni məhsul əlavə edin."
          action={
            <ButtonLink href="/admin/products/new">Məhsul əlavə et</ButtonLink>
          }
        />
      ) : (
        <>
          <TableCard title="Bütün məhsullar">
            <table className="w-full min-w-[820px]">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className={thClass}>Məhsul</th>
                  <th className={thClass}>Brend</th>
                  <th className={thClass}>Kateqoriya</th>
                  <th className={thClass}>Qiymət</th>
                  <th className={thClass}>Stok</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.items.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-gray-50/60"
                  >
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-white p-1">
                          <Image
                            alt=""
                            src={product.image}
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        </div>
                        <span className="max-w-[240px] truncate font-semibold text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className={tdClass}>{product.brandName ?? "—"}</td>
                    <td className={tdClass}>{product.categoryName}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>
                      {formatPrice(product.price)}
                    </td>
                    <td className={tdClass}>{product.stock}</td>
                    <td className={tdClass}>
                      <StatusPill
                        label={productStatusLabel(product.status)}
                        tone={productStatusTones[product.status]}
                      />
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center justify-end gap-1.5">
                        <EditLink href={`/admin/products/${product.id}/edit`} />
                        <DeleteAction
                          action={deleteProductAction.bind(null, product.id)}
                          title="Məhsulu sil"
                          description={`"${product.name}" məhsulunu silmək istədiyinizə əminsiniz?`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
          <Pagination page={products.page} totalPages={products.totalPages} />
        </>
      )}
    </div>
  );
}

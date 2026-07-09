import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  Clock,
  FolderTree,
  Package,
  Plus,
  Tag,
  Wallet,
} from "lucide-react";
import { ButtonLink } from "@/shared/components";
import {
  AdminPageHeader,
  StatCard,
  StatusPill,
  TableCard,
  tdClass,
  thClass,
} from "@/features/admin/admin-ui";
import { orderStatusLabel, orderStatusTones } from "@/shared/constants/labels";
import { formatPrice } from "@/shared/utils/format-price";
import { formatDate } from "@/shared/utils/format-date";
import { getDashboardData } from "@/shared/services/admin/admin.service";

export async function AdminDashboardPage() {
  const { stats, lowStock, latestProducts, latestOrders } =
    await getDashboardData();

  return (
    <div>
      <AdminPageHeader
        title="İdarə paneli"
        description="Mağazanızın qısa xülasəsi."
        action={
          <ButtonLink href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Məhsul əlavə et
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Məhsullar"
          value={String(stats.totalProducts)}
          icon={Package}
        />
        <StatCard
          label="Kateqoriyalar"
          value={String(stats.totalCategories)}
          icon={FolderTree}
        />
        <StatCard
          label="Brendlər"
          value={String(stats.totalBrands)}
          icon={Tag}
        />
        <StatCard
          label="Sifarişlər"
          value={String(stats.totalOrders)}
          icon={ClipboardList}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Gözləyən sifarişlər"
          value={String(stats.pendingOrders)}
          icon={Clock}
        />
        <StatCard
          label="Az stok"
          value={String(stats.lowStockCount)}
          icon={Boxes}
        />
        <StatCard
          label="Gəlir (ümumi)"
          value={formatPrice(stats.revenue)}
          icon={Wallet}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <TableCard
          title="Son sifarişlər"
          action={
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              Hamısı
            </Link>
          }
        >
          {latestOrders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              Hələ sifariş yoxdur.
            </p>
          ) : (
            <table className="w-full min-w-[520px]">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className={thClass}>Sifariş</th>
                  <th className={thClass}>Müştəri</th>
                  <th className={thClass}>Cəmi</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Tarix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {latestOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-gray-50/60">
                    <td className={`${tdClass} font-bold text-gray-900`}>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:text-brand-700"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className={tdClass}>{order.customerName}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>
                      {formatPrice(order.total)}
                    </td>
                    <td className={tdClass}>
                      <StatusPill
                        label={orderStatusLabel(order.status)}
                        tone={orderStatusTones[order.status]}
                      />
                    </td>
                    <td className={tdClass}>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableCard>

        <div className="space-y-5">
          <section className="rounded-2xl border border-gray-100 bg-white shadow-soft">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <Boxes className="h-5 w-5 text-brand-600" />
              <h2 className="font-bold text-gray-900">Az stokda</h2>
            </div>
            {lowStock.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-gray-400">
                Az stokda məhsul yoxdur.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {lowStock.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-white p-1">
                      <Image
                        alt=""
                        src={product.image}
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>
                    <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
                      {product.name}
                    </p>
                    <span className="shrink-0 text-sm font-bold text-amber-600">
                      {product.stock}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white shadow-soft">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <Package className="h-5 w-5 text-brand-600" />
              <h2 className="font-bold text-gray-900">Son məhsullar</h2>
            </div>
            {latestProducts.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-gray-400">
                Hələ məhsul yoxdur.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {latestProducts.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-white p-1">
                      <Image
                        alt=""
                        src={product.image}
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {product.categoryName}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

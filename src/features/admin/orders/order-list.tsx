import Link from "next/link";
import { ClipboardList, Eye } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { EmptyState } from "@/shared/components";
import {
  AdminPageHeader,
  StatusPill,
  TableCard,
  tdClass,
  thClass,
} from "@/features/admin/admin-ui";
import { Pagination } from "@/features/admin/pagination";
import { OrderFilters } from "@/features/admin/orders/order-filters";
import { orderStatusLabel, orderStatusTones } from "@/shared/constants/labels";
import { formatPrice } from "@/shared/utils/format-price";
import { formatDate } from "@/shared/utils/format-date";
import { getAdminOrders } from "@/shared/services/orders/order.service";

export type OrderSearchParams = {
  q?: string;
  status?: string;
  page?: string;
};

export async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: OrderSearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const orders = await getAdminOrders({
    q: searchParams.q,
    status: (searchParams.status as OrderStatus) || undefined,
    page,
  });

  return (
    <div>
      <AdminPageHeader
        title="Sifarişlər"
        description={`${orders.total} sifariş`}
      />

      <OrderFilters />

      {orders.items.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-8 w-8" />}
          title="Sifariş tapılmadı"
          description="Hələ sifariş yoxdur və ya filtr uyğun deyil."
        />
      ) : (
        <>
          <TableCard title="Bütün sifarişlər">
            <table className="w-full min-w-[720px]">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className={thClass}>Sifariş</th>
                  <th className={thClass}>Müştəri</th>
                  <th className={thClass}>Telefon</th>
                  <th className={thClass}>Məhsul</th>
                  <th className={thClass}>Cəmi</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Tarix</th>
                  <th className={`${thClass} text-right`}>Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.items.map((order) => (
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
                    <td className={tdClass}>{order.phone}</td>
                    <td className={tdClass}>{order.itemCount}</td>
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
                    <td className={tdClass}>
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          aria-label="Bax"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-brand-300 hover:text-brand-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
          <Pagination page={orders.page} totalPages={orders.totalPages} />
        </>
      )}
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft, MapPin, Phone, StickyNote, User } from "lucide-react";
import {
  StatusPill,
  TableCard,
  tdClass,
  thClass,
} from "@/features/admin/admin-ui";
import { OrderStatusForm } from "@/features/admin/orders/order-status-form";
import { orderStatusLabel, orderStatusTones } from "@/shared/constants/labels";
import { formatPrice } from "@/shared/utils/format-price";
import { formatDateTime } from "@/shared/utils/format-date";
import type { AdminOrderDetail } from "@/shared/services/orders/order.service";

export function OrderDetail({ order }: { order: AdminOrderDetail }) {
  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Sifarişlərə qayıt
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <StatusPill
          label={orderStatusLabel(order.status)}
          tone={orderStatusTones[order.status]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <TableCard title="Sifariş məhsulları">
            <table className="w-full min-w-[520px]">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className={thClass}>Məhsul</th>
                  <th className={thClass}>Say</th>
                  <th className={thClass}>Qiymət</th>
                  <th className={`${thClass} text-right`}>Cəmi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className={tdClass}>
                      <p className="font-semibold text-gray-900">
                        {item.productName}
                      </p>
                      {item.productSku ? (
                        <p className="text-xs text-gray-400">
                          {item.productSku}
                        </p>
                      ) : null}
                    </td>
                    <td className={tdClass}>{item.quantity}</td>
                    <td className={tdClass}>{formatPrice(item.unitPrice)}</td>
                    <td
                      className={`${tdClass} text-right font-semibold text-gray-900`}
                    >
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>

          {order.note ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
              <div className="mb-2 flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-brand-600" />
                <h2 className="font-bold text-gray-900">Qeyd</h2>
              </div>
              <p className="text-sm text-gray-600">{order.note}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
            <h2 className="mb-4 font-bold text-gray-900">Müştəri məlumatı</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-brand-600" />
                {order.customerName}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-600" />
                {order.phone}
              </li>
              {order.email ? (
                <li className="pl-6.5 text-gray-500">{order.email}</li>
              ) : null}
              {order.city || order.address ? (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>
                    {[order.city, order.address].filter(Boolean).join(", ")}
                  </span>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
            <h2 className="mb-4 font-bold text-gray-900">Hesab</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ara cəm</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Çatdırılma</span>
                <span className="font-semibold text-gray-900">
                  {Number(order.deliveryPrice) === 0
                    ? "Pulsuz"
                    : formatPrice(order.deliveryPrice)}
                </span>
              </div>
              <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                <span className="font-bold text-gray-900">Cəmi</span>
                <span className="text-xl font-black text-gray-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
            <h2 className="mb-4 font-bold text-gray-900">Statusu dəyiş</h2>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

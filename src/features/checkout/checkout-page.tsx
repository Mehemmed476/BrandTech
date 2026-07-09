"use client";

import Image from "next/image";
import { useState, useTransition, type FormEvent } from "react";
import {
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { ButtonLink, EmptyState, useToast } from "@/shared/components";
import { useCart } from "@/features/cart/cart-context";
import { placeOrderAction } from "@/features/checkout/checkout-actions";
import { formatPrice } from "@/shared/utils/format-price";

const FREE_DELIVERY_THRESHOLD = 150;

const contactFields = [
  { label: "Ad Soyad", name: "customerName", type: "text", required: true },
  { label: "Telefon", name: "phone", type: "tel", required: true },
  { label: "E-poçt", name: "email", type: "email", required: false },
];

const deliveryFields = [
  { label: "Şəhər", name: "city", type: "text", required: false },
  { label: "Ünvan", name: "address", type: "text", required: false },
];

export function CheckoutPage() {
  const { items, subtotal, isReady, clearCart } = useCart();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 10;
  const total = subtotal + delivery;

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const input = {
        customerName: form.customerName,
        phone: form.phone,
        email: form.email || null,
        city: form.city || null,
        address: form.address || null,
        note: form.note || null,
        subtotal,
        deliveryPrice: delivery,
        total,
        items: items.map((line) => ({
          productId: line.id,
          productName: line.name,
          quantity: line.quantity,
          unitPrice: line.price,
          totalPrice: line.price * line.quantity,
        })),
      };
      const result = await placeOrderAction(input);
      if (result.ok) {
        setOrderNumber(String(result.data?.orderNumber ?? ""));
        clearCart();
        toast(result.message, "success");
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        setErrors(result.fieldErrors ?? {});
        toast(result.message, "error");
      }
    });
  };

  if (orderNumber) {
    return (
      <main className="container-page py-14">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
            <PackageCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-black tracking-tight text-gray-900">
            Sifariş qəbul edildi
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
            Sifariş nömrəniz{" "}
            <span className="font-bold text-brand-700">{orderNumber}</span>.
            Komandamız təsdiq üçün tezliklə sizinlə əlaqə saxlayacaq. Ödəniş
            çatdırılma zamanı və ya mağazada.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/products">Alışa davam et</ButtonLink>
            <ButtonLink href="/" variant="outline">
              Ana səhifə
            </ButtonLink>
          </div>
        </div>
      </main>
    );
  }

  if (isReady && items.length === 0) {
    return (
      <main className="container-page py-14">
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title="Səbətiniz boşdur"
          description="Sifariş vermək üçün əvvəlcə məhsul əlavə edin."
          action={<ButtonLink href="/products">Məhsullara bax</ButtonLink>}
        />
      </main>
    );
  }

  return (
    <main className="container-page py-8">
      <h1 className="text-3xl font-black tracking-tight text-gray-900">
        Sifarişi tamamla
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Onlayn ödəniş yoxdur — ödəniş çatdırılma zamanı və ya mağazada.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <UserRound className="h-5 w-5" />
              </span>
              <h2 className="font-bold text-gray-900">Müştəri məlumatları</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {contactFields.map((field) => (
                <label
                  key={field.name}
                  className="grid gap-1.5 text-sm font-semibold text-gray-700"
                >
                  <span>
                    {field.label}
                    {field.required ? (
                      <span className="text-rose-500"> *</span>
                    ) : (
                      <span className="ml-1 text-xs font-normal text-gray-400">
                        (könüllü)
                      </span>
                    )}
                  </span>
                  <input
                    type={field.type}
                    required={field.required}
                    value={form[field.name as keyof typeof form]}
                    onChange={(event) =>
                      update(
                        field.name as keyof typeof form,
                        event.target.value,
                      )
                    }
                    className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm font-normal text-gray-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                  />
                  {errors[field.name] ? (
                    <span className="text-xs font-medium text-rose-600">
                      {errors[field.name]}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <MapPin className="h-5 w-5" />
              </span>
              <h2 className="font-bold text-gray-900">Çatdırılma məlumatı</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {deliveryFields.map((field) => (
                <label
                  key={field.name}
                  className="grid gap-1.5 text-sm font-semibold text-gray-700"
                >
                  {field.label}
                  <input
                    type={field.type}
                    value={form[field.name as keyof typeof form]}
                    onChange={(event) =>
                      update(
                        field.name as keyof typeof form,
                        event.target.value,
                      )
                    }
                    className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm font-normal text-gray-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                  />
                </label>
              ))}
            </div>
            <label className="mt-4 grid gap-1.5 text-sm font-semibold text-gray-700">
              Qeyd
              <span className="text-xs font-normal text-gray-400">
                (könüllü)
              </span>
              <textarea
                rows={3}
                value={form.note}
                onChange={(event) => update("note", event.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm font-normal text-gray-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                placeholder="Çatdırılma barədə bilməli olduğumuz nəsə var?"
              />
            </label>
          </section>

          <section className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gradient-to-br from-brand-50 to-white p-5 shadow-soft">
            <CreditCard className="h-6 w-6 shrink-0 text-brand-600" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                Çatdırılma zamanı nağd ödəniş.
              </span>{" "}
              Sifarişiniz çatanda və ya mağazada ödəyirsiniz. Kart tələb
              olunmur.
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-gray-900">
              Sifariş xülasəsi
            </h2>
            <div className="mt-5 space-y-4">
              {items.map((line) => (
                <div className="flex gap-3" key={line.id}>
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-white p-1.5">
                    <Image
                      alt=""
                      src={line.image}
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {line.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {line.quantity} ədəd
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {formatPrice(line.price * line.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ara cəm</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Çatdırılma</span>
                <span className="font-semibold text-gray-900">
                  {delivery === 0 ? "Pulsuz" : formatPrice(delivery)}
                </span>
              </div>
              <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                <span className="font-bold text-gray-900">Cəmi</span>
                <span className="text-2xl font-black tracking-tight text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending || items.length === 0}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-60"
            >
              <CheckCircle2 className="h-5 w-5" />
              {pending ? "Göndərilir…" : "Sifarişi təsdiqlə"}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              Təsdiqləməklə sifarişlə bağlı sizinlə əlaqə saxlanılmasına razı
              olursunuz.
            </p>
          </div>
        </aside>
      </form>
    </main>
  );
}

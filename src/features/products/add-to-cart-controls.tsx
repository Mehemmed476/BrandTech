"use client";

import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart, type AddToCartInput } from "@/features/cart/cart-context";
import { useToast } from "@/shared/components";

export function AddToCartControls({
  item,
  disabled,
}: {
  item: AddToCartInput;
  disabled?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  const cap = Math.max(1, item.stock);

  const handleAdd = () => {
    addItem(item, quantity);
    toast(`${item.name} səbətə əlavə edildi.`, "success");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="inline-flex h-12 items-center justify-between gap-1 rounded-xl border border-gray-200 bg-gray-50 px-1.5">
        <button
          type="button"
          aria-label="Sayı azalt"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          disabled={disabled || quantity <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-9 text-center font-bold text-gray-900">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Sayı artır"
          onClick={() => setQuantity((value) => Math.min(cap, value + 1))}
          disabled={disabled || quantity >= cap}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 hover:shadow-card active:bg-brand-800 disabled:pointer-events-none disabled:bg-gray-200 disabled:text-gray-400"
      >
        <ShoppingCart className="h-5 w-5" />
        {disabled ? "Stokda yoxdur" : "Səbətə əlavə et"}
      </button>

      <button
        type="button"
        aria-label="Sevimlilərə əlavə et"
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-soft transition hover:border-rose-200 hover:text-rose-500"
      >
        <Heart className="h-5 w-5" />
      </button>
    </div>
  );
}

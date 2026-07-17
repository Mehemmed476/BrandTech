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
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <div className="inline-flex h-10 items-center justify-between gap-0.5 rounded-xl border border-gray-200 bg-gray-50 px-1">
        <button
          type="button"
          aria-label="Sayı azalt"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          disabled={disabled || quantity <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-7 text-center text-sm font-bold text-gray-900">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Sayı artır"
          onClick={() => setQuantity((value) => Math.min(cap, value + 1))}
          disabled={disabled || quantity >= cap}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 hover:shadow-card active:bg-brand-800 disabled:pointer-events-none disabled:bg-gray-200 disabled:text-gray-400"
      >
        <ShoppingCart className="h-4.5 w-4.5" />
        {disabled ? "Stokda yoxdur" : "Səbətə əlavə et"}
      </button>

      <button
        type="button"
        aria-label="Sevimlilərə əlavə et"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-soft transition hover:border-rose-200 hover:text-rose-500"
      >
        <Heart className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}

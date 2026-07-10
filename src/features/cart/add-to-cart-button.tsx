"use client";

import { ShoppingCart } from "lucide-react";
import { useCart, type AddToCartInput } from "@/features/cart/cart-context";
import { useToast } from "@/shared/components";
import { cn } from "@/shared/utils/cn";

export function AddToCartButton({
  item,
  quantity = 1,
  disabled,
  label = "Səbətə əlavə et",
  className,
  iconOnly = false,
}: {
  item: AddToCartInput;
  quantity?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleClick = () => {
    addItem(item, quantity);
    toast(`${item.name} səbətə əlavə edildi.`, "success");
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-label={disabled ? "Stokda yoxdur" : label}
        className={cn(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft transition-all duration-200 hover:bg-brand-700 active:bg-brand-800 disabled:pointer-events-none disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none",
          className,
        )}
      >
        <ShoppingCart className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:bg-brand-700 hover:shadow-card active:bg-brand-800 disabled:pointer-events-none disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none",
        className,
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      {disabled ? "Stokda yoxdur" : label}
    </button>
  );
}

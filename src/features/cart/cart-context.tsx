"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  id: string; // productId
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
};

export type AddToCartInput = Omit<CartLine, "quantity">;

type CartContextValue = {
  items: CartLine[];
  totalItems: number;
  subtotal: number;
  isReady: boolean;
  addItem: (item: AddToCartInput, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "bt-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function clampQuantity(quantity: number, stock: number) {
  const max = stock > 0 ? stock : 99;
  return Math.min(Math.max(1, Math.round(quantity)), max);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Hydrate the cart from localStorage once on mount. We intentionally set
  // state here (rather than a lazy initializer) so the server render stays
  // empty and there is no hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((line) => line && line.id));
        }
      }
    } catch {
      // Ignore malformed storage.
    }
    setIsReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist on change (after initial load).
  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota / private mode errors.
    }
  }, [items, isReady]);

  const addItem = useCallback((item: AddToCartInput, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.id === item.id
            ? {
                ...line,
                quantity: clampQuantity(line.quantity + quantity, item.stock),
              }
            : line,
        );
      }
      return [
        ...prev,
        { ...item, quantity: clampQuantity(quantity, item.stock) },
      ];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((line) =>
        line.id === id
          ? { ...line, quantity: clampQuantity(quantity, line.stock) }
          : line,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = items.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0,
    );
    return {
      items,
      totalItems,
      subtotal,
      isReady,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [items, isReady, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

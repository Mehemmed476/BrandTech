import type { Metadata } from "next";
import { CartPage } from "@/features/cart/cart-page";

export const metadata: Metadata = {
  title: "Səbət",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CartPage />;
}

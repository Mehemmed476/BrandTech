import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Sifarişi tamamla",
};

export default function Page() {
  return <CheckoutPage />;
}

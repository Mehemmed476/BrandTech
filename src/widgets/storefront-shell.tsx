import type { ReactNode } from "react";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";
import { CartProvider } from "@/features/cart/cart-context";
import { ToastProvider } from "@/shared/components";
import type { StoreCategory } from "@/shared/types/storefront";
import type { StoreSettings } from "@/shared/types/settings";

export function StorefrontShell({
  children,
  settings,
  categories,
}: {
  children: ReactNode;
  settings: StoreSettings;
  categories: StoreCategory[];
}) {
  return (
    <CartProvider>
      <ToastProvider>
        <div className="flex min-h-screen flex-col bg-canvas">
          <SiteHeader settings={settings} categories={categories} />
          <div className="flex-1">{children}</div>
          <SiteFooter settings={settings} categories={categories} />
        </div>
      </ToastProvider>
    </CartProvider>
  );
}

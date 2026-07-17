import type { CSSProperties, ReactNode } from "react";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";
import { CartProvider } from "@/features/cart/cart-context";
import { ToastProvider } from "@/shared/components";
import type { StoreCategory } from "@/shared/types/storefront";
import type { StoreSettings } from "@/shared/types/settings";

const circuitRailStyle: CSSProperties = {
  backgroundImage: 'url("/circuit-pattern.svg")',
  backgroundPosition: "right top",
  backgroundRepeat: "repeat-y",
  backgroundSize: "clamp(22rem, 42vw, 32rem) auto",
  opacity: 0.22,
};

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
        <div className="relative isolate flex min-h-screen flex-col bg-canvas">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          >
            <span
              data-circuit-rail="left"
              className="absolute inset-y-0 -left-10 w-[min(32rem,42vw)] -scale-x-100"
              style={circuitRailStyle}
            />
            <span
              data-circuit-rail="right"
              className="absolute inset-y-0 -right-10 w-[min(32rem,42vw)]"
              style={circuitRailStyle}
            />
          </div>

          <div className="relative z-10">
            <SiteHeader settings={settings} categories={categories} />
          </div>
          <div className="relative z-10 flex-1">{children}</div>
          <div className="relative z-10">
            <SiteFooter settings={settings} categories={categories} />
          </div>
        </div>
      </ToastProvider>
    </CartProvider>
  );
}

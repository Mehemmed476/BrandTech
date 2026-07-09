import type { ReactNode } from "react";
import { StorefrontShell } from "@/widgets";
import { safeQuery } from "@/shared/lib/safe-query";
import { getStoreSettings } from "@/shared/services/settings/settings.service";
import { getActiveCategories } from "@/shared/services/categories/category.service";
import { defaultStoreSettings } from "@/shared/types/settings";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    safeQuery(getStoreSettings, defaultStoreSettings),
    safeQuery(getActiveCategories, []),
  ]);

  return (
    <StorefrontShell settings={settings} categories={categories}>
      {children}
    </StorefrontShell>
  );
}

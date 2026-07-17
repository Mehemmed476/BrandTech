import type { ReactNode } from "react";
import { StorefrontShell } from "@/widgets";
import { JsonLd } from "@/shared/components";
import { safeQuery } from "@/shared/lib/safe-query";
import { siteConfig } from "@/shared/config/site";
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

  const socials = [
    settings.instagram,
    settings.facebook,
    settings.youtube,
  ].filter((value) => value && value !== "#" && /^https?:\/\//i.test(value));

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${siteConfig.url}/#store`,
    name: settings.storeName,
    url: siteConfig.url,
    description: siteConfig.description,
    image: `${siteConfig.url}/opengraph-image`,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.address || "Bakı",
      addressCountry: "AZ",
    },
    areaServed: "AZ",
    ...(socials.length > 0 ? { sameAs: socials } : {}),
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: settings.storeName,
    url: siteConfig.url,
    inLanguage: "az",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={organizationLd} />
      <JsonLd data={websiteLd} />
      <StorefrontShell settings={settings} categories={categories}>
        {children}
      </StorefrontShell>
    </>
  );
}

/** Central site metadata used across SEO (metadata, sitemap, JSON-LD). */
export const siteConfig = {
  name: "Brand Technology",
  url: (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  locale: "az_AZ",
  description:
    "Brand Technology — Azərbaycanda kompüter avadanlıqları mağazası. SSD, HDD, RAM, GPU, CPU, ana plata, monitor, noutbuk və gaming aksesuarları. Orijinal məhsullar, rəsmi zəmanət və Bakı üzrə sürətli çatdırılma.",
  keywords: [
    "kompüter avadanlıqları",
    "kompüter hissələri",
    "SSD",
    "HDD",
    "RAM",
    "GPU",
    "videokart",
    "CPU",
    "prosessor",
    "ana plata",
    "monitor",
    "noutbuk",
    "gaming",
    "gaming aksesuarları",
    "klaviatura",
    "siçan",
    "kompüter mağazası Bakı",
    "Azərbaycan",
    "Brand Technology",
  ],
} as const;

/** Turn a relative path into an absolute URL for OG images and JSON-LD. */
export function absoluteUrl(path: string): string {
  if (!path) return siteConfig.url;
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Kompüter avadanlıqları`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f8faf7",
    theme_color: "#2e7d32",
    lang: "az",
  };
}

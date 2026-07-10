import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Admins paste image URLs from any https host, so allow all https remote
    // images while keeping Next.js image optimization enabled.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Uploaded images are served by a route handler (standalone does not serve
  // runtime-added public files). Keep stored `/uploads/...` URLs working by
  // rewriting them to that handler before the static-file check.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/uploads/:path*", destination: "/api/uploads/:path*" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;

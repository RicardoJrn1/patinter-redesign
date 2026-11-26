import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF first, WebP fallback (next/image negotiates with the Accept header)
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 82, 90],
  },
  turbopack: {
    // pin the workspace root (a stray lockfile in the user folder otherwise triggers a warning)
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

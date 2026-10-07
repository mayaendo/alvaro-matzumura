import type { NextConfig } from "next";

// Turbopack's on-disk cache breaks on exFAT drives, where macOS writes `._*`
// metadata files into `.next/cache`. Keep it on Vercel, skip it locally.
const diskCache = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [new URL("https://cdn.sanity.io/images/**")],
  },
  partialPrefetching: true,
  experimental: {
    turbopackFileSystemCacheForDev: diskCache,
    turbopackFileSystemCacheForBuild: diskCache,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

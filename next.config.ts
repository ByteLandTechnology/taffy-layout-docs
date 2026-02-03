import type { NextConfig } from "next";

import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@heroui/react",
      "@codesandbox/sandpack-react",
    ],
  },
};

export default bundleAnalyzer(nextConfig);

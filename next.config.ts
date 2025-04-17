// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add specific handling for the auth API route
  experimental: {
    serverComponentsExternalPackages: ["better-auth"],
  },
  // Optimize build by excluding dynamic routes that don't need static generation
  staticPageGenerationTimeout: 120,
  output: "standalone",
  // Explicitly prevent Next.js from trying to statically optimize the auth route
  exportPathMap: async function (defaultPathMap) {
    // Remove auth API routes from static export
    delete defaultPathMap["/api/auth/[...all]"];
    return defaultPathMap;
  },
};

export default nextConfig;

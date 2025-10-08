import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during build to avoid deployment issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during build if needed
    ignoreBuildErrors: false,
  },
  // Output configuration for Vercel
  output: 'standalone',
};

export default nextConfig;

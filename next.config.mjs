/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ultra-minimal for fastest possible builds
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  experimental: {
    // Keep only valid experimental features
    memoryBasedWorkersCount: false,
  },
  // Disable source maps for faster builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
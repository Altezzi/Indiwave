/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ultra-minimal for fastest possible builds
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  swcMinify: false, // Disable SWC minification for faster builds
  images: { unoptimized: true },
  experimental: {
    // Disable all experimental features
    serverComponents: false,
    memoryBasedWorkersCount: false,
  },
  // Disable source maps for faster builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
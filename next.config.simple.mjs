/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for fastest builds
  typescript: { 
    ignoreBuildErrors: true 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

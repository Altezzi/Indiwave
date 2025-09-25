/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // If you're early in TS adoption and don't want type errors to block deploys,
  // flip this to true (optional):
  typescript: { ignoreBuildErrors: true },

  // Optimize for production
  swcMinify: true,

  // Experimental features for better performance
  experimental: {
    // Reduce memory usage during build
    memoryBasedWorkersCount: true,
    // Optimize build performance
    optimizeCss: true,
  },

  // Webpack optimization for Vercel
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
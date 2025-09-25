/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // If you're early in TS adoption and don't want type errors to block deploys,
  // flip this to true (optional):
  typescript: { ignoreBuildErrors: true },

  // Enable standalone output for Docker optimization
  output: 'standalone',

  // Optimize for production
  swcMinify: true,
};

export default nextConfig;
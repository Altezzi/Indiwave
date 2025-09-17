/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true, // optional, fine to keep if you want /path/ style URLs
  images: {
    unoptimized: true, // needed for Netlify unless you add image optimization
  },
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

module.exports = nextConfig; // ✅ use module.exports, not export default
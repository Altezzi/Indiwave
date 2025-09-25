/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // TypeScript configuration
  typescript: { 
    ignoreBuildErrors: true 
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optimize for Vercel
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },

  // Experimental features for better performance
  experimental: {
    // Reduce memory usage during build
    memoryBasedWorkersCount: true,
    // Optimize build performance
    optimizeCss: true,
    // Enable server components
    serverComponents: true,
  },

  // Webpack optimization for Vercel
  webpack: (config, { isServer, webpack }) => {
    // Optimize for serverless
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Add optimization plugins
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },

  // Headers for better performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
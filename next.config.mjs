/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Polyfills for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        encoding: false,
        pino: false,
        'pino-pretty': false,
      };
    }

    // Ignore warnings about missing optional dependencies
    config.ignoreWarnings = [
      {
        module: /node_modules\/(@metamask|@walletconnect|pino)/,
      },
    ];

    return config;
  },
  // Suppress build warnings from external dependencies
  experimental: {
    serverComponentsExternalPackages: ['@walletconnect', 'pino'],
  },
};

export default nextConfig;

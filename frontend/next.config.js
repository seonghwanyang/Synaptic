/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false,
  },
  webpack: (config, { isServer }) => {
    // Disable webpack cache for now to avoid issues
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;

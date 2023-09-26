/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /pdf\.worker\.js$/,
        use: 'worker-loader',
      });
    }

    return config;
  },
}

module.exports = nextConfig


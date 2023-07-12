/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  images: {
    domains: [
      "raw.githubusercontent.com",
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  }
}

module.exports = nextConfig

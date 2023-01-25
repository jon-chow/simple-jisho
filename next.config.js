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
      "classic.jisho.org",
      "raw.githubusercontent.com",
    ]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  }
}

module.exports = nextConfig

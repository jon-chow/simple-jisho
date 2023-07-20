/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/stat/:region",
				destination: "https://:region.google-analytics.com/g/collect",
			},
		];
	},
	reactStrictMode: true,
	swcMinify: true,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},
	images: {
		domains: ["raw.githubusercontent.com", "jon-chow.github.io"],
	},
	sassOptions: {
		includePaths: [path.join(__dirname, "src/styles")],
	},
};

module.exports = nextConfig

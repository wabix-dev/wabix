import type { NextConfig } from "wabix";

const nextConfig = {
  experimental: {
    mdxRs: true
  },

  // Other config properties
  webpack(config) {
    return config;
  },

  turbopack: {
    rules: {
      "*.react.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    }
  }
} satisfies NextConfig;

export default nextConfig;

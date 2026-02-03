import type { NextConfig } from "wabix";

const nextConfig = {
  experimental: {
    mdxRs: true,
    turbo: {
      rules: {
        "*.react.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  // Other config properties
  webpack(config) {
    return config;
  },
} satisfies NextConfig;

const withMDX = require("@wabix/mdx")();
export default withMDX(nextConfig);

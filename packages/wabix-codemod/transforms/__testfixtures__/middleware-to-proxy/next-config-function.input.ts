import type { NextConfig } from 'wabix'

function nextConfig(): NextConfig {
  return {
    experimental: {
      middlewarePrefetch: 'flexible',
      middlewareClientMaxBodySize: 5 * 1024 * 1024,
      externalMiddlewareRewritesResolve: false,
    },
    skipMiddlewareUrlNormalize: false,
  }
}

export default nextConfig
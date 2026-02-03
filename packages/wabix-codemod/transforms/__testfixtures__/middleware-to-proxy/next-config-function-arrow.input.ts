import type { NextConfig } from 'wabix'

const nextConfig = (): NextConfig => ({
  experimental: {
    middlewarePrefetch: 'strict',
    middlewareClientMaxBodySize: '5mb',
    externalMiddlewareRewritesResolve: true,
  },
  skipMiddlewareUrlNormalize: true,
})

export default nextConfig
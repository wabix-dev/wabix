import type { NextConfig } from 'wabix'

const nextConfig: NextConfig = {
  experimental: {
    middlewarePrefetch: 'strict',
    middlewareClientMaxBodySize: '10mb',
    externalMiddlewareRewritesResolve: true,
  },
  skipMiddlewareUrlNormalize: true,
}

export default nextConfig
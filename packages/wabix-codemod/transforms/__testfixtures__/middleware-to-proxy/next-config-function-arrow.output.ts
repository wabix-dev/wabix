import type { NextConfig } from 'wabix'

const nextConfig = (): NextConfig => ({
  experimental: {
    proxyPrefetch: 'strict',
    proxyClientMaxBodySize: '5mb',
    externalProxyRewritesResolve: true,
  },
  skipProxyUrlNormalize: true,
})

export default nextConfig
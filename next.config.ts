import { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    useCache: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

export default config

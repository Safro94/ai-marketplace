import { ROUTES } from '@/lib/constants'
import { siteConfig } from '@/lib/seo-config'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        ROUTES.dashboard(),
        ROUTES.account(),
        ROUTES.purchases(),
        ROUTES.creatorDashboard(),
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}

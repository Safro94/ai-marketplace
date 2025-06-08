import prisma from '@/lib/prisma'
import { siteConfig } from '@/lib/seo-config'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Fetch real assets and categories
  const [assets, categories] = await Promise.all([
    prisma.asset.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, updatedAt: true },
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticPages = [
    '/',
    '/explore',
    '/creators',
    '/refe',
    '/login',
    '/signup',
    '/about',
    '/terms',
    '/privacy',
    '/contact',
    '/account',
    '/purchases',
    '/cart',
    '/affiliate',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  // Dynamic assets
  const assetPages = assets.map((asset) => ({
    url: `${baseUrl}/assets/${asset.id}`,
    lastModified: asset.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic categories
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...assetPages, ...categoryPages]
}

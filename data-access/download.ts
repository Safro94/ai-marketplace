import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { InfiniteRoute } from '@/lib/types'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import { headers } from 'next/headers'
import 'server-only'

export const downloadCreate = async ({
  assetId,
  purchaseItemId,
  profileId,
}: {
  assetId: string
  purchaseItemId: string
  profileId: string
}) => {
  const headersList = await headers()

  await prisma.download.create({
    data: {
      assetId,
      purchaseItemId,
      profileId: profileId ?? '',
      userAgent: headersList.get('user-agent'),
      ipAddress:
        headersList.get('x-real-ip') || headersList.get('x-forwarded-for'),
    },
  })
}

export const getDashboardDownloads = async ({
  profileId,
  limit,
  offset,
}: InfiniteRoute) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.dashboardDownloads(profileId))
  unstable_cacheLife('hours')

  return await prisma.download.findMany({
    where: {
      profileId,
    },
    select: {
      id: true,
      purchaseItem: {
        select: {
          id: true,
          createdAt: true,
          asset: {
            select: {
              id: true,
              title: true,
              assetFile: true,
              featuredImage: true,
            },
          },
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: {
      downloadedAt: 'desc',
    },
  })
}

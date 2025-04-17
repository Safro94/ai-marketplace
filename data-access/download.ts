import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import { headers } from 'next/headers'
import 'server-only'

export const downloadCreate = async ({
  assetId,
  purchaseItemId,
}: {
  assetId: string
  purchaseItemId: string
}) => {
  const headersList = await headers()
  const session = await getServerSession()

  await prisma.download.create({
    data: {
      assetId,
      purchaseItemId,
      userId: session?.user.id ?? '',
      userAgent: headersList.get('user-agent'),
      ipAddress:
        headersList.get('x-real-ip') || headersList.get('x-forwarded-for'),
    },
  })
}

export const getDashboardDownloads = async (profileId: string) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.dashboardDownloads(profileId))
  unstable_cacheLife('hours')

  return await prisma.download.findMany({
    where: {
      userId: profileId,
    },
    include: {
      purchaseItem: {
        include: {
          asset: true,
        },
      },
    },
    orderBy: {
      downloadedAt: 'desc',
    },
  })
}

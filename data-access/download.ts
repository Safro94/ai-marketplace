import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
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

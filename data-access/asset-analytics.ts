import prisma from '@/lib/prisma'
import 'server-only'

export const updateAssetAnalytics = async (
  assetId: string,
  isUniqueView: boolean,
) => {
  return await prisma.assetAnalytics.upsert({
    where: { assetId },
    update: {
      views: { increment: 1 },
      uniqueViews: { increment: isUniqueView ? 1 : 0 },
    },
    create: {
      assetId,
      views: 1,
      uniqueViews: 1,
    },
  })
}

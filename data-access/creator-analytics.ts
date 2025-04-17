import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'

export const createOrUpdateCreatorAnalytics = async (
  args: Prisma.CreatorAnalyticsUpsertArgs,
) => {
  await prisma.creatorAnalytics.upsert(args)
}

export const getCreatorAnalyticsByCreatorProfileId = async (
  creatorProfileId: string,
) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.creatorDashboardAnalytics(creatorProfileId))
  unstable_cacheLife('hours')

  return await prisma.creatorAnalytics.findUnique({
    where: { creatorProfileId },
  })
}

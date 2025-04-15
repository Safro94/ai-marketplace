import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const createOrUpdateCreatorAnalytics = async (
  args: Prisma.CreatorAnalyticsUpsertArgs,
) => {
  await prisma.creatorAnalytics.upsert(args)
}

export const getCreatorAnalyticsByCreatorProfileId = async (
  creatorProfileId: string,
) => {
  return await prisma.creatorAnalytics.findUnique({
    where: { creatorProfileId },
  })
}

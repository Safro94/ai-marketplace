import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import 'server-only'

export const getDashboardReviews = async (profileId: string) => {
  return await prisma.review.findMany({
    where: {
      userProfileId: profileId,
    },
    include: {
      asset: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const createReview = async (data: Prisma.ReviewCreateArgs['data']) => {
  return await prisma.review.create({
    data,
  })
}

export const getReviewsByAssetId = async (assetId?: string) => {
  return await prisma.review.findMany({
    where: { assetId },
  })
}

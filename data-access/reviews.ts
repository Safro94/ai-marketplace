import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { InfiniteRoute } from '@/lib/types'
import { Prisma, ReviewStatus } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'

export const getDashboardReviews = async ({
  profileId,
  limit,
  offset,
}: InfiniteRoute) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.dashboardReviews(profileId))
  unstable_cacheLife('hours')

  return await prisma.review.findMany({
    where: {
      userProfileId: profileId,
    },
    select: {
      id: true,
      title: true,
      comment: true,
      createdAt: true,

      asset: {
        select: {
          title: true,
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const createReview = async (data: Prisma.ReviewCreateArgs['data']) => {
  return await prisma.review.create({
    data: {
      ...data,
      status: ReviewStatus.APPROVED,
    },
  })
}

export const getReviewsByAssetId = async ({
  assetId,
  limit,
  offset,
}: {
  assetId: string
  limit?: number
  offset?: number
}) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.assetReviews(assetId))
  unstable_cacheLife('hours')

  return await prisma.review.findMany({
    where: { assetId, status: ReviewStatus.APPROVED },
    include: {
      userProfile: {
        select: {
          user: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

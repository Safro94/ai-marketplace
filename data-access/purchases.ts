import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Prisma, PurchaseStatus } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'
import { InfiniteRoute } from './../lib/types'

export const getPurchasesCount = async () => {
  return await prisma.purchase.count()
}

export const getPurchasesAmount = async () => {
  return await prisma.purchase.findMany({
    select: {
      amount: true,
      discountAmount: true,

      purchaseItems: {
        select: {
          amount: true,
          commisionRate: true,
        },
      },
    },
  })
}

export const createPurchase = async (
  data: Prisma.PurchaseCreateArgs['data'],
) => {
  return await prisma.purchase.create({
    data,
  })
}

export const getAllPurchasesBetweenDates = async ({
  profileId,
  startDate,
  endDate,
}: {
  profileId: string
  startDate: Date
  endDate: Date
}) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.analyticsSales(profileId))
  unstable_cacheLife('hours')

  return await prisma.purchase.findMany({
    where: {
      purchaseItems: {
        some: {
          asset: {
            creatorId: profileId,
          },
        },
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'COMPLETED',
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

export const getAllPurchasesByProfileId = async ({
  profileId,
  where,
  limit,
  offset,
}: InfiniteRoute & {
  where?: Prisma.PurchaseWhereInput
}) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.purchases(profileId))
  unstable_cacheLife('hours')

  return await prisma.purchase.findMany({
    where: {
      ...where,
      buyerId: profileId,
    },
    select: {
      id: true,
      createdAt: true,
      status: true,

      purchaseItems: {
        select: {
          id: true,
          amount: true,
          createdAt: true,
          licenseKey: true,

          assetLicense: {
            select: {
              license: {
                select: {
                  name: true,
                },
              },
            },
          },
          asset: {
            select: {
              id: true,
              title: true,
              description: true,
              featuredImage: true,
              assetFile: true,

              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
  })
}

export const getAllCreatorDashboardPurchasesByAssetCreator = async ({
  profileId,
  offset,
  limit,
}: InfiniteRoute) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.creatorDashboardPurchases(profileId))
  unstable_cacheLife('hours')

  return await prisma.purchase.findMany({
    where: {
      status: PurchaseStatus.COMPLETED,
      purchaseItems: {
        some: {
          asset: {
            creatorId: profileId,
          },
        },
      },
    },
    include: {
      purchaseItems: {
        where: {
          asset: {
            creatorId: profileId, // Filter purchaseItems to include only those for this creator
          },
        },
        include: {
          assetLicense: {
            select: {
              license: {
                select: {
                  name: true,
                },
              },
            },
          },
          asset: {
            select: {
              id: true,
              title: true,
              featuredImage: true,
            },
          },
        },
      },
      buyer: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  })
}

export const checkUserPurchasedAsset = async (
  profileId: string,
  assetId: string,
) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.purchasedAsset(profileId, assetId))
  unstable_cacheLife('hours')

  const purchase = await prisma.purchase.findFirst({
    where: {
      buyerId: profileId,
      status: PurchaseStatus.COMPLETED,
      purchaseItems: {
        some: {
          assetId,
        },
      },
    },
    include: {
      purchaseItems: {
        where: {
          assetId: {
            equals: assetId,
          },
        },
      },
    },
  })

  return { isPurchased: !!purchase, purchase }
}

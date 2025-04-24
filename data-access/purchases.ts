import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Prisma, PurchaseStatus } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'

export const getPurchasesCount = async () => {
  return await prisma.purchase.count()
}

export const getPurchasesAmount = async () => {
  return await prisma.purchase.findMany({
    select: {
      amount: true,
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

export const getAllPurchasesByProfileId = async (
  profileId: string,
  where?: Prisma.PurchaseWhereInput,
) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.purchases(profileId))
  unstable_cacheLife('hours')

  return await prisma.purchase.findMany({
    where: {
      ...where,
      buyerId: profileId,
    },
    include: {
      purchaseItems: {
        include: {
          asset: {
            include: {
              category: true,
              creator: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          assetLicense: {
            include: {
              license: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const getAllCreatorDashboardPurchasesByAssetCreator = async (
  profileId: string,
) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.creatorDashboardPurchases(profileId))
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
      status: PurchaseStatus.COMPLETED,
    },
    include: {
      purchaseItems: {
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
    take: 5,
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

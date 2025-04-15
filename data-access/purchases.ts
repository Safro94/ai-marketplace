import prisma from '@/lib/prisma'
import { Prisma, PurchaseStatus } from '@prisma/client'
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

export const getCompletedPurchaseByAssetAndBuyerId = async (
  profileId: string,
  assetId: string,
) => {
  return await prisma.purchase.findFirst({
    where: {
      buyerId: profileId,
      purchaseItems: {
        some: {
          assetId,
        },
      },
      status: PurchaseStatus.COMPLETED,
    },
  })
}

export const getAllPurchasesByProfileId = async (
  profileId: string,
  where?: Prisma.PurchaseWhereInput,
) => {
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

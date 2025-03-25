import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export type AssetWithRelations = Prisma.AssetGetPayload<{
  include: {
    category: true
    creator: {
      include: {
        user: true
      }
    }
    reviews: true
  }
}>

export async function getFeaturedAssets(
  limit = 3,
): Promise<AssetWithRelations[]> {
  return prisma.asset.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      category: true,
      creator: {
        include: {
          user: true,
        },
      },
      reviews: true,
    },
    orderBy: {
      sales: 'desc',
    },
    take: limit,
  })
}

// This function is used in API routes
export async function getAssetById(
  id: string,
): Promise<AssetWithRelations | null> {
  return prisma.asset.findUnique({
    where: { id },
    include: {
      category: true,
      creator: {
        include: {
          user: true,
        },
      },
      reviews: true,
    },
  })
}

export async function getAssetsByCategory(
  categoryId: string,
  limit = 10,
): Promise<AssetWithRelations[]> {
  return prisma.asset.findMany({
    where: {
      categoryId,
      status: 'PUBLISHED',
    },
    include: {
      category: true,
      creator: {
        include: {
          user: true,
        },
      },
      reviews: true,
    },
    take: limit,
  })
}

export async function searchAssets(
  query: string,
): Promise<AssetWithRelations[]> {
  return prisma.asset.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
      ],
      status: 'PUBLISHED',
    },
    include: {
      category: true,
      creator: {
        include: {
          user: true,
        },
      },
      reviews: true,
    },
  })
}

export async function getUserPurchasedAssets(
  userId: string,
): Promise<AssetWithRelations[]> {
  const purchases = await prisma.purchase.findMany({
    where: {
      buyerId: userId,
      status: 'COMPLETED',
    },
    include: {
      asset: {
        include: {
          category: true,
          creator: {
            include: {
              user: true,
            },
          },
          reviews: true,
        },
      },
    },
  })

  return purchases.map((purchase) => purchase.asset)
}

export async function createAsset(data: Prisma.AssetCreateInput) {
  return prisma.asset.create({
    data,
  })
}

export async function updateAsset(id: string, data: Prisma.AssetUpdateInput) {
  return prisma.asset.update({
    where: { id },
    data,
  })
}

import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

type AssetWithRelations = Prisma.AssetGetPayload<{
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

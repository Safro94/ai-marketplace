import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// Used in purchase-options.tsx
export async function createPurchase(data: Prisma.PurchaseCreateInput) {
  const purchase = await prisma.purchase.create({
    data,
    include: {
      asset: {
        include: {
          creator: true,
        },
      },
      buyer: true,
    },
  })

  // Update asset sales and revenue
  await prisma.asset.update({
    where: { id: data.asset.connect?.id },
    data: {
      sales: { increment: 1 },
      revenue: { increment: data.amount },
    },
  })

  // Update creator analytics
  if (purchase.asset.creator) {
    await prisma.creatorProfile.update({
      where: { profileId: purchase.asset.creator.id },
      data: {
        totalSales: { increment: 1 },
        totalRevenue: { increment: data.amount },
      },
    })
  }

  return purchase
}

// Used in asset-download.tsx
export async function checkUserPurchasedAsset(userId: string, assetId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  })

  if (!profile) return false

  const purchase = await prisma.purchase.findFirst({
    where: {
      buyerId: profile.id,
      assetId,
      status: 'COMPLETED',
    },
  })

  return !!purchase
}

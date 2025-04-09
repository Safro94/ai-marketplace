import prisma from '@/lib/prisma'
import { PurchaseStatus } from '@prisma/client'

export async function checkUserPurchasedAsset(userId: string, assetId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  })

  if (!profile) return false

  const purchase = await prisma.purchase.findFirst({
    where: {
      buyerId: profile.id,
      purchaseItems: {
        some: {
          assetId,
        },
      },
      status: PurchaseStatus.COMPLETED,
    },
  })

  return !!purchase
}

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import 'server-only'

export const createPurchaseItem = async (
  data: Prisma.PurchaseItemCreateArgs['data'],
) => {
  await prisma.purchaseItem.create({
    data: {
      ...data,
    },
  })
}

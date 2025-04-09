'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { headers } from 'next/headers'

export const saveDownload = async (assetId: string, purchaseItemId: string) => {
  const headersList = await headers()
  const session = await getServerSession()

  await prisma.download.create({
    data: {
      assetId,
      purchaseItemId,
      userId: session?.user.id ?? '',
      userAgent: headersList.get('user-agent'),
      ipAddress:
        headersList.get('x-real-ip') || headersList.get('x-forwarded-for'),
    },
  })
}

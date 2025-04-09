import { getPurchaseAmounts } from '@/app/checkout/checkout-utils'
import { CACHE_KEYS } from '@/lib/constants'
import { generateLicenseKey } from '@/lib/license-utils'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { CartItem } from '@/lib/types'
import { PaymentProvider, PurchaseStatus } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const {
      cartItems,
      paypalOrderId,
    }: {
      paypalOrderId: string
      cartItems: Pick<CartItem, 'assetId' | 'assetLicenseId'>[]
    } = await request.json()

    // Get user profile
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!userProfile) {
      return { success: false, error: 'User profile not found' }
    }

    const { totalAmounts, assets } = await getPurchaseAmounts(cartItems)

    // Create the purchase with multiple items
    const purchase = await prisma.purchase.create({
      data: {
        buyerId: userProfile.id,
        amount: totalAmounts.totalPrice,
        transactionId: paypalOrderId,
        status: PurchaseStatus.COMPLETED,
        paymentProvider: PaymentProvider.PAYPAL,
      },
    })

    // Process each purchase item
    await Promise.all(
      assets.map(async (asset) => {
        // Generate a unique license key
        const licenseKey = generateLicenseKey(session.user.id, asset.id)
        const assetPrice = asset.assetLicenses[0].price

        // Create the purchase item
        const purchaseItem = await prisma.purchaseItem.create({
          data: {
            licenseKey,
            purchaseId: purchase.id,
            assetId: asset.id,
            amount: assetPrice,
            assetLicenseId: asset.assetLicenses[0].id,
          },
        })

        // Update asset sales and revenue
        await prisma.asset.update({
          where: { id: asset.id },
          data: {
            sales: { increment: 1 },
            revenue: { increment: assetPrice },
            totalSales: { increment: 1 },
          },
        })

        await prisma.creatorProfile.update({
          where: { id: asset.creator.creatorProfile?.id },
          data: {
            totalSales: { increment: 1 },
            totalRevenue: { increment: assetPrice },
          },
        })

        revalidateTag(CACHE_KEYS.profile(asset.creatorId))

        // Update creator analytics if they exist
        const creatorAnalytics = await prisma.creatorAnalytics.findFirst({
          where: { creatorProfileId: asset.creator.creatorProfile?.id },
        })

        if (creatorAnalytics) {
          await prisma.creatorAnalytics.update({
            where: { id: creatorAnalytics.id },
            data: {
              totalSales: { increment: 1 },
              totalRevenue: { increment: assetPrice },
            },
          })
        }

        return purchaseItem
      }),
    )

    // // Create a notification for the buyer about the purchase
    // await prisma.notification.create({
    //   data: {
    //     userId: userProfile.id,
    //     title: 'Purchase Completed',
    //     message: `Your purchase of ${items.length} asset${items.length > 1 ? 's' : ''} has been completed successfully`,
    //     type: 'SUCCESS',
    //     data: {
    //       purchaseId: purchase.id,
    //     },
    //   },
    // })

    // // Create individual notifications for each asset creator
    // const creatorNotifications = new Map()

    // for (const item of items) {
    //   const asset = await prisma.asset.findUnique({
    //     where: { id: item.assetId },
    //     select: { title: true, creatorId: true },
    //   })

    //   if (asset?.creatorId) {
    //     // Group notifications by creator to avoid sending multiple notifications
    //     if (!creatorNotifications.has(asset.creatorId)) {
    //       creatorNotifications.set(asset.creatorId, [])
    //     }
    //     creatorNotifications.get(asset.creatorId).push({
    //       assetId: item.assetId,
    //       assetTitle: asset.title,
    //     })
    //   }
    // }

    // // Send grouped notifications to creators
    // for (const [creatorId, assets] of creatorNotifications.entries()) {
    //   await prisma.notification.create({
    //     data: {
    //       userId: creatorId,
    //       title: 'New Sale',
    //       message:
    //         assets.length === 1
    //           ? `Your asset "${assets[0].assetTitle}" has been purchased`
    //           : `${assets.length} of your assets have been purchased`,
    //       type: 'SUCCESS',
    //       data: {
    //         purchaseId: purchase.id,
    //         assets: assets,
    //       },
    //     },
    //   })
    // }

    return NextResponse.json({
      success: true,
      purchaseId: purchase.id,
    })
  } catch (error) {
    console.error('Error creating purchase:', error)
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 },
    )
  }
}

import { getPurchaseAmounts } from '@/app/checkout/_components/checkout-utils'
import { updateAsset } from '@/data-access/assets'
import { createOrUpdateCreatorAnalytics } from '@/data-access/creator-analytics'
import { updateCreatorProfile } from '@/data-access/creator-profile'
import { getUserProfile } from '@/data-access/profile'
import { createPurchaseItem } from '@/data-access/purchase-item'
import { createPurchase } from '@/data-access/purchases'
import { CACHE_KEYS } from '@/lib/constants'
import { generateLicenseKey } from '@/lib/license-utils'
import { getServerSession } from '@/lib/session'
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
      paypalOrderId,
      paymentDetails,
    }: {
      paypalOrderId: string
      paymentDetails: object
    } = await request.json()

    // Get user profile
    const userProfile = await getUserProfile(session.user.id)

    if (!userProfile) {
      return { success: false, error: 'User profile not found' }
    }

    const { totalAmounts, assets, cart } = await getPurchaseAmounts()

    // Create the purchase with multiple items
    const purchase = await createPurchase({
      buyerId: userProfile.id,
      amount: totalAmounts.totalPrice,
      transactionId: paypalOrderId,
      status: PurchaseStatus.COMPLETED,
      paymentProvider: PaymentProvider.PAYPAL,
      paymentDetails: paymentDetails,
    })

    // Process each purchase item
    await Promise.all(
      assets.map(async (asset) => {
        // Generate a unique license key
        const cartAsset = cart.find((item) => item.assetId === asset.id)
        if (!cartAsset) {
          return {
            success: false,
            error: 'Cart asset does not match current asset',
          }
        }

        const licenseKey = generateLicenseKey(session.user.id, asset.id)
        const assetLicense = asset.assetLicenses.find(
          (item) => item.licenseId === cartAsset.assetLicenseId,
        )
        const assetPrice = assetLicense?.price || 0

        // Create the purchase item
        const purchaseItem = await createPurchaseItem({
          licenseKey,
          purchaseId: purchase.id,
          assetId: asset.id,
          amount: assetPrice,
          assetLicenseId: assetLicense?.id,
        })

        // Update asset sales and revenue
        await updateAsset({
          assetId: asset.id,
          sales: { increment: 1 },
          revenue: { increment: assetPrice },
          totalSales: { increment: 1 },
        })

        const creatorProfile = await updateCreatorProfile({
          where: { id: asset.creator.creatorProfile?.id },
          data: {
            totalSales: { increment: 1 },
            totalRevenue: { increment: assetPrice },
          },
        })

        revalidateTag(CACHE_KEYS.profile(asset.creatorId))

        await createOrUpdateCreatorAnalytics({
          where: { creatorProfileId: creatorProfile.id },
          update: {
            totalSales: { increment: 1 },
            totalRevenue: { increment: assetPrice },
            updatedAt: new Date(),
          },
          create: {
            totalSales: 1,
            totalRevenue: assetPrice,
            creatorProfile: {
              connect: { id: creatorProfile.id },
            },
          },
        })

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

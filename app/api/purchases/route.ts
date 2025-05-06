import { getPurchaseAmounts } from '@/app/(main)/checkout/_components/checkout-utils'
import {
  getAffiliateCodeByCode,
  updateAffiliateCode,
} from '@/data-access/affiliate-codes'
import { updateAsset } from '@/data-access/assets'
import { createOrUpdateCreatorAnalytics } from '@/data-access/creator-analytics'
import { getCreatorProfileById } from '@/data-access/creator-profile'
import { createPurchaseItem } from '@/data-access/purchase-item'
import {
  createPurchase,
  getAllPurchasesByProfileId,
} from '@/data-access/purchases'
import { CACHE_KEYS } from '@/lib/constants'
import { generateLicenseKey } from '@/lib/license-utils'
import { getInfiniteScrollRouteParams } from '@/lib/utils'
import {
  notifyBuyerOrderCompleted,
  notifyCreatorSellCompleted,
  notifyPlatformSellCompleted,
} from '@/services/emails/email'
import {
  AffiliateStatus,
  DiscountType,
  PaymentProvider,
  PurchaseStatus,
} from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../utils'

export async function GET(request: NextRequest) {
  try {
    const { profile } = await validateRouteProfilePermissions()

    const { offset, limit } = getInfiniteScrollRouteParams(request)

    const purchases = await getAllPurchasesByProfileId({
      profileId: profile.id,
      offset,
      limit,
    })

    return NextResponse.json(purchases)
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { profile, user } = await validateRouteProfilePermissions()

    const {
      paypalOrderId,
      paymentDetails,
      affiliateCode,
    }: {
      paypalOrderId: string
      paymentDetails: object
      affiliateCode: string
    } = await request.json()

    let dbAffiliateCode

    if (affiliateCode) {
      dbAffiliateCode = await getAffiliateCodeByCode(affiliateCode)
    }

    const { totalAmounts, assets, cart } = await getPurchaseAmounts(
      dbAffiliateCode?.discountPercentage,
    )

    // Create the purchase with multiple items
    const purchase = await createPurchase({
      buyerId: profile.id,
      amount: totalAmounts.totalPrice,
      transactionId: paypalOrderId,
      status: PurchaseStatus.COMPLETED,
      paymentProvider: PaymentProvider.PAYPAL,
      paymentDetails: paymentDetails,
      ...(dbAffiliateCode ? { affiliateCodeId: dbAffiliateCode.id } : {}),
      ...(dbAffiliateCode?.discountPercentage
        ? {
            discountAmount:
              totalAmounts.totalPrice *
              (dbAffiliateCode?.discountPercentage / 100),
            discountType: DiscountType.AFFILIATE_REFERRAL,
          }
        : {}), // Handle any discounts if the affiliate code applies one
    })

    if (dbAffiliateCode?.code) {
      await updateAffiliateCode(dbAffiliateCode?.code, {
        totalUses: { increment: 1 },
        totalSales: { increment: totalAmounts.totalPrice },
        ...(dbAffiliateCode.discountPercentage && {
          status: AffiliateStatus.EXPIRED,
        }),
      })

      revalidateTag(CACHE_KEYS.defaultAffiliateCode(dbAffiliateCode.code))
    }

    revalidateTag(CACHE_KEYS.purchases(profile.id))
    revalidateTag(CACHE_KEYS.analyticsSales(profile.id))
    revalidateTag(CACHE_KEYS.creatorDashboardPurchases(profile.id))

    // Process each purchase item
    await Promise.all(
      assets.map(async (asset) => {
        // Generate a unique license key
        const cartAsset = cart.find((item) => item.assetId === asset.id)
        if (!cartAsset) {
          return NextResponse.json(
            { error: 'Cart asset does not match current asset' },
            { status: 500 },
          )
        }

        const licenseKey = generateLicenseKey(user.id, asset.id)
        const assetLicense = asset.assetLicenses.find(
          (item) => item.licenseId === cartAsset.assetLicenseId,
        )
        const assetPrice = assetLicense?.price || 0

        const creatorProfile = await getCreatorProfileById(
          asset.creator.creatorProfile!.id,
        )

        if (!creatorProfile) {
          throw Error('Asset creator profile not found')
        }

        // Create the purchase item
        const purchaseItem = await createPurchaseItem({
          licenseKey,
          purchaseId: purchase.id,
          assetId: asset.id,
          amount: assetPrice,
          assetLicenseId: assetLicense?.id,
          commisionRate: creatorProfile.commissionRate,
        })

        const revenue =
          assetPrice - assetPrice * (creatorProfile.commissionRate / 100) // commissionRate es (25,20,etc)

        // Update asset sales and revenue
        const updatedAsset = await updateAsset({
          assetId: asset.id,
          revenue,
          totalSales: { increment: 1 },
        })

        revalidateTag(CACHE_KEYS.purchasedAsset(profile.id, asset.id))

        await createOrUpdateCreatorAnalytics({
          where: { creatorProfileId: creatorProfile.id },
          update: {
            totalSales: { increment: 1 },
            totalRevenue: {
              increment: revenue,
            },
            updatedAt: new Date(),
          },
          create: {
            totalSales: 1,
            totalRevenue: revenue,
            creatorProfile: {
              connect: { id: creatorProfile.id },
            },
          },
        })

        revalidateTag(CACHE_KEYS.creatorDashboardAnalytics(creatorProfile.id))

        await notifyCreatorSellCompleted({
          assetName: updatedAsset.title,
          creatorEmail: asset.creator.creatorProfile!.profile.user.email,
          creatorUsername: asset.creator.creatorProfile!.profile.user.name,
        })

        return purchaseItem
      }),
    )

    await notifyBuyerOrderCompleted({
      name: user.name,
      email: user.email,
    })

    await notifyPlatformSellCompleted({
      purchase,
    })

    // // Create a notification for the buyer about the purchase
    // await prisma.notification.create({
    //   data: {
    //     profileId: userProfile.id,
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
    //       profileId: creatorId,
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

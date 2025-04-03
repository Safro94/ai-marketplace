import { CACHE_KEYS } from '@/lib/constants'
import { generateLicenseKey } from '@/lib/license-utils'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { assetId, assetLicenseId, paymentIntentId } = await request.json()

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get asset and license information
    const assetLicense = await prisma.assetLicense.findUnique({
      where: { id: assetLicenseId },
      include: {
        asset: true,
      },
    })

    if (!assetLicense) {
      return NextResponse.json(
        { error: 'Asset license not found' },
        { status: 404 },
      )
    }

    // Generate a simple license key
    const licenseKey = generateLicenseKey(profile.id, assetId)

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        assetId,
        assetLicenseId,
        buyerId: profile.id,
        amount: assetLicense.price,
        status: 'COMPLETED',
        transactionId: paymentIntentId,
        licenseKey,
      },
    })

    // Update creator revenue
    await prisma.creatorProfile.update({
      where: { profileId: assetLicense.asset.creatorId },
      data: {
        totalSales: { increment: 1 },
        totalRevenue: { increment: assetLicense.price },
      },
    })

    revalidateTag(CACHE_KEYS.profile(assetLicense.asset.creatorId))

    // Create notification for the creator
    await prisma.notification.create({
      data: {
        userId: assetLicense.asset.creatorId,
        title: 'New Sale',
        message: `Your asset "${assetLicense.asset.title}" has been purchased for $${assetLicense.price.toFixed(2)}.`,
        type: 'SUCCESS',
        data: JSON.stringify({ purchaseId: purchase.id }),
      },
    })

    return NextResponse.json({
      success: true,
      purchaseId: purchase.id,
      licenseKey,
    })
  } catch (error) {
    console.error('Error creating purchase:', error)
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 },
    )
  }
}

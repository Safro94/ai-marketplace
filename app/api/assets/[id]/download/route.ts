import { checkUserPurchasedAsset } from '@/lib/db/purchases'
import prisma from '@/lib/prisma'
import { generatePresignedDownloadUrl } from '@/lib/s3-client'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession()
  const assetId = (await params).id

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Check if user has purchased the asset
    const hasPurchased = await checkUserPurchasedAsset(session.user.id, assetId)

    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'You have not purchased this asset' },
        { status: 403 },
      )
    }

    // Get asset details
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Find the purchase
    const purchase = await prisma.purchase.findFirst({
      where: {
        assetId,
        buyerId: profile.id,
        status: 'COMPLETED',
      },
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    // Generate a presigned URL for downloading the asset
    const downloadUrl = await generatePresignedDownloadUrl(
      asset.assetFile,
      3600,
    ) // 1 hour expiry

    // Record the download
    await prisma.download.create({
      data: {
        assetId,
        purchaseId: purchase.id,
        userId: profile.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      downloadUrl,
      assetName: asset.title,
    })
  } catch (error) {
    console.error('Error downloading asset:', error)
    return NextResponse.json(
      { error: 'Failed to download asset' },
      { status: 500 },
    )
  }
}

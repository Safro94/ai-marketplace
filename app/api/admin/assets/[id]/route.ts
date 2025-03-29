import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { ModerationService } from '@/services/ModerationService'
import { AssetStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is an admin
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { isAdmin: true },
  })

  if (!profile?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { status, notes } = await request.json()

    if (![AssetStatus.PUBLISHED, AssetStatus.REJECTED].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const id = (await params).id
    const asset = await ModerationService.updateAssetStatus(
      id,
      status,
      notes || undefined,
    )

    // Notify the creator
    await prisma.notification.create({
      data: {
        userId: asset.creatorId,
        title:
          status === AssetStatus.PUBLISHED
            ? 'Asset Approved'
            : 'Asset Rejected',
        message:
          status === AssetStatus.PUBLISHED
            ? `Your asset "${asset.title}" has been approved and is now live on the marketplace.`
            : `Your asset "${asset.title}" has been rejected. ${notes ? `Reason: ${notes}` : ''}`,
        type: status === AssetStatus.PUBLISHED ? 'SUCCESS' : 'ERROR',
        data: JSON.stringify({ assetId: asset.id }),
      },
    })

    return NextResponse.json({
      success: true,
      assetId: asset.id,
      status,
    })
  } catch (error) {
    console.error('Error updating asset status:', error)
    return NextResponse.json(
      { error: 'Failed to update asset status' },
      { status: 500 },
    )
  }
}

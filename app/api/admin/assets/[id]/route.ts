import { updateAsset } from '@/data-access/assets'
import { validateRouteProfilePermissions } from '@/lib/permissions'
import { AssetStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await validateRouteProfilePermissions()

  try {
    const { status, notes } = await request.json()

    if (![AssetStatus.PUBLISHED, AssetStatus.REJECTED].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const id = (await params).id
    const asset = await updateAsset({
      assetId: id,
      status,
      moderationNotes: notes || null,
      ...(status === AssetStatus.PUBLISHED ? { approvedAt: new Date() } : {}),
    })

    // // Notify the creator
    // await prisma.notification.create({
    //   data: {
    //     userId: asset.creatorId,
    //     title:
    //       status === AssetStatus.PUBLISHED
    //         ? 'Asset Approved'
    //         : 'Asset Rejected',
    //     message:
    //       status === AssetStatus.PUBLISHED
    //         ? `Your asset "${asset.title}" has been approved and is now live on the marketplace.`
    //         : `Your asset "${asset.title}" has been rejected. ${notes ? `Reason: ${notes}` : ''}`,
    //     type: status === AssetStatus.PUBLISHED ? 'SUCCESS' : 'ERROR',
    //     data: JSON.stringify({ assetId: asset.id }),
    //   },
    // })

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

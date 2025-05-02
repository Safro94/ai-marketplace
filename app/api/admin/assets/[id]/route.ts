import { validateRouteProfilePermissions } from '@/app/api/utils'
import { updateAsset } from '@/data-access/assets'
import { getProfileById } from '@/data-access/profile'
import { CACHE_KEYS } from '@/lib/constants'
import {
  notifyAssetApproved,
  notifyAssetRejected,
} from '@/services/emails/email'
import { AssetStatus } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await validateRouteProfilePermissions({
      checkAdminOrCreator: true,
    })

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

    revalidateTag(CACHE_KEYS.assetById(asset.id))
    revalidateTag(CACHE_KEYS.categoriesWithCount())
    revalidateTag(CACHE_KEYS.exploreAssets())

    const creatorUser = await getProfileById(asset.creatorId)

    if (status === AssetStatus.PUBLISHED && creatorUser) {
      await notifyAssetApproved({
        assetName: asset.title,
        email: creatorUser.user.email,
      })
    } else if (status === AssetStatus.REJECTED && creatorUser) {
      await notifyAssetRejected({
        assetName: asset.title,
        email: creatorUser.user.email,
      })
    }

    // // Notify the creator
    // await prisma.notification.create({
    //   data: {
    //     profileId: asset.creatorId,
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
      { status: error instanceof Error ? (error.cause as number) : 500 },
    )
  }
}

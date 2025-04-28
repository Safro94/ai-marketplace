import {
  deleteAssetLicensesByAssetId,
  getAssetLicensesByAssetId,
} from '@/data-access/asset-licenses'
import { getAssetById, softDeleteAssetById } from '@/data-access/assets'
import { getUserProfile } from '@/data-access/profile'
import { CACHE_KEYS } from '@/lib/constants'
import { getServerSession } from '@/lib/session'
import { Role } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const assetId = (await params).id

  try {
    // Check if user is the creator or an admin
    const asset = await getAssetById(assetId, {
      creator: true,
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const profile = await getUserProfile(session.user.id)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const isCreator = asset.creator.userId === session.user.id

    if (!isCreator && profile.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: 'Not authorized to delete this asset' },
        { status: 403 },
      )
    }

    const licenses = await getAssetLicensesByAssetId(asset.id)

    for (const license of licenses) {
      await deleteAssetLicensesByAssetId(license.assetId)
    }

    revalidateTag(CACHE_KEYS.assetLicenses(asset.id))

    await softDeleteAssetById(asset.id)

    revalidateTag(CACHE_KEYS.assetById(asset.id))
    revalidateTag(CACHE_KEYS.exploreAssets())
    revalidateTag(CACHE_KEYS.categoriesWithCount())

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting asset:', error)
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 },
    )
  }
}

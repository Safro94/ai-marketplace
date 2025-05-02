import {
  deleteAssetLicensesByAssetId,
  getAssetLicensesByAssetId,
} from '@/data-access/asset-licenses'
import { getAssetById, softDeleteAssetById } from '@/data-access/assets'
import { CACHE_KEYS } from '@/lib/constants'
import { Role } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../../utils'
import { validateAssetId } from './utils'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { assetId } = await validateAssetId(params)

    if (!assetId) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const { profile, user } = await validateRouteProfilePermissions()

    // Check if user is the creator or an admin
    const asset = await getAssetById(assetId, {
      creator: true,
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const isCreator = asset.creator.userId === user.id

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

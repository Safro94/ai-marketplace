import { getAssetCount, updateAsset } from '@/data-access/assets'
import { CACHE_KEYS } from '@/lib/constants'
import { validateRouteProfilePermissions } from '@/lib/permissions'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await validateRouteProfilePermissions()

  try {
    const { featured } = await request.json()
    const assetId = (await params).id

    // Update the asset's featured status
    const asset = await updateAsset({
      assetId,
      featured,
      // If featuring, set a default order at the end
      ...(featured
        ? {
            featuredOrder: {
              set:
                (await getAssetCount({
                  where: { featured: true },
                })) + 1,
            },
          }
        : {
            featuredOrder: { set: null },
          }),
    })

    revalidateTag(CACHE_KEYS.assetById(asset.id))
    revalidateTag(CACHE_KEYS.exploreAssets())

    return NextResponse.json({
      success: true,
      assetId: asset.id,
      featured: asset.featured,
    })
  } catch (error) {
    console.error('Error updating featured status:', error)
    return NextResponse.json(
      { error: 'Failed to update featured status' },
      { status: 500 },
    )
  }
}

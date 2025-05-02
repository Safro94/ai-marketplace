// app/api/assets/[id]/user-purchase/route.ts
import { validateRouteProfilePermissions } from '@/app/api/utils'
import { checkUserPurchasedAsset } from '@/data-access/purchases'
import { NextRequest, NextResponse } from 'next/server'
import { validateAssetId } from '../utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { assetId } = await validateAssetId(params)
    const { profile } = await validateRouteProfilePermissions()

    const purchaseData = await checkUserPurchasedAsset(profile.id, assetId)

    return NextResponse.json(purchaseData)
  } catch (error) {
    console.error('Error fetching user purchase data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase data' },
      { status: 500 },
    )
  }
}

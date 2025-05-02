import { getAllCreatorDashboardPurchasesByAssetCreator } from '@/data-access/purchases'
import { getInfiniteScrollRouteParams } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../../utils'

export async function GET(request: NextRequest) {
  const { profile } = await validateRouteProfilePermissions()

  const { offset, limit } = getInfiniteScrollRouteParams(request)

  try {
    const sales = await getAllCreatorDashboardPurchasesByAssetCreator({
      profileId: profile.id,
      offset,
      limit,
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 },
    )
  }
}

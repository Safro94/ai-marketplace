import { getDashboardFavoritesByProfileId } from '@/data-access/favorites'
import { getInfiniteScrollRouteParams } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../../utils'

export async function GET(request: NextRequest) {
  try {
    const { profile } = await validateRouteProfilePermissions()

    const { offset, limit } = getInfiniteScrollRouteParams(request)

    const favorites = await getDashboardFavoritesByProfileId({
      profileId: profile.id,
      offset,
      limit,
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 },
    )
  }
}

import { getDashboardReviews } from '@/data-access/reviews'
import { getInfiniteScrollRouteParams } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../../utils'

export async function GET(request: NextRequest) {
  try {
    const { profile } = await validateRouteProfilePermissions()

    const { offset, limit } = getInfiniteScrollRouteParams(request)

    const reviews = await getDashboardReviews({
      profileId: profile.id,
      offset,
      limit,
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 },
    )
  }
}

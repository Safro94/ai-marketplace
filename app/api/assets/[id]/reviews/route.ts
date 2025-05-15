import { getReviewsByAssetId } from '@/data-access/reviews'
import { getInfiniteScrollRouteParams } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { validateAssetId } from '../utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { assetId } = await validateAssetId(params)
    const { offset, limit } = getInfiniteScrollRouteParams(request)

    const reviews = await getReviewsByAssetId({
      assetId,
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

import { getReviewsByAssetId } from '@/data-access/reviews'
import { getServerSession } from '@/lib/session'
import { getInfiniteScrollRouteParams } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const assetId = (await params).id
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { offset, limit } = getInfiniteScrollRouteParams(request)

  try {
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

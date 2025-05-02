import { getDashboardDownloads } from '@/data-access/download'
import { getInfiniteScrollRouteParams } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../../utils'

export async function GET(request: NextRequest) {
  try {
    const { profile } = await validateRouteProfilePermissions()

    const { offset, limit } = getInfiniteScrollRouteParams(request)

    const downloads = await getDashboardDownloads({
      profileId: profile.id,
      offset,
      limit,
    })

    return NextResponse.json(downloads)
  } catch (error) {
    console.error('Error fetching downloads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch downloads' },
      { status: 500 },
    )
  }
}

import { getDashboardDownloads } from '@/data-access/download'
import { getUserProfile } from '@/data-access/profile'
import { getServerSession } from '@/lib/session'
import { getInfiniteScrollRouteParams } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await getUserProfile(session?.user.id)

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const { offset, limit } = getInfiniteScrollRouteParams(request)

  try {
    const purchases = await getDashboardDownloads({
      profileId: profile.id,
      offset,
      limit,
    })

    return NextResponse.json(purchases)
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 },
    )
  }
}

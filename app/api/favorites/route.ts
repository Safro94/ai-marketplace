import { getFavorite } from '@/data-access/favorites'
import { getUserProfile } from '@/data-access/profile'
import { getServerSession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const assetId = request.nextUrl.searchParams.get('assetId')

  if (!assetId) {
    return NextResponse.json({ error: 'Asset id not found' }, { status: 404 })
  }

  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await getUserProfile(session.user.id)

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  try {
    const existingFavorite = await getFavorite(assetId, {
      where: {
        profileId_assetId: {
          profileId: profile.id,
          assetId,
        },
      },
    })

    return NextResponse.json(existingFavorite)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 },
    )
  }
}

import {
  createFavorite,
  deleteFavorite,
  getFavorite,
  getFavoritesByProfileId,
} from '@/data-access/favorites'
import { getUserProfile } from '@/data-access/profile'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const profile = await getUserProfile(session.user.id)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const favorites = await getFavoritesByProfileId(profile.id)

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await getUserProfile(session.user.id)

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  try {
    const { assetId } = await request.json()

    if (!assetId) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 },
      )
    }

    // Check if already favorited
    const existingFavorite = await getFavorite({
      where: {
        userId_assetId: {
          userId: profile.id,
          assetId,
        },
      },
    })

    if (existingFavorite) {
      await deleteFavorite(existingFavorite.id)

      return NextResponse.json({ favorited: false })
    } else {
      await createFavorite({
        userId: profile.id,
        assetId,
      })

      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 },
    )
  }
}

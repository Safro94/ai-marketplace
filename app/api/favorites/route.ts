import { getFavorite } from '@/data-access/favorites'
import { NextRequest, NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../utils'

export async function GET(request: NextRequest) {
  try {
    const assetId = request.nextUrl.searchParams.get('assetId')

    if (!assetId) {
      return NextResponse.json({ error: 'Asset id not found' }, { status: 404 })
    }

    const { profile } = await validateRouteProfilePermissions()

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

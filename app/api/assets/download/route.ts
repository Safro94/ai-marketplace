import { getUserProfile } from '@/data-access/profile'
import { checkUserPurchasedAsset } from '@/data-access/purchases'
import { getServerSession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await getUserProfile(session.user.id)

  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = req.nextUrl.searchParams.get('url')
  const assetId = req.nextUrl.searchParams.get('assetId')

  if (!url || !assetId) {
    throw Error('Asset or url not found')
  }

  const { isPurchased } = await checkUserPurchasedAsset(profile.id, assetId)

  if (!isPurchased) {
    throw Error('Asset not purchased')
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw Error('Failed to fetch file')
  }

  const blob = await response.json()
  return NextResponse.json(blob)
}

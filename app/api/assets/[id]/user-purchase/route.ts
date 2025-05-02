// app/api/assets/[id]/user-purchase/route.ts
import { getUserProfile } from '@/data-access/profile'
import { checkUserPurchasedAsset } from '@/data-access/purchases'
import { getServerSession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const assetId = (await params).id
    const session = await getServerSession()

    if (!assetId) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getUserProfile(session.user.id)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const purchaseData = await checkUserPurchasedAsset(profile.id, assetId)

    return NextResponse.json(purchaseData)
  } catch (error) {
    console.error('Error fetching user purchase data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase data' },
      { status: 500 },
    )
  }
}

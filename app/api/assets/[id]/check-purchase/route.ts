import { checkUserPurchasedAsset } from '@/lib/db/purchases'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ purchased: false })
  }

  try {
    const purchased = await checkUserPurchasedAsset(session.user.id, params.id)
    return NextResponse.json({ purchased })
  } catch (error) {
    console.error('Error checking purchase:', error)
    return NextResponse.json({ purchased: false })
  }
}

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { creatorProfile: true },
    })

    if (!profile || !profile.isCreator || !profile.creatorProfile) {
      return NextResponse.json(
        { error: 'Creator profile not found' },
        { status: 404 },
      )
    }

    // Get all assets created by this creator
    const assets = await prisma.asset.findMany({
      where: {
        creatorId: profile.id,
      },
      include: {
        purchases: {
          where: {
            status: 'COMPLETED',
          },
        },
      },
    })

    // Calculate sales and revenue for each asset
    const assetPerformance = assets.map((asset) => {
      const sales = asset.purchases.length
      const revenue = asset.purchases.reduce(
        (total, purchase) => total + purchase.amount,
        0,
      )

      return {
        name: asset.title,
        sales,
        revenue,
      }
    })

    // Sort by revenue (highest first)
    assetPerformance.sort((a, b) => b.revenue - a.revenue)

    return NextResponse.json(assetPerformance)
  } catch (error) {
    console.error('Error fetching asset performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch asset performance' },
      { status: 500 },
    )
  }
}

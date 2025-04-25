import { getUserProfile } from '@/data-access/profile'
import { SERVICE_CHARGE } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user profile
  const profile = await getUserProfile(session.user.id)

  if (!profile || !isAdminOrCreator(profile) || !profile.creatorProfile) {
    return NextResponse.json(
      { error: 'Creator profile not found' },
      { status: 404 },
    )
  }

  try {
    // Get all assets created by this creator
    const assets = await prisma.asset.findMany({
      where: {
        creatorId: profile.id,
      },
      include: {
        assetAnalytics: {
          select: {
            uniqueViews: true,
          },
        },
        PurchaseItem: {
          where: {
            purchase: {
              status: 'COMPLETED',
            },
          },
        },
      },
    })

    // Calculate sales and revenue for each asset
    const assetPerformance = assets.map((asset) => {
      const sales = asset.PurchaseItem.length
      const uniqueViews = asset.assetAnalytics?.uniqueViews
      const revenue = asset.PurchaseItem.reduce(
        (total, purchase) => total + (purchase.amount - SERVICE_CHARGE * 100),
        0,
      )

      return {
        name: asset.title,
        sales,
        revenue,
        uniqueViews,
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

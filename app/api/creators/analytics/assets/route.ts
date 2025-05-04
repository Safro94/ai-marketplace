import { getAssets } from '@/data-access/assets'
import { getUserProfile } from '@/data-access/profile'
import { isAdminOrCreator } from '@/lib/permissions'
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
    const assets = await getAssets({
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
        (total, purchase) =>
          total + (purchase.amount - profile.creatorProfile!.commissionRate), //TODO: Revisar esto, ver como diferenciar comision previa y actual
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

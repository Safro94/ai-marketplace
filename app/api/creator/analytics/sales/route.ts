import { isAdminOrCreator } from '@/lib/db/permissions'
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

    if (!profile || !isAdminOrCreator(profile) || !profile.creatorProfile) {
      return NextResponse.json(
        { error: 'Creator profile not found' },
        { status: 404 },
      )
    }

    // Get the last 14 days of sales data
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 14)

    // Get all purchases for assets created by this creator
    const purchases = await prisma.purchase.findMany({
      where: {
        asset: {
          creatorId: profile.id,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Group purchases by date
    const salesByDate = new Map()

    // Initialize all dates in the range
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split('T')[0]
      salesByDate.set(dateStr, { date: dateStr, sales: 0, revenue: 0 })
    }

    // Add purchase data
    purchases.forEach((purchase) => {
      const dateStr = purchase.createdAt.toISOString().split('T')[0]
      const dayData = salesByDate.get(dateStr) || {
        date: dateStr,
        sales: 0,
        revenue: 0,
      }

      dayData.sales += 1
      dayData.revenue += purchase.amount

      salesByDate.set(dateStr, dayData)
    })

    // Convert to array and sort by date
    const salesData = Array.from(salesByDate.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    return NextResponse.json(salesData)
  } catch (error) {
    console.error('Error fetching sales analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales analytics' },
      { status: 500 },
    )
  }
}

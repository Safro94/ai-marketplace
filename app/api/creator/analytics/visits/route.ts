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

    // Get the last 14 days of page visit data
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 14)

    // Get all page visits for assets created by this creator
    // Note: This assumes you're tracking page visits in your PageVisit model
    // and that you have a way to associate visits with specific assets
    const visits = await prisma.pageVisit.findMany({
      where: {
        path: {
          startsWith: '/assets/',
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Filter visits to only include this creator's assets
    const creatorAssets = await prisma.asset.findMany({
      where: {
        creatorId: profile.id,
      },
      select: {
        id: true,
      },
    })

    const assetIds = creatorAssets.map((asset) => asset.id)

    // Filter visits to only include paths that match the creator's assets
    const creatorVisits = visits.filter((visit) => {
      const pathParts = visit.path.split('/')
      const assetId = pathParts[pathParts.length - 1]
      return assetIds.includes(assetId)
    })

    // Group visits by date
    const visitsByDate = new Map()

    // Initialize all dates in the range
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split('T')[0]
      visitsByDate.set(dateStr, { date: dateStr, visits: 0 })
    }

    // Add visit data
    creatorVisits.forEach((visit) => {
      const dateStr = visit.createdAt.toISOString().split('T')[0]
      const dayData = visitsByDate.get(dateStr) || { date: dateStr, visits: 0 }

      dayData.visits += 1

      visitsByDate.set(dateStr, dayData)
    })

    // Convert to array and sort by date
    const visitsData = Array.from(visitsByDate.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    return NextResponse.json(visitsData)
  } catch (error) {
    console.error('Error fetching visit analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visit analytics' },
      { status: 500 },
    )
  }
}

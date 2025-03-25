import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { path, sessionId, referrer, userAgent } = await request.json()

    const session = await getServerSession()
    const userId = session?.user?.id

    // Get the IP address
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Create the page visit record
    await prisma.pageVisit.create({
      data: {
        path,
        sessionId,
        userId,
        referrer,
        userAgent,
        ipAddress,
      },
    })

    // If this is an asset page, update the asset analytics
    if (path.startsWith('/assets/')) {
      const assetId = path.split('/').pop()

      if (assetId) {
        // Check if analytics record exists
        const analytics = await prisma.assetAnalytics.findUnique({
          where: { assetId },
        })

        if (analytics) {
          // Update existing analytics
          await prisma.assetAnalytics.update({
            where: { assetId },
            data: {
              views: { increment: 1 },
              // Only count unique views if this is a new session
              uniqueViews: {
                increment: (await isNewSession(assetId, sessionId)) ? 1 : 0,
              },
            },
          })
        } else {
          // Create new analytics record
          await prisma.assetAnalytics.create({
            data: {
              assetId,
              views: 1,
              uniqueViews: 1,
            },
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking page visit:', error)
    return NextResponse.json(
      { error: 'Failed to track page visit' },
      { status: 500 },
    )
  }
}

// Helper function to check if this is a new session for this asset
async function isNewSession(
  assetId: string,
  sessionId: string,
): Promise<boolean> {
  const previousVisit = await prisma.pageVisit.findFirst({
    where: {
      path: `/assets/${assetId}`,
      sessionId,
      createdAt: {
        lt: new Date(),
      },
    },
  })

  return !previousVisit
}

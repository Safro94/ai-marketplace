import { getUserProfile } from '@/data-access/profile'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user profile
    const profile = await getUserProfile(session.user.id)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Mark all notifications as read
    await prisma.notification.updateMany({
      where: {
        profileId: profile.id,
        read: false,
      },
      data: { read: true },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' },
      { status: 500 },
    )
  }
}

import { getUserProfile } from '@/data-access/profile'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
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

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    // Count unread notifications
    const unreadCount = await prisma.notification.count({
      where: {
        profileId: profile.id,
        read: false,
      },
    })

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, message, type, data } = await request.json()

    // Check if user has admin privileges
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id, role: Role.ADMIN },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        profileId: profile.id,
        title,
        message,
        type: type || 'INFO',
        data: data ? JSON.stringify(data) : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      notificationId: notification.id,
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 },
    )
  }
}

import { getUserProfile } from '@/data-access/profile'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession()
  const id = (await params).id

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user profile
    const profile = await getUserProfile(session.user.id)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get notification
    const notification = await prisma.notification.findUnique({
      where: { id },
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 },
      )
    }

    // Check if notification belongs to user
    if (notification.userId !== profile.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Mark notification as read
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 },
    )
  }
}

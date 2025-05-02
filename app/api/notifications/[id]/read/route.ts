import { validateRouteProfilePermissions } from '@/app/api/utils'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 },
      )
    }

    const { profile } = await validateRouteProfilePermissions()

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
    if (notification.profileId !== profile.id) {
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

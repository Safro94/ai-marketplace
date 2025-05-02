import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../../utils'

export async function POST() {
  try {
    const { profile } = await validateRouteProfilePermissions()

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

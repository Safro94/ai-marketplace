import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { ApplicationStatus } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession()

  // Check if user is admin
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { status, reviewNotes } = await request.json()

    if (
      ![ApplicationStatus.APPROVED, ApplicationStatus.REJECTED].includes(status)
    ) {
      return NextResponse.json(
        { error: 'Invalid status. Must be APPROVED or REJECTED' },
        { status: 400 },
      )
    }

    // Get the application
    const application = await prisma.creatorApplication.findUnique({
      where: { id: (await params).id },
      include: {
        creatorProfile: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 },
      )
    }

    // Update application status
    const updatedApplication = await prisma.creatorApplication.update({
      where: { id: (await params).id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewNotes,
      },
    })

    // If approved, update the user's profile to mark them as a creator
    if (status === ApplicationStatus.APPROVED) {
      await prisma.profile.update({
        where: { id: application.creatorProfile.profileId },
        data: {
          isCreator: true,
        },
      })

      revalidateTag(CACHE_KEYS.profile(application.creatorProfile.profileId))

      // Create notification for the user
      // TODO: uncomment
      await prisma.notification.create({
        data: {
          userId: application.creatorProfile.profile.userId,
          title: 'Creator Application Approved',
          message:
            'Congratulations! Your application to become a creator has been approved. You can now start uploading assets.',
          type: 'SUCCESS',
          data: JSON.stringify({ applicationId: application.id }),
        },
      })
    } else {
      // Create rejection notification
      await prisma.notification.create({
        data: {
          userId: application.creatorProfile.profile.userId,
          title: 'Creator Application Rejected',
          message:
            "We're sorry, but your creator application has been rejected. Please see the review notes for more information.",
          type: 'ERROR',
          data: JSON.stringify({
            applicationId: application.id,
            reviewNotes: reviewNotes || 'No additional information provided.',
          }),
        },
      })
    }

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error('Error updating creator application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 },
    )
  }
}

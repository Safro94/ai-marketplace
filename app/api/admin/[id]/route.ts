import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession()

  // Check if user is admin
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { status, reviewNotes } = await request.json()

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be APPROVED or REJECTED' },
        { status: 400 },
      )
    }

    // Get the application
    const application = await prisma.creatorApplication.findUnique({
      where: { id: params.id },
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
      where: { id: params.id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewNotes,
      },
    })

    // If approved, update the user's profile to mark them as a creator
    if (status === 'APPROVED') {
      await prisma.profile.update({
        where: { id: application.creatorProfile.profileId },
        data: {
          isCreator: true,
        },
      })

      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId: application.creatorProfile.profileId,
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
          userId: application.creatorProfile.profileId,
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

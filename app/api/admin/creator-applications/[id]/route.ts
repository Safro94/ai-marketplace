import {
  getCreatorApplicationById,
  updateCreatorApplication,
} from '@/data-access/creator-application'
import { updateProfile } from '@/data-access/profile'
import { CACHE_KEYS } from '@/lib/constants'
import { validateRouteProfilePermissions } from '@/lib/permissions'
import { ApplicationStatus, Role } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await validateRouteProfilePermissions()

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

    const creatorApplicationId = (await params).id

    // Get the application
    const application = await getCreatorApplicationById(creatorApplicationId)

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 },
      )
    }

    // Update application status
    const updatedApplication = await updateCreatorApplication({
      where: { id: creatorApplicationId },
      data: {
        status,
        reviewedAt: new Date(),
        reviewNotes,
      },
    })

    // If approved, update the user's profile to mark them as a creator
    if (status === ApplicationStatus.APPROVED) {
      await updateProfile({
        where: { id: application.creatorProfile.profileId },
        data: {
          role: Role.CREATOR,
        },
      })

      revalidateTag(CACHE_KEYS.profile(application.creatorProfile.profileId))

      //   // Create notification for the user
      //   await prisma.notification.create({
      //     data: {
      //       userId: application.creatorProfile.profile.id,
      //       title: 'Creator Application Approved',
      //       message:
      //         'Congratulations! Your application to become a creator has been approved. You can now start uploading assets.',
      //       type: 'SUCCESS',
      //       data: JSON.stringify({ applicationId: application.id }),
      //     },
      //   })
      // } else {
      //   // Create rejection notification
      //   await prisma.notification.create({
      //     data: {
      //       userId: application.creatorProfile.profile.id,
      //       title: 'Creator Application Rejected',
      //       message:
      //         "We're sorry, but your creator application has been rejected. Please see the review notes for more information.",
      //       type: 'ERROR',
      //       data: JSON.stringify({
      //         applicationId: application.id,
      //         reviewNotes: reviewNotes || 'No additional information provided.',
      //       }),
      //     },
      //   })
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

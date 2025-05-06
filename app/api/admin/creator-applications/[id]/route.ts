import { validateRouteProfilePermissions } from '@/app/api/utils'
import {
  getCreatorApplicationById,
  updateCreatorApplication,
} from '@/data-access/creator-application'
import { getProfileById, updateProfile } from '@/data-access/profile'
import { CACHE_KEYS } from '@/lib/constants'
import {
  notifyCreatorApplicationApproved,
  notifyCreatorApplicationRejected,
} from '@/services/emails/email'
import { ApplicationStatus, Role } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await validateRouteProfilePermissions({
      checkAdminOrCreator: true,
    })

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

    const creatorProfile = await getProfileById(
      application.creatorProfile.profileId,
    )

    // If approved, update the user's profile to mark them as a creator
    if (status === ApplicationStatus.APPROVED) {
      await updateProfile({
        where: { id: application.creatorProfile.profileId },
        data: {
          role: Role.CREATOR,
        },
      })

      if (creatorProfile) {
        revalidateTag(CACHE_KEYS.profile(creatorProfile.user.id))

        await notifyCreatorApplicationApproved({
          name: creatorProfile.user.name,
          email: creatorProfile.user.email,
        })
      }

      //   // Create notification for the user
      //   await prisma.notification.create({
      //     data: {
      //       profileId: application.creatorProfile.profile.id,
      //       title: 'Creator Application Approved',
      //       message:
      //         'Congratulations! Your application to become a creator has been approved. You can now start uploading assets.',
      //       type: 'SUCCESS',
      //       data: JSON.stringify({ applicationId: application.id }),
      //     },
      //   })
    } else {
      if (creatorProfile) {
        await notifyCreatorApplicationRejected({
          name: creatorProfile.user.name,
          email: creatorProfile.user.email,
          notes: reviewNotes,
        })
      }

      //   Create rejection notification
      //   await prisma.notification.create({
      //     data: {
      //       profileId: application.creatorProfile.profile.id,
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
      { status: error instanceof Error ? (error.cause as number) : 500 },
    )
  }
}

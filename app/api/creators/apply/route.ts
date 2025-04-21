import {
  createCreatorApplication,
  getFirstCreatorApplicationByProfileId,
} from '@/data-access/creator-application'
import {
  createCreatorProfile,
  getCreatorProfileByProfileId,
} from '@/data-access/creator-profile'
import { getUserProfile } from '@/data-access/profile'
import { CACHE_KEYS } from '@/lib/constants'
import { creatorApplicationSchema } from '@/lib/schemas'
import { getServerSession } from '@/lib/session'
import { ApplicationStatus } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user profile
  const profile = await getUserProfile(session.user.id)

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  try {
    const data = await request.json()

    // Validate input data
    const validationResult = creatorApplicationSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid creator application data',
          details: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    // Check if user already has a creator profile or pending application
    const existingCreatorProfile = await getCreatorProfileByProfileId(
      profile.id,
    )

    if (existingCreatorProfile) {
      return NextResponse.json(
        { error: 'You already have a creator profile' },
        { status: 400 },
      )
    }

    const existingApplication = await getFirstCreatorApplicationByProfileId(
      profile.id,
    )

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have a pending application' },
        { status: 400 },
      )
    }

    // Create creator profile (initially not approved)
    const creatorProfile = await createCreatorProfile({
      profileId: profile.id,
      expertise: validationResult.data.expertise,
      experience: validationResult.data.experience,
      portfolio: validationResult.data.portfolio || null,
      paymentMethods: {
        create: validationResult.data.paymentMethods,
      },
    })

    revalidateTag(CACHE_KEYS.creatorDashboardCreatorProfile(profile.id))

    // Create creator application
    const application = await createCreatorApplication({
      creatorProfile: { connect: { id: creatorProfile.id } },
      fullName: validationResult.data.fullName,
      email: validationResult.data.email,
      website: validationResult.data.website || null,
      expertise: validationResult.data.expertise,
      experience: validationResult.data.experience,
      bio: validationResult.data.bio,
      assetTypes: validationResult.data.assetTypes,
      portfolio: validationResult.data.portfolio || null,
      status: ApplicationStatus.PENDING,
    })

    // Create notification for admin
    // TODO: uncomment
    // await prisma.notification.create({
    //   data: {
    //     profileId: 'admin', // Assuming there's an admin user ID
    //     title: 'New Creator Application',
    //     message: `${data.fullName} has applied to become a creator.`,
    //     type: 'INFO',
    //     data: JSON.stringify({ applicationId: application.id }),
    //   },
    // })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application.id,
    })
  } catch (error) {
    console.error('Error creating creator application:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 },
    )
  }
}

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { ApplicationStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if user already has a creator profile or pending application
    const existingCreatorProfile = await prisma.creatorProfile.findUnique({
      where: { profileId: profile.id },
    })

    if (existingCreatorProfile) {
      return NextResponse.json(
        { error: 'You already have a creator profile' },
        { status: 400 },
      )
    }

    const existingApplication = await prisma.creatorApplication.findFirst({
      where: {
        creatorProfile: {
          profileId: profile.id,
        },
        status: ApplicationStatus.PENDING,
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have a pending application' },
        { status: 400 },
      )
    }

    // Create creator profile (initially not approved)
    const creatorProfile = await prisma.creatorProfile.create({
      data: {
        profile: { connect: { id: profile.id } },
        expertise: data.expertise,
        experience: data.experience,
        portfolio: data.portfolio || null,
        paymentDetails: {},
      },
    })

    // Create creator application
    const application = await prisma.creatorApplication.create({
      data: {
        creatorProfile: { connect: { id: creatorProfile.id } },
        fullName: data.fullName,
        email: data.email,
        website: data.website || null,
        expertise: data.expertise,
        experience: data.experience,
        bio: data.bio,
        assetTypes: data.assetTypes,
        portfolio: data.portfolio || null,
        status: ApplicationStatus.PENDING,
      },
    })

    // Create notification for admin
    // TODO: uncomment
    // await prisma.notification.create({
    //   data: {
    //     userId: 'admin', // Assuming there's an admin user ID
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

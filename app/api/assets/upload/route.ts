import { assetUploadSchema } from '@/app/creator-dashboard/upload/asset-upload-schema'
import { CACHE_KEYS } from '@/lib/constants'
import { validateRouteProfilePermissions } from '@/lib/db/permissions'
import prisma from '@/lib/prisma'
import { ModerationService } from '@/services/ModerationService'
import { AssetStatus, Role } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const result = await validateRouteProfilePermissions(Role.CREATOR)
  if (result instanceof NextResponse) return result
  const { profile } = result

  try {
    const data = (await request.json()) as typeof assetUploadSchema

    // Validate input data
    const validationResult = assetUploadSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid asset data',
          details: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const { licenses, features, requirements, ...assetData } =
      validationResult.data

    // Check if slug is unique
    const existingAsset = await prisma.asset.findUnique({
      where: { slug: assetData.slug },
    })

    if (existingAsset) {
      // Generate a unique slug by appending a timestamp
      assetData.slug = `${assetData.slug}-${Date.now()}`
    }

    // Create the asset
    const asset = await prisma.asset.create({
      data: {
        ...assetData,
        creatorId: profile.id,
        basePrice: Number(
          Math.min(...licenses.map((license) => license.price)).toFixed(2),
        ),
        features: features.split(',').filter((f) => f.trim()),
        requirements: requirements
          ? requirements.split(',').filter((r) => r.trim())
          : [],
        status: AssetStatus.PENDING_REVIEW,
        views: 0,
        totalSales: 0,
        totalReviews: 0,
        featured: false,
      },
    })

    // Create license options for the asset
    if (!!licenses?.length) {
      for (const license of licenses) {
        await prisma.assetLicense.create({
          data: {
            assetId: asset.id,
            licenseId: license.licenseId,
            price: license.price,
          },
        })
      }
    }

    // Run auto-moderation
    const moderationResult = await ModerationService.autoModerateAsset(asset.id)

    // Update asset with moderation results
    await prisma.asset.update({
      where: { id: asset.id },
      data: {
        status: moderationResult.status,
        moderationNotes: moderationResult.issues.join(', '),
      },
    })

    // Notify admins if manual review is needed
    if (moderationResult.status === AssetStatus.PENDING_REVIEW) {
      // Create notification for admins
      const admins = await prisma.profile.findMany({
        where: { role: Role.ADMIN },
      })

      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'New Asset Pending Review',
            message: `Asset "${asset.title}" by ${profile.name} requires review.`,
            type: 'INFO',
            data: JSON.stringify({ assetId: asset.id }),
          },
        })
      }
    }

    // Update creator stats
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        totalAssets: { increment: 1 },
      },
    })

    revalidateTag(CACHE_KEYS.profile(profile.id))

    return NextResponse.json({
      success: true,
      assetId: asset.id,
      status: moderationResult.status,
      issues: moderationResult.issues,
    })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  const result = await validateRouteProfilePermissions(Role.CREATOR)
  if (result instanceof NextResponse) return result
  const { profile } = result

  try {
    const data = (await request.json()) as typeof assetUploadSchema

    // Validate input data
    const validationResult = assetUploadSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid asset data',
          details: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const { licenses, features, requirements, ...assetData } =
      validationResult.data

    // Create the asset
    const asset = await prisma.asset.update({
      where: { slug: assetData.slug },
      data: {
        ...assetData,
        creatorId: profile.id,
        basePrice: Number(
          Math.min(...licenses.map((license) => license.price)).toFixed(2),
        ),
        features: features.split(',').filter((f) => f.trim()),
        requirements: requirements
          ? requirements.split(',').filter((r) => r.trim())
          : [],
        status: AssetStatus.PENDING_REVIEW,
        views: 0,
        totalSales: 0,
        totalReviews: 0,
        featured: false,
      },
    })

    // Create license options for the asset
    if (!!licenses?.length) {
      for (const license of licenses) {
        await prisma.assetLicense.update({
          where: {
            assetId_licenseId: {
              assetId: asset.id,
              licenseId: license.licenseId,
            },
          },
          data: {
            price: license.price,
          },
        })
      }
    }

    // Run auto-moderation
    const moderationResult = await ModerationService.autoModerateAsset(asset.id)

    // Update asset with moderation results
    await prisma.asset.update({
      where: { id: asset.id },
      data: {
        status: moderationResult.status,
        moderationNotes: moderationResult.issues.join(', '),
      },
    })

    // Notify admins if manual review is needed
    if (moderationResult.status === AssetStatus.PENDING_REVIEW) {
      // Create notification for admins
      const admins = await prisma.profile.findMany({
        where: { role: Role.ADMIN },
      })

      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'New Asset Pending Review',
            message: `Asset "${asset.title}" by ${profile.name} requires review.`,
            type: 'INFO',
            data: JSON.stringify({ assetId: asset.id }),
          },
        })
      }
    }

    // Update creator stats
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        totalAssets: { increment: 1 },
      },
    })

    revalidateTag(CACHE_KEYS.profile(profile.id))

    return NextResponse.json({
      success: true,
      assetId: asset.id,
      status: moderationResult.status,
      issues: moderationResult.issues,
    })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 },
    )
  }
}

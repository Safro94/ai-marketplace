import {
  createAssetLicense,
  deleteAssetLicense,
  updateAssetLincese,
} from '@/data-access/asset-licenses'
import {
  createAsset,
  getAssetById,
  getAssetBySlug,
  updateAsset,
} from '@/data-access/assets'
import { updateProfile } from '@/data-access/profile'
import { CACHE_KEYS } from '@/lib/constants'
import { assetUploadSchema } from '@/lib/schemas'
import {
  notifyAssetApproved,
  notifyAssetRejected,
} from '@/services/emails/email'
import { ModerationService } from '@/services/ModerationService'
import { AssetStatus, LicenseType } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../../utils'

export async function POST(request: Request) {
  try {
    const { profile, user } = await validateRouteProfilePermissions()

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
    const existingAsset = await getAssetBySlug(assetData.slug)

    if (existingAsset) {
      // Generate a unique slug by appending a timestamp
      assetData.slug = `${assetData.slug}-${Date.now()}`
    }

    // Create the asset
    const asset = await createAsset({
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
      totalSales: 0,
      totalReviews: 0,
      featured: false,
    })

    // Create license options for the asset
    for (const license of licenses) {
      await createAssetLicense({
        assetId: asset.id,
        licenseId: license.licenseId,
        price: license.price,
        createdAt: new Date(),
      })

      revalidateTag(CACHE_KEYS.assetLicenses(asset.id))
    }

    // Run auto-moderation
    const moderationResult = await ModerationService.autoModerateAsset(asset.id)

    // Update asset with moderation results
    await updateAsset({
      assetId: asset.id,
      status: moderationResult.status,
      moderationNotes: moderationResult.issues.join(', '),
    })

    revalidateTag(CACHE_KEYS.assetById(asset.id))

    if (moderationResult.status === AssetStatus.PUBLISHED) {
      await notifyAssetApproved({ assetName: asset.title, email: user.email })
    } else if (moderationResult.status === AssetStatus.REJECTED) {
      await notifyAssetRejected({ assetName: asset.title, email: user.email })
    }

    // // Notify admins if manual review is needed
    // if (moderationResult.status === AssetStatus.PENDING_REVIEW) {
    //   // Create notification for admins
    //   const admins = await prisma.profile.findMany({
    //     where: { role: Role.ADMIN },
    //   })

    //   for (const admin of admins) {
    //     await prisma.notification.create({
    //       data: {
    //         profileId: admin.id,
    //         title: 'New Asset Pending Review',
    //         message: `Asset "${asset.title}" by ${profile.name} requires review.`,
    //         type: 'INFO',
    //         data: JSON.stringify({ assetId: asset.id }),
    //       },
    //     })
    //   }
    // }

    // Update creator stats
    await updateProfile({
      where: { id: profile.id },
      data: {
        totalAssets: { increment: 1 },
      },
    })

    revalidateTag(CACHE_KEYS.profile(profile.id))
    revalidateTag(CACHE_KEYS.exploreAssets())
    revalidateTag(CACHE_KEYS.categoriesWithCount())

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
  try {
    await validateRouteProfilePermissions()

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

    const { id, licenses, features, requirements, ...assetData } =
      validationResult.data

    // Check if slug is unique
    const existingAsset = await getAssetById(id!, {
      assetLicenses: true,
    })

    // update the asset
    const asset = await updateAsset({
      assetId: id!,
      ...assetData,
      basePrice: Number(
        Math.min(...licenses.map((license) => license.price)).toFixed(2),
      ),
      features: features.split(',').filter((f) => f.trim()),
      requirements: requirements
        ? requirements.split(',').filter((r) => r.trim())
        : [],
      status: AssetStatus.PENDING_REVIEW,
      featured: false,
    })

    const existingLicenses = existingAsset?.assetLicenses ?? []
    const existingLicenseIds = new Set(existingLicenses.map((l) => l.licenseId))
    const incomingLicenseIds = new Set(licenses.map((l) => l.licenseId))
    const now = new Date()
    const operations: Promise<unknown>[] = []

    for (const license of licenses) {
      const exists = existingLicenseIds.has(license.licenseId)

      if (exists) {
        operations.push(
          updateAssetLincese({
            where: {
              assetId_licenseId: {
                assetId: asset.id,
                licenseId: license.licenseId,
              },
            },
            data: {
              price: license.price,
              updatedAt: now,
            },
          }),
        )
      } else {
        operations.push(
          createAssetLicense({
            assetId: asset.id,
            licenseId: license.licenseId,
            price: license.price,
            createdAt: now,
          }),
        )
      }
    }

    // Si tenía EXTENDED pero ya no está en la nueva lista => borrarla
    if (
      existingLicenseIds.has(LicenseType.EXTENDED) &&
      !incomingLicenseIds.has(LicenseType.EXTENDED)
    ) {
      operations.push(
        deleteAssetLicense({
          assetId_licenseId: {
            assetId: asset.id,
            licenseId: LicenseType.EXTENDED,
          },
        }),
      )
    }

    await Promise.all(operations)
    revalidateTag(CACHE_KEYS.assetLicenses(asset.id))

    // Run auto-moderation
    const moderationResult = await ModerationService.autoModerateAsset(asset.id)

    // Update asset with moderation results
    await updateAsset({
      assetId: asset.id,
      status: moderationResult.status,
      moderationNotes: moderationResult.issues.join(', '),
    })

    revalidateTag(CACHE_KEYS.assetById(asset.id))
    revalidateTag(CACHE_KEYS.exploreAssets())
    revalidateTag(CACHE_KEYS.categoriesWithCount())

    // // Notify admins if manual review is needed
    // if (moderationResult.status === AssetStatus.PENDING_REVIEW) {
    //   // Create notification for admins
    //   const admins = await prisma.profile.findMany({
    //     where: { role: Role.ADMIN },
    //   })

    //   for (const admin of admins) {
    //     await prisma.notification.create({
    //       data: {
    //         profileId: admin.id,
    //         title: 'New Asset Pending Review',
    //         message: `Asset "${asset.title}" by ${profile.name} requires review.`,
    //         type: 'INFO',
    //         data: JSON.stringify({ assetId: asset.id }),
    //       },
    //     })
    //   }
    // }

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
      { status: error instanceof Error ? (error.cause as number) : 500 },
    )
  }
}

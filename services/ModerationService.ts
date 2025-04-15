import { getAssetById } from '@/data-access/assets'
import { AssetStatus } from '@prisma/client'

export class ModerationService {
  /**
   * Automatically checks an asset for potential issues
   */
  static async autoModerateAsset(assetId: string) {
    const asset = await getAssetById(assetId, {
      creator: true,
    })

    if (!asset) {
      throw new Error('Asset not found')
    }

    const issues: string[] = []
    let score = 0

    // Check title length
    if (asset.title.length < 5) {
      issues.push('Title is too short')
      score += 10
    }

    // Check description length
    if (asset.description.length < 50) {
      issues.push('Description is too short')
      score += 10
    }

    // Check for missing preview images
    if (!asset.featuredImage || !asset.galleryImages.length) {
      issues.push('Missing preview images')
      score += 20
    }

    // Check for missing asset file
    if (!asset.assetFile) {
      issues.push('Missing asset file')
      score += 50
    }

    // Check for missing features
    if (!asset.features.length) {
      issues.push('No features listed')
      score += 10
    }

    // Determine status based on score
    let status: AssetStatus = AssetStatus.PUBLISHED
    if (score >= 50) {
      status = AssetStatus.REJECTED
    } else if (score > 0) {
      status = AssetStatus.PENDING_REVIEW
    }

    // New creators always go to manual review for their first few assets
    if (
      asset.creator.totalAssets < 3 &&
      (status === AssetStatus.PUBLISHED ||
        status === AssetStatus.PENDING_REVIEW)
    ) {
      status = AssetStatus.PENDING_REVIEW
      issues.push('New creator verification')
    }

    return { status, issues, score }
  }
}

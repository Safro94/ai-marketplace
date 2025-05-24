'use server'

import { updateAsset } from '@/data-access/assets'
import { getDownloadsByAssetIdAndProfile } from '@/data-access/download'
import { getUserProfile } from '@/data-access/profile'
import { checkUserPurchasedAsset } from '@/data-access/purchases'
import { createReview, getReviewsByAssetId } from '@/data-access/reviews'
import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import type { Prisma } from '@prisma/client'
import { revalidateTag } from 'next/cache'

export const createReviewAction = withErrorHandler(
  async (
    assetId: string,
    basePrice: number,
    data: Prisma.ReviewCreateInput,
  ) => {
    const { user } = await validateSession()
    const profile = await getUserProfile(user.id)

    if (!profile?.id) throw Error('Profile not found')

    const { isPurchased } = await checkUserPurchasedAsset(profile.id, assetId)
    if (!!basePrice && !isPurchased) {
      throw Error('You must purchase the asset first before leaving a review')
    }

    const downloads = await getDownloadsByAssetIdAndProfile(assetId, profile.id)
    if (!basePrice && !downloads) {
      throw Error('You must download the asset first before leaving a review')
    }

    const review = await createReview(data)

    // Update asset average rating
    const assetReviews = await getReviewsByAssetId({ assetId })

    const totalRating = assetReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    )
    const averageRating = totalRating / assetReviews.length

    await updateAsset({
      assetId,
      averageRating,
      totalReviews: assetReviews.length,
    })

    revalidateTag(CACHE_KEYS.assetReviews(assetId))
    revalidateTag(CACHE_KEYS.assetById(assetId))
    revalidateTag(CACHE_KEYS.exploreAssets())
    revalidateTag(CACHE_KEYS.dashboardReviews(review.userProfileId))

    return review
  },
)

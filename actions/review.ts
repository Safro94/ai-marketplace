'use server'

import { updateAsset } from '@/data-access/assets'
import { createReview, getReviewsByAssetId } from '@/data-access/reviews'
import { CACHE_KEYS } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import type { Prisma } from '@prisma/client'
import { revalidateTag } from 'next/cache'

export async function createReviewAction(data: Prisma.ReviewCreateInput) {
  await validateSession()

  const review = await createReview(data)
  const assetId = data.asset.connect?.id as string

  // Update asset average rating
  const assetReviews = await getReviewsByAssetId(assetId)

  const totalRating = assetReviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  )
  const averageRating = totalRating / assetReviews.length

  await updateAsset({
    assetId: assetId,
    averageRating,
    totalReviews: assetReviews.length,
  })

  revalidateTag(CACHE_KEYS.exploreAssets())
  revalidateTag(
    CACHE_KEYS.dashboardReviews(data.userProfile.connect?.id as string),
  )

  return review
}

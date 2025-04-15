'use server'

import { updateAsset } from '@/data-access/assets'
import { createReview, getReviewsByAssetId } from '@/data-access/reviews'
import type { Prisma } from '@prisma/client'

export async function createReviewAction(data: Prisma.ReviewCreateInput) {
  const review = await createReview({
    ...data,
  })

  // Update asset average rating
  const assetReviews = await getReviewsByAssetId(data.asset.connect?.id)

  const totalRating = assetReviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  )
  const averageRating = totalRating / assetReviews.length

  await updateAsset({
    assetId: data.asset.connect?.id as string,
    averageRating,
    totalReviews: assetReviews.length,
  })

  return review
}

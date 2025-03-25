import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// Used in review-form.tsx
export async function createReview(data: Prisma.ReviewCreateInput) {
  const review = await prisma.review.create({
    data,
  })

  // Update asset average rating
  const assetReviews = await prisma.review.findMany({
    where: { assetId: data.asset.connect?.id },
  })

  const totalRating = assetReviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  )
  const averageRating = totalRating / assetReviews.length

  await prisma.asset.update({
    where: { id: data.asset.connect?.id },
    data: {
      averageRating,
      reviewCount: assetReviews.length,
    },
  })

  return review
}

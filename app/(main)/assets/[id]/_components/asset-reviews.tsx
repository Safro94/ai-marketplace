import { Progress } from '@/components/ui/progress'
import { Prisma } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import { FC } from 'react'
import { AssetDetailsReviewsList } from './asset-detail-review-list'
import { ReviewForm } from './review-form'

interface Props
  extends Prisma.AssetGetPayload<{
    select: {
      reviews: {
        include: {
          userProfile: {
            include: {
              user: {
                select: {
                  name: true
                  image: true
                }
              }
            }
          }
        }
      }
    }
  }> {
  assetId: string
}

export const AssetReviews: FC<Props> = ({ assetId, reviews }) => {
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0] // 1-5 stars
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++
  })

  const totalReviews = reviews.length
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0

  return (
    <div className='space-y-8'>
      <div className='grid  md:grid-cols-2 gap-8'>
        <div>
          <div className='flex items-center space-x-4 mb-6'>
            <span className='text-4xl font-bold'>
              {averageRating.toFixed(1)}
            </span>

            <div>
              <div className='flex'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(averageRating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className='text-sm text-muted-foreground mt-1'>
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className='grid grid-cols-[max-content_1fr_max-content] items-center space-x-2'
            >
              <div className='w-12 text-sm text-muted-foreground'>
                {rating} {rating === 1 ? 'star' : 'stars'}
              </div>

              <Progress
                value={(ratingCounts[rating - 1] / totalReviews) * 100 || 0}
                className='h-2'
              />

              <div className='w-12 text-sm text-right text-muted-foreground'>
                {ratingCounts[rating - 1]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-6'>
        {!!reviews.length ? (
          <AssetDetailsReviewsList assetId={assetId} reviews={reviews} />
        ) : (
          <div className='text-center py-8 border rounded-lg'>
            <p className='text-muted-foreground mb-2'>No reviews yet</p>
            <p className='text-sm text-muted-foreground'>
              Be the first to review this asset
            </p>
          </div>
        )}
      </div>

      <ReviewForm assetId={assetId} />
    </div>
  )
}

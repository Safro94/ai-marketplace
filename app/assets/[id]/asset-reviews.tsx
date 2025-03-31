'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatDate } from '@/lib/utils'
import { Review as PrismaReview } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import { FC, useState } from 'react'
import { ReviewForm } from './review-form'

interface Review extends PrismaReview {
  user: {
    name: string | null
    avatarUrl: string | null
  }
}

interface Props {
  assetId: string
  reviews: Review[]
  isPurchased: boolean
}

export const AssetReviews: FC<Props> = ({ assetId, reviews, isPurchased }) => {
  const [visibleReviews, setVisibleReviews] = useState(3)

  const loadMoreReviews = () => {
    setVisibleReviews(reviews.length)
  }

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
          <>
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className='border-b border-border/50 pb-6 last:border-0'
              >
                <div className='flex items-start justify-between mb-2'>
                  <div className='flex items-center space-x-3'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={
                          review.user.avatarUrl ||
                          '/placeholder.svg?height=40&width=40'
                        }
                        alt={review.user.name || 'User'}
                      />

                      <AvatarFallback>
                        {(review.user.name || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className='font-medium'>
                        {review.user.name || 'Anonymous User'}
                      </div>

                      <div className='text-xs text-muted-foreground'>
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <div className='flex'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    {review.isVerified && (
                      <Badge
                        variant='outline'
                        className='text-xs bg-green-50 text-green-700 border-green-200'
                      >
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                </div>

                <h4 className='font-medium mb-1'>{review.title}</h4>
                <p className='text-sm text-muted-foreground'>
                  {review.comment}
                </p>
              </div>
            ))}

            {visibleReviews < reviews.length && (
              <div className='text-center'>
                <Button variant='outline' onClick={loadMoreReviews}>
                  Load More Reviews
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className='text-center py-8 border rounded-lg'>
            <p className='text-muted-foreground mb-2'>No reviews yet</p>
            <p className='text-sm text-muted-foreground'>
              Be the first to review this asset
            </p>
          </div>
        )}
      </div>

      {isPurchased && (
        <div className='mt-8 pt-8 border-t'>
          <h3 className='text-xl font-semibold mb-4'>Write a Review</h3>
          <ReviewForm assetId={assetId} />
        </div>
      )}
    </div>
  )
}

'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatDate } from '@/lib/utils'
import { FC, useEffect, useState } from 'react'
import { ReviewForm } from './review-form'

interface Review {
  id: string
  userId: string
  user: {
    name: string | null
    avatarUrl: string | null
  }
  rating: number
  title: string
  content: string
  createdAt: Date
}

interface Props {
  assetId: string
  initialReviews?: Review[]
}

export const AssetReviews: FC<Props> = ({ assetId, initialReviews }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || [])
  const [visibleReviews, setVisibleReviews] = useState(3)
  const [loading, setLoading] = useState(!initialReviews?.length || false)

  // Fetch reviews if not provided initially
  useEffect(() => {
    if (!initialReviews?.length) {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`/api/assets/${assetId}/reviews`)
          if (response.ok) {
            const data = await response.json()
            setReviews(data)
          }
        } catch (error) {
          console.error('Error fetching reviews:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchReviews()
    }
  }, [assetId, initialReviews])

  const loadMoreReviews = () => {
    setVisibleReviews(reviews.length)
  }

  const handleReviewSubmitted = async () => {
    // Refresh reviews after a new one is submitted
    try {
      const response = await fetch(`/api/assets/${assetId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error refreshing reviews:', error)
    }
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

  if (loading) {
    return (
      <div className='flex justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <div className='flex items-center space-x-4 mb-6'>
            <div className='text-4xl font-bold'>{averageRating.toFixed(1)}</div>
            <div>
              <div className='flex'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill={
                      star <= Math.round(averageRating)
                        ? 'currentColor'
                        : 'none'
                    }
                    stroke='currentColor'
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <path
                      fillRule='evenodd'
                      d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                      clipRule='evenodd'
                    />
                  </svg>
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
            <div key={rating} className='flex items-center space-x-2'>
              <div className='w-12 text-sm text-muted-foreground'>
                {rating} stars
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
        {reviews.length > 0 ? (
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
                  <div className='flex'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill={star <= review.rating ? 'currentColor' : 'none'}
                        stroke='currentColor'
                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500' : 'text-muted-foreground'}`}
                      >
                        <path
                          fillRule='evenodd'
                          d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                          clipRule='evenodd'
                        />
                      </svg>
                    ))}
                  </div>
                </div>
                <h4 className='font-medium mb-1'>{review.title}</h4>
                <p className='text-sm text-muted-foreground'>
                  {review.content}
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

      <div className='mt-8 pt-8 border-t'>
        <h3 className='text-xl font-semibold mb-4'>Write a Review</h3>
        <ReviewForm
          assetId={assetId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </div>
  )
}

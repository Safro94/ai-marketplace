'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/hooks/use-auth'
import { createReview } from '@/lib/db/reviews'
import { StarIcon } from 'lucide-react'
import { FC, useState } from 'react'

interface Props {
  assetId: string
  onReviewSubmitted?: () => void
}

export const ReviewForm: FC<Props> = ({ assetId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to submit a review',
      })
      return
    }

    if (rating === 0) {
      toast.error('Rating required', {
        description: 'Please select a rating',
      })
      return
    }

    if (!title.trim()) {
      toast.error('Title required', {
        description: 'Please provide a review title',
      })
      return
    }

    if (!content.trim()) {
      toast.error('Review content required', {
        description: 'Please provide review content',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createReview({
        asset: { connect: { id: assetId } },
        user: { connect: { userId: user.id } },
        rating,
        title,
        content,
      })

      toast.success('Review submitted', {
        description: 'Thank you for your feedback!',
      })

      // Reset form
      setRating(0)
      setTitle('')
      setContent('')

      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      console.error('Review submission error:', error)

      toast.error('Error', {
        description:
          'There was a problem submitting your review. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>Your Rating</label>
        <div className='flex'>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type='button'
              className='p-1'
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <StarIcon
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor='review-title'
          className='block text-sm font-medium mb-2'
        >
          Review Title
        </label>
        <input
          id='review-title'
          className='w-full px-3 py-2 border border-border rounded-md bg-background'
          placeholder='Summarize your experience'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor='review-content'
          className='block text-sm font-medium mb-2'
        >
          Review Content
        </label>
        <Textarea
          id='review-content'
          placeholder='Share your experience with this asset'
          className='min-h-[120px]'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? (
          <span className='flex items-center'>
            <svg
              className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            Submitting...
          </span>
        ) : (
          'Submit Review'
        )}
      </Button>
    </form>
  )
}

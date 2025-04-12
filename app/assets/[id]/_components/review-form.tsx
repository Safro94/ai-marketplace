'use client'

import { createReview } from '@/actions/review'
import { LoadingButton } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/hooks/use-auth'
import { StarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface Props {
  assetId: string
}

export const ReviewForm: FC<Props> = ({ assetId }) => {
  const { user } = useAuth()
  const router = useRouter()

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to submit a review',
      })
      return
    }

    if (!rating) {
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

    if (!comment.trim()) {
      toast.error('Review comment required', {
        description: 'Please provide review comment',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createReview({
        asset: { connect: { id: assetId } },
        userProfile: { connect: { userId: user.id } },
        rating,
        title,
        comment,
      })

      toast.success('Review submitted', {
        description: 'Thank you for your feedback!',
      })

      // Reset form
      setRating(0)
      setTitle('')
      setComment('')

      router.refresh()
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
        <Label
          htmlFor='review-title'
          className='block text-sm font-medium mb-2'
        >
          Review Title
        </Label>

        <Input
          id='review-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Summarize your experience'
          maxLength={100}
        />
      </div>

      <div>
        <Label
          htmlFor='review-content'
          className='block text-sm font-medium mb-2'
        >
          Comment
        </Label>

        <Textarea
          id='review-comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Share your experience with this asset'
          className='min-h-[100px]'
          maxLength={1000}
        />
      </div>

      <LoadingButton
        isLoading={isSubmitting}
        type='submit'
        disabled={isSubmitting}
      >
        Submit Review
      </LoadingButton>

      <p className='text-xs text-muted-foreground'>
        Reviews are moderated and will be visible after approval. You can only
        review each asset once.
      </p>
    </form>
  )
}

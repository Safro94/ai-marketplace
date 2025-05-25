'use client'

import { createReviewAction } from '@/actions/review'
import { LoadingButton } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/hooks/use-auth'
import { StarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState, useTransition } from 'react'

interface Props {
  assetId: string
  basePrice: number
}

export const ReviewForm: FC<Props> = ({ assetId, basePrice }) => {
  const { user } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')

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

    startTransition(async () => {
      const { error } = await createReviewAction(assetId, basePrice, {
        asset: { connect: { id: assetId } },
        userProfile: { connect: { userId: user.id } },
        rating,
        title,
        comment,
      })

      if (error) {
        toast.error('Error', {
          description:
            'There was a problem submitting your review. Remember you can only review assets once.',
        })

        return
      }

      toast.success('Review submitted', {
        description: 'Thank you for your feedback!',
      })

      startTransition(() => {
        // Reset form
        setRating(0)
        setTitle('')
        setComment('')
      })

      router.refresh()
    })
  }

  return (
    <div className='mt-8 pt-8 border-t'>
      <h3 className='text-xl font-semibold mb-4'>Write a Review</h3>
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
            currentLength={comment?.length}
          />
        </div>

        <LoadingButton type='submit' isLoading={isPending} disabled={isPending}>
          Submit Review
        </LoadingButton>

        <p className='text-xs text-muted-foreground'>
          Reviews are moderated and will be visible after approval. You can only
          review each asset once.
        </p>
      </form>
    </div>
  )
}

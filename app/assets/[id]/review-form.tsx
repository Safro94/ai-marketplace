'use client'

import { useSupabase } from '@/app/supabase-provider'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { StarIcon } from 'lucide-react'
import { FC, useState } from 'react'

interface Props {
  assetId: number
  onReviewSubmitted?: () => void
}

export const ReviewForm: FC<Props> = ({ assetId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit a review',
        variant: 'destructive',
      })
      return
    }

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating',
        variant: 'destructive',
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please provide a review title',
        variant: 'destructive',
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: 'Review content required',
        description: 'Please provide review content',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be a call to submit the review
      // const { error } = await supabase
      //   .from('reviews')
      //   .insert({
      //     asset_id: assetId,
      //     user_id: user.id,
      //     rating,
      //     title,
      //     content,
      //     created_at: new Date().toISOString(),
      //   })

      // if (error) throw error

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: 'Review submitted',
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
      toast({
        title: 'Error',
        description:
          'There was a problem submitting your review. Please try again.',
        variant: 'destructive',
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

import { NotFound } from '@/components/not-found'
import { Card, CardContent } from '@/components/ui/card'
import { getUserProfile } from '@/data-access/profile'
import { getDashboardReviews } from '@/data-access/reviews'
import { ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { formatDate } from '@/lib/utils'
import { FileText, StarIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function Revieiws() {
  const { user } = await validateSession(ROUTES.dashboard())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  const reviews = await getDashboardReviews(profile.id)

  return (
    <Card>
      {!!reviews.length ? (
        <CardContent className='py-6'>
          <div className='space-y-6'>
            {reviews.map((review) => (
              <div key={review.id} className='border-b pb-6 last:border-0'>
                <div className='flex items-start justify-between mb-2'>
                  <div>
                    <h4 className='font-medium'>{review.asset.title}</h4>
                    <div className='flex mt-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className='h-4 w-4 fill-yellow-400 text-yellow-400'
                        />
                      ))}
                    </div>
                  </div>

                  <div className='text-xs text-muted-foreground'>
                    {formatDate(review.createdAt)}
                  </div>
                </div>

                <h5 className='font-medium mb-1'>{review.title}</h5>

                <p className='text-sm text-muted-foreground'>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      ) : (
        <NotFound
          title='No reviews yet'
          description="You haven't written any reviews yet. Share your experience with assets you've purchased."
          icon={FileText}
        />
      )}
    </Card>
  )
}

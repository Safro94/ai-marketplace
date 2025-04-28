import { NotFound } from '@/components/not-found'
import { Card, CardContent } from '@/components/ui/card'
import { getUserProfile } from '@/data-access/profile'
import { getDashboardReviews } from '@/data-access/reviews'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS, ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { FileText } from 'lucide-react'
import { redirect } from 'next/navigation'
import { ReviewsList } from './_components/reviews-list'

export default async function Revieiws() {
  const { user } = await validateSession(ROUTES.dashboard())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  const reviews = await getDashboardReviews({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
  })

  return (
    <Card>
      {!!reviews.length ? (
        <CardContent className='py-6'>
          <div className='space-y-6'>
            <ReviewsList reviews={reviews} />
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

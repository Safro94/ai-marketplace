import { NotFound } from '@/components/not-found'
import { DashboardPageContainer } from '@/components/page-container'
import { Card, CardContent } from '@/components/ui/card'
import { getDashboardReviews } from '@/data-access/reviews'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS } from '@/lib/constants'
import { FileText } from 'lucide-react'
import { getCachedProfileData } from '../utils'
import { ReviewsList } from './_components/reviews-list'

export default async function Revieiws() {
  const { profile } = await getCachedProfileData()

  const reviews = await getDashboardReviews({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
  })

  return (
    <DashboardPageContainer title='Reviews'>
      <Card>
        {!!reviews.length ? (
          <CardContent className='py-6'>
            <ReviewsList reviews={reviews} />
          </CardContent>
        ) : (
          <NotFound
            title='No reviews yet'
            description="You haven't written any reviews yet. Share your experience with assets you've purchased."
            icon={FileText}
          />
        )}
      </Card>
    </DashboardPageContainer>
  )
}

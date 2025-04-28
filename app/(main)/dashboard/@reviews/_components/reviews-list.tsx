'use client'

import { InfiniteScrollList } from '@/components/ui/infinite-scroll-list'
import { API_ROUTES } from '@/lib/constants'
import { ComponentProps, FC } from 'react'

import { Review } from './review'

type ReviewsProps = ComponentProps<typeof Review>

interface Props {
  reviews: ReviewsProps[]
}

export const ReviewsList: FC<Props> = ({ reviews }) => {
  return (
    <InfiniteScrollList<ReviewsProps>
      initialData={reviews}
      endpointUrl={API_ROUTES.dashboardReviews()}
      ItemComponent={(item) => <Review {...item} />}
    />
  )
}

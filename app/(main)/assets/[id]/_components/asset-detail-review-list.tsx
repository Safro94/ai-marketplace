'use client'

import { InfiniteScrollList } from '@/components/ui/infinite-scroll-list'
import { API_ROUTES } from '@/lib/constants'
import { ComponentProps, FC } from 'react'
import { AssetDetailReview } from './asset-detail-review'

type ReviewsProps = ComponentProps<typeof AssetDetailReview>

interface Props {
  assetId: string
  reviews: ReviewsProps[]
}

export const AssetDetailsReviewsList: FC<Props> = ({ reviews, assetId }) => {
  return (
    <InfiniteScrollList<ReviewsProps>
      initialData={reviews}
      endpointUrl={API_ROUTES.assetReviews(assetId)}
      ItemComponent={(item) => <AssetDetailReview {...item} />}
    />
  )
}

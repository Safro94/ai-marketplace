'use client'

import { PurchasedItemCard } from '@/components/purchased-item-card'
import { InfiniteScrollList } from '@/components/ui/infinite-scroll-list'
import { getAllPurchasesByProfileId } from '@/data-access/purchases'
import { API_ROUTES } from '@/lib/constants'
import { AsyncReturnType } from '@/lib/types'
import { ComponentProps, FC } from 'react'

type PurchasedItemCardProps = ComponentProps<typeof PurchasedItemCard>

interface Props {
  purchases: AsyncReturnType<typeof getAllPurchasesByProfileId>
}

export const DashboardPurchasesList: FC<Props> = ({ purchases }) => {
  const flattenedInitialData = purchases.flatMap(
    (purchase) => purchase.purchaseItems,
  )

  return (
    <InfiniteScrollList<PurchasedItemCardProps, Props['purchases']>
      initialData={flattenedInitialData}
      endpointUrl={API_ROUTES.purchases()}
      transformResponse={(response) => {
        return response.length
          ? response.flatMap((purchase) => purchase.purchaseItems)
          : []
      }}
      ItemComponent={(item) => <PurchasedItemCard {...item} />}
    />
  )
}

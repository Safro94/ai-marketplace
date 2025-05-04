'use client'

import { InfiniteScrollList } from '@/components/ui/infinite-scroll-list'
import { getAllCreatorDashboardPurchasesByAssetCreator } from '@/data-access/purchases'
import { API_ROUTES } from '@/lib/constants'
import { AsyncReturnType } from '@/lib/types'
import { ComponentProps, FC } from 'react'
import { CreatorDashboardSale } from './sale'

type SalesProps = ComponentProps<typeof CreatorDashboardSale>

interface Props {
  recentSales: AsyncReturnType<
    typeof getAllCreatorDashboardPurchasesByAssetCreator
  >
}

export const CreatorDashboardSalesList: FC<Props> = ({ recentSales }) => {
  const flattenedInitialData = recentSales.flatMap(
    (purchase) => purchase.purchaseItems,
  )

  return (
    <InfiniteScrollList<SalesProps, Props['recentSales']>
      initialData={flattenedInitialData}
      endpointUrl={API_ROUTES.creatorDashboardSales()}
      transformResponse={(response) => {
        return response.length
          ? response.flatMap((purchase) => purchase.purchaseItems)
          : []
      }}
      ItemComponent={(item) => (
        <CreatorDashboardSale
          id={item.id}
          asset={item.asset}
          amount={item.amount}
          assetId={item.assetId}
          createdAt={item.createdAt}
          licenseKey={item.licenseKey}
          purchaseId={item.purchaseId}
          assetLicense={item.assetLicense}
          commisionRate={item.commisionRate}
          assetLicenseId={item.assetLicenseId}
        />
      )}
    />
  )
}

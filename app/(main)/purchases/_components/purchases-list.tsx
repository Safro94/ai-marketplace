'use client'

import { InfiniteScrollList } from '@/components/ui/infinite-scroll-list'
import { API_ROUTES } from '@/lib/constants'
import { ComponentProps } from 'react'
import { Purchase } from './purchase'

type PurchaseProps = ComponentProps<typeof Purchase>

interface Props {
  purchases: PurchaseProps[]
}

export const PurchasesList = ({ purchases }: Props) => {
  //TODO: update cacheTag
  return (
    <InfiniteScrollList<PurchaseProps>
      initialData={purchases}
      endpointUrl={API_ROUTES.purchases()}
      cacheTag={null}
      ItemComponent={(item) => <Purchase {...item} />}
    />
  )
}

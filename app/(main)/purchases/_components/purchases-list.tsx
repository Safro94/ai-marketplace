'use client'

import { InfiniteScrollList } from '@/components/ui/infinite-scroll-list'
import { API_ROUTES } from '@/lib/constants'
import { ComponentProps, FC } from 'react'
import { Purchase } from './purchase'

type PurchaseProps = ComponentProps<typeof Purchase>

interface Props {
  purchases: PurchaseProps[]
}

export const PurchasesList: FC<Props> = ({ purchases }) => {
  return (
    <InfiniteScrollList<PurchaseProps>
      initialData={purchases}
      endpointUrl={API_ROUTES.purchases()}
      ItemComponent={(item) => <Purchase {...item} />}
    />
  )
}

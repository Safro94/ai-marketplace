'use client'

import { Asset } from '@/components/asset'
import { InfiniteScrollList } from '@/components/ui/infinite-scroll-list'
import { API_ROUTES } from '@/lib/constants'
import { Prisma } from '@prisma/client'
import { FC } from 'react'

type FavoritesProps = Prisma.FavoriteGetPayload<{
  select: {
    id: true
    asset: {
      select: {
        id: true
        featuredImage: true
        totalReviews: true
        title: true
        description: true
        averageRating: true
        basePrice: true
        category: {
          select: {
            name: true
          }
        }
        creator: {
          select: {
            user: {
              select: {
                name: true
                image: true
              }
            }
          }
        }
      }
    }
  }
}>

interface Props {
  favorites: FavoritesProps[]
}

export const FavoritesList: FC<Props> = ({ favorites }) => {
  return (
    <InfiniteScrollList<FavoritesProps>
      initialData={favorites}
      endpointUrl={API_ROUTES.dashboardFavorites()}
      ItemComponent={(item) => <Asset {...item.asset} />}
      itemsContainerClassName='py-4 grid grid-cols-[repeat(auto-fill, minmax(0,1fr))] md:grid-cols-[repeat(auto-fill,minmax(325px,1fr))] gap-3'
    />
  )
}

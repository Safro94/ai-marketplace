'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetTitle } from '@/components/ui/sheet'
import { ROUTES } from '@/lib/constants'
import {
  EXPLORE_PARAMS,
  EXPLORE_SORT_BY,
  ExploreFilters as ExploreFiltersType,
} from '@/lib/types'
import { Filter } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useState } from 'react'
import { ExploreFilters } from './explore-filters'
import { ExploreSortBySelector } from './explore-sort-by-selector'

export const ShowFiltersButton: FC<{ maxPrice: number }> = ({ maxPrice }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlRating = searchParams.get(EXPLORE_PARAMS.MIN_RATING)
  const urlMinPrice = Number(searchParams.get(EXPLORE_PARAMS.MIN_PRICE)) || 0
  const urlSortByOption = searchParams.get(
    EXPLORE_PARAMS.SORT_BY,
  ) as EXPLORE_SORT_BY

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ExploreFiltersType>({
    sort: urlSortByOption || EXPLORE_SORT_BY.FEATURED,
    priceRange: [urlMinPrice, maxPrice],
    rating: urlRating ? [Number(urlRating)] : [],
  })

  const handleSave = () => {
    // Update URL when save is clicked
    const params = new URLSearchParams(searchParams.toString())

    params.set(EXPLORE_PARAMS.SORT_BY, filters.sort)

    // Update rating param
    if (filters.rating.length) {
      const minRating = Math.min(...filters.rating)
      params.set(EXPLORE_PARAMS.MIN_RATING, minRating.toString())
    } else {
      params.delete(EXPLORE_PARAMS.MIN_RATING)
    }

    // Update price range params
    if (!!filters.priceRange[0]) {
      params.set(EXPLORE_PARAMS.MIN_PRICE, filters.priceRange[0].toString())
    } else {
      params.delete(EXPLORE_PARAMS.MIN_PRICE)
    }

    const pageUrlParam = params.get(EXPLORE_PARAMS.PAGE)
    if (pageUrlParam) params.delete(EXPLORE_PARAMS.PAGE)

    router.push(`?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setFilters({
      sort: EXPLORE_SORT_BY.FEATURED,
      rating: [],
      priceRange: [0, maxPrice],
    })

    router.push(ROUTES.explore())
  }

  return (
    <>
      <Button
        variant='outline'
        onClick={() => {
          setShowFilters(true)
        }}
      >
        <Filter className='mr-2 w-4 h-4' />
        Sort & Filter
      </Button>

      <Sheet
        open={showFilters}
        onOpenChange={() => {
          console.log('hola')
          setShowFilters((prevState) => !prevState)
        }}
        header={<SheetTitle>Sort & Filter</SheetTitle>}
        content={
          <div className='flex-1'>
            <ExploreSortBySelector filters={filters} setFilters={setFilters} />
            <ExploreFilters filters={filters} setFilters={setFilters} />
          </div>
        }
        footer={
          <>
            <SheetClose asChild>
              <Button
                variant='outline'
                onClick={clearAllFilters}
                className='w-full'
              >
                Clear all
              </Button>
            </SheetClose>

            <SheetClose asChild>
              <Button onClick={handleSave} className='w-full'>
                Save
              </Button>
            </SheetClose>
          </>
        }
      />
    </>
  )
}

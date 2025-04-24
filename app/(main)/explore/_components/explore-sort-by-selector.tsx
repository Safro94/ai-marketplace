'use client'

import { Button } from '@/components/ui/button'
import { EXPLORE_SORT_BY, ExploreFilters } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Dispatch, FC, SetStateAction } from 'react'

interface Props {
  filters: ExploreFilters
  setFilters: Dispatch<SetStateAction<ExploreFilters>>
}

const SORT_BY = [
  {
    value: EXPLORE_SORT_BY.FEATURED,
    text: 'Featured',
  },
  {
    value: EXPLORE_SORT_BY.PRICE_LOW,
    text: 'Price: Low to High',
  },
  {
    value: EXPLORE_SORT_BY.PRICE_HIGH,
    text: 'Price: High to Low',
  },
  {
    value: EXPLORE_SORT_BY.RATING,
    text: 'Highest Rated',
  },
  {
    value: EXPLORE_SORT_BY.NEWEST,
    text: 'Newest',
  },
]

export const ExploreSortBySelector: FC<Props> = ({ filters, setFilters }) => {
  const handleSortChange = (value: EXPLORE_SORT_BY) => {
    setFilters((prevState) => ({
      ...prevState,
      sort: value,
    }))
  }

  return (
    <div className='flex flex-col gap-4 space-x-2 mt-4'>
      <p className='text-sm text-muted-foreground uppercase font-semibold'>
        Sort by:
      </p>

      <div className='flex flex-wrap gap-2'>
        {SORT_BY.map((item) => (
          <Button
            key={item.value}
            variant='outline'
            onClick={() => handleSortChange(item.value)}
            className={cn(
              'rounded-full hover:bg-primary hover:text-white',
              filters.sort === item.value && 'bg-primary text-white',
            )}
          >
            {item.text}
          </Button>
        ))}
      </div>
    </div>
  )
}

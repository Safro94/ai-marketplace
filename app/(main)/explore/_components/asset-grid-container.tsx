'use client'

import { Button } from '@/components/ui/button'
import { ExploreAsset } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Filter } from 'lucide-react'
import { FC, PropsWithChildren, useState } from 'react'
import { AssetFilters } from './asset-filters'
import { ExploreSortBySelector } from './explore-sort-by-selector'
import { SearchBar } from './search-bar'

interface Props extends PropsWithChildren {
  assets: ExploreAsset[] | undefined
  useCases:
    | {
        id: string | null
        label: string | undefined
      }[]
    | null
}

export const AssetGridContainer: FC<Props> = ({
  children,
  assets,
  useCases,
}) => {
  const [showDesktopFilters, setShowDesktopFilters] = useState(false)

  return (
    <div>
      <p className='text-sm text-center md:text-right text-muted-foreground self-end mb-2'>
        Showing{' '}
        <span className='font-medium text-foreground'>
          {assets?.length || 0}
        </span>{' '}
        results
      </p>

      <div className='flex flex-col md:flex-row md:justify-between items-center gap-2 mb-6'>
        <div className='flex md:items-center gap-2 '>
          <Button
            className='hidden md:flex'
            variant='outline'
            onClick={() => setShowDesktopFilters((prevState) => !prevState)}
          >
            <Filter className='mr-2 w-4 h-4' />
            Filters
          </Button>

          <SearchBar />
        </div>

        <div className='flex flex-col gap-2'>
          <ExploreSortBySelector />
        </div>
      </div>

      <div
        className={cn(
          'grid',
          showDesktopFilters && 'grid-cols-[350px_1fr] gap-2',
        )}
      >
        <AssetFilters
          showDesktopFilters={showDesktopFilters}
          useCases={useCases}
          maxPrice={
            assets?.length
              ? Math.max(...assets.map((asset) => asset.basePrice))
              : 0
          }
        />

        {children}
      </div>
    </div>
  )
}

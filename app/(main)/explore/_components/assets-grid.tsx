import { AssetsGrid } from '@/components/assets-grid'
import { toast } from '@/components/ui/toast'
import { tryCatch } from '@/lib/utils'
import { FC } from 'react'
import { ExplorePagination } from './explore-pagination'
import { getExploreAssets } from './explore-utils'
import { SearchBar } from './search-bar'
import { ShowFiltersButton } from './show-filters-button'

interface Props {
  filteredCategoriesIds?: string[]
  searchParams: Promise<{ category: string; q: string }>
}

export const AssetsGridContainer: FC<Props> = async ({
  filteredCategoriesIds,
  searchParams,
}) => {
  const { data, error } = await tryCatch(
    getExploreAssets(searchParams, filteredCategoriesIds),
  )

  if (error) {
    toast.error('An error occurred', {
      description: 'There was an error while fetching the assets',
    })
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4'>
        <SearchBar />

        <ShowFiltersButton
          maxPrice={
            data?.assets?.length
              ? Math.max(...data.assets.map((asset) => asset.basePrice))
              : 0
          }
        />
      </div>

      <p className='text-sm text-center md:text-right text-muted-foreground self-end mb-2'>
        Showing{' '}
        <span className='font-medium text-foreground'>
          {data?.assets?.length || 0}
        </span>{' '}
        results
      </p>

      {!!data?.assets?.length ? (
        <>
          <AssetsGrid items={data.assets} />

          {/* Pagination */}
          <ExplorePagination pagination={data?.pagination} />
        </>
      ) : (
        <div className='text-center py-12 border rounded-lg'>
          <p className='text-muted-foreground mb-4'>
            No assets found matching your criteria
          </p>
        </div>
      )}
    </div>
  )
}

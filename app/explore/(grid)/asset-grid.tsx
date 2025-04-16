import { Asset } from '@/components/asset'
import { ExploreAsset, Pagination } from '@/lib/types'
import { FC } from 'react'
import { SearchBar } from '../_components/search-bar'
import { ExplorePagination } from './explore-pagination'
import { ExploreSortBySelector } from './explore-sort-by-selector'

interface Props {
  assets: ExploreAsset[] | undefined
  pagination: Pagination | undefined
}

export const AssetGrid: FC<Props> = ({ assets, pagination }) => {
  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <SearchBar className='mb-6' />

        <div className='flex flex-col gap-2'>
          <ExploreSortBySelector />

          <p className='text-sm text-muted-foreground self-end'>
            Showing{' '}
            <span className='font-medium text-foreground'>
              {assets?.length || 0}
            </span>{' '}
            results
          </p>
        </div>
      </div>

      {!!assets?.length ? (
        <>
          <div className='grid grid-cols-[repeat(auto-fill,325px)] gap-6'>
            {assets.map((asset) => (
              <Asset key={asset.id} {...asset} />
            ))}
          </div>

          {/* Pagination */}
          <ExplorePagination pagination={pagination} />
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

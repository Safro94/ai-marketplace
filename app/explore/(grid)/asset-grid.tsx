import { Asset } from '@/components/asset'
import { ExploreAsset, Pagination } from '@/lib/types'
import { FC } from 'react'
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
        <p className='text-sm text-muted-foreground'>
          Showing{' '}
          <span className='font-medium text-foreground'>
            {assets?.length || 0}
          </span>{' '}
          results
        </p>

        <ExploreSortBySelector />
      </div>

      {!!assets?.length ? (
        <>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6'>
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

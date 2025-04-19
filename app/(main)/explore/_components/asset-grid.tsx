import { AssetsGrid } from '@/components/assets-grid'
import { ExploreAsset, Pagination } from '@/lib/types'
import { FC } from 'react'
import { ExplorePagination } from './explore-pagination'

interface Props {
  assets: ExploreAsset[] | undefined
  pagination: Pagination | undefined
}

export const AssetGrid: FC<Props> = ({ assets, pagination }) => {
  return (
    <div>
      {!!assets?.length ? (
        <>
          <AssetsGrid items={assets} />

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

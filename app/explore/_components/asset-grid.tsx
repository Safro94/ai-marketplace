import { Asset } from '@/components/asset'
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
          <div className='grid grid-cols-[repeat(auto-fill, minmax(0,1fr))] md:grid-cols-[repeat(auto-fill,minmax(325px,1fr))] gap-3'>
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

import { ExploreAsset } from '@/lib/types'
import { FC } from 'react'
import { Asset } from './asset'

interface Props {
  items: ExploreAsset[] | undefined
}

export const AssetsGrid: FC<Props> = ({ items }) => {
  return (
    <div className='grid grid-cols-[repeat(auto-fill, minmax(0,1fr))] md:grid-cols-[repeat(auto-fill,minmax(325px,1fr))] gap-3'>
      {items?.map((asset) => <Asset key={asset.id} {...asset} />)}
    </div>
  )
}

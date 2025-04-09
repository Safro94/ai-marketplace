import { FC } from 'react'
import { FavoriteButton } from './favorite-button'
import { ShareButton } from './share-button'

export const AssetOptions: FC<{ assetId: string }> = ({ assetId }) => {
  return (
    <div className='absolute right-3 top-3 flex flex-col items-center gap-2'>
      <FavoriteButton assetId={assetId} />
      <ShareButton assetId={assetId} />
    </div>
  )
}

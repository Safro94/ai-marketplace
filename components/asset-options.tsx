import { FC } from 'react'
import { FavoriteButton } from './favorite-button'
import { ShareButton } from './share-button'

interface Props {
  assetId: string
}

export const AssetOptions: FC<Props> = ({ assetId }) => {
  return (
    <div className='absolute right-2 md:right-3 top-3 flex flex-col items-center gap-2'>
      <FavoriteButton assetId={assetId} />
      <ShareButton assetId={assetId} />
    </div>
  )
}

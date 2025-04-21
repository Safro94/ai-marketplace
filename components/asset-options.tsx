import { Favorite } from '@prisma/client'
import { FC } from 'react'
import { FavoriteButton } from './favorite-button'
import { ShareButton } from './share-button'

interface Props {
  assetId: string
  favorite?: Favorite[]
}

export const AssetOptions: FC<Props> = ({ assetId, favorite }) => {
  return (
    <div className='absolute right-2 md:right-3 top-3 flex flex-col items-center gap-2'>
      {favorite && <FavoriteButton assetId={assetId} favorite={favorite} />}
      <ShareButton assetId={assetId} />
    </div>
  )
}

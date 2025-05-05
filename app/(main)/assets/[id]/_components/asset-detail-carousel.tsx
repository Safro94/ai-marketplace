'use client'

import { AssetActionsContainer } from '@/components/asset-actions-container'
import { Carousel } from '@/components/carousel/carousel'
import { ShareButton } from '@/components/share-button'
import { ExploreAsset } from '@/lib/types'
import dynamic from 'next/dynamic'
import { FC, useMemo } from 'react'

type Props = Pick<
  ExploreAsset,
  'id' | 'featuredImage' | 'galleryImages' | 'title'
>

const FavoriteButton = dynamic(
  () =>
    import('@/components/favorite-button').then((item) => item.FavoriteButton),
  {
    ssr: false,
  },
)

export const AssetDetailCarousel: FC<Props> = ({
  id: assetId,
  featuredImage,
  galleryImages,
  title,
}) => {
  const slides = useMemo(
    () => [
      { image: featuredImage, title },
      ...galleryImages.map((image) => ({ image, title })),
    ],
    [featuredImage, galleryImages, title],
  )

  return (
    <div className='relative'>
      <Carousel slides={slides} />

      <AssetActionsContainer>
        <ShareButton assetId={assetId} />
        <FavoriteButton assetId={assetId} />
      </AssetActionsContainer>
    </div>
  )
}

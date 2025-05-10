'use client'

import { AssetActionsContainer } from '@/components/asset-actions-container'
import { Carousel } from '@/components/carousel/carousel'
import { FavoriteButton } from '@/components/favorite-button'
import { ShareButton } from '@/components/share-button'
import { ExploreAsset } from '@/lib/types'
import { PrimaryMediaType } from '@prisma/client'
import { FC, useMemo } from 'react'

type Props = Pick<
  ExploreAsset,
  'id' | 'title' | 'featuredImage' | 'galleryImages' | 'primaryMediaType'
>

export const AssetDetailCarousel: FC<Props> = ({
  title,
  id: assetId,
  featuredImage,
  galleryImages,
  primaryMediaType,
}) => {
  const slides = useMemo(
    () => [
      { src: featuredImage, title, type: primaryMediaType },
      ...galleryImages.map((image) => ({
        title,
        src: image,
        type: PrimaryMediaType.IMAGE,
      })),
    ],
    [featuredImage, galleryImages, title, primaryMediaType],
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

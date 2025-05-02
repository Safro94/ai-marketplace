'use client'

import { AssetActionsContainer } from '@/components/asset-actions-container'
import { FavoriteButton } from '@/components/favorite-button'
import { ShareButton } from '@/components/share-button'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselThumbnails,
} from '@/components/ui/carousel'
import { ExploreAsset } from '@/lib/types'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

type Props = Pick<
  ExploreAsset,
  'id' | 'featuredImage' | 'galleryImages' | 'title'
>

export const AssetDetailCarousel: FC<Props> = ({
  id: assetId,
  featuredImage,
  galleryImages,
  title,
}) => {
  const [carouselAPI, setCarouselAPI] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  useEffect(() => {
    if (!carouselAPI) return

    const onSelect = () => {
      setSelectedIndex(carouselAPI.selectedScrollSnap())
    }

    onSelect()
    setScrollSnaps(carouselAPI.scrollSnapList())

    carouselAPI.on('select', onSelect)
  }, [carouselAPI])

  return (
    <div className='relative'>
      <Carousel className='w-full' setApi={setCarouselAPI}>
        <CarouselContent>
          {[featuredImage, ...galleryImages].map((image, index) => (
            <CarouselItem key={index}>
              <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-border/50 mb-4'>
                <Image
                  src={image || '/placeholder.svg?height=600&width=800'}
                  alt={title}
                  fill
                  className='object-contain'
                  priority
                />
              </div>
            </CarouselItem>
          ))}

          <AssetActionsContainer>
            <FavoriteButton assetId={assetId} />

            <ShareButton assetId={assetId} />
          </AssetActionsContainer>
        </CarouselContent>
        <CarouselThumbnails images={galleryImages} />
      </Carousel>

      {scrollSnaps.length > 1 && (
        <div className='flex items-center justify-center gap-2 border-0 absolute left-0 right-0 top-[1.6rem]'>
          {scrollSnaps.map((_, i) => (
            <Button
              key={i}
              onClick={() => carouselAPI?.scrollTo(i)}
              variant='ghost'
              className={cn(
                'transition-all h-1 p-0 w-12 bg-black hover:bg-white',
                i === selectedIndex && 'bg-white',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

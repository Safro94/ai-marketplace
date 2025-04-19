'use client'

import { AssetOptions } from '@/components/asset-options'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselThumbnails,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { Asset } from '@prisma/client'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

type Props = Pick<Asset, 'id' | 'featuredImage' | 'galleryImages' | 'title'>

export const AssetDetailCarousel: FC<Props> = ({
  id,
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
                  className='object-cover'
                  priority
                />

                <AssetOptions assetId={id} />
              </div>
            </CarouselItem>
          ))}
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

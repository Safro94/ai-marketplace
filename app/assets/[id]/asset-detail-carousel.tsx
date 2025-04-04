'use client'

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
import { FC, useCallback, useEffect, useState } from 'react'

type Props = Pick<Asset, 'featuredImage' | 'galleryImages' | 'title'>

export const AssetDetailCarousel: FC<Props> = ({
  featuredImage,
  galleryImages,
  title,
}) => {
  const [carouselAPI, setCarouselAPI] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!carouselAPI) return

    setSelectedIndex(carouselAPI.selectedScrollSnap())
  }, [carouselAPI])

  useEffect(() => {
    if (!carouselAPI) return

    onSelect()

    setScrollSnaps(carouselAPI.scrollSnapList())

    carouselAPI.on('select', onSelect)
  }, [carouselAPI, onSelect])

  return (
    <div className='relative'>
      <Carousel className='w-full' setApi={setCarouselAPI}>
        <CarouselContent>
          {[featuredImage, ...galleryImages].map((image, index) => (
            <CarouselItem key={index}>
              <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-border/50'>
                <Image
                  src={image || '/placeholder.svg?height=600&width=800'}
                  alt={title}
                  fill
                  className='object-cover'
                  priority
                />
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

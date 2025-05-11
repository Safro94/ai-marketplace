'use client'

import { PrimaryMediaType } from '@prisma/client'
import { EmblaOptionsType } from 'embla-carousel'
import Fade from 'embla-carousel-fade'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { FC, useCallback, useEffect, useState } from 'react'
import { AssetPrimaryMedia } from '../asset-primary-media'
import { Thumb } from './carousel-thumbnail'
import './carousel.css'

interface Props {
  slides: {
    src: string
    title: string
    type: PrimaryMediaType
  }[]
  options?: EmblaOptionsType
}

export const Carousel: FC<Props> = ({ slides, options }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options, [Fade()])
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi],
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className='embla'>
      <div className='embla__viewport' ref={emblaMainRef}>
        <div className='embla__container'>
          {slides.map(({ src, title, type }, i) => (
            <div className='embla__slide aspect-video' key={i}>
              <AssetPrimaryMedia
                type={type}
                src={src}
                alt={title}
                classNames={{
                  container: 'w-full h-full',
                  image: 'embla__slide__img',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className='embla-thumbs'>
          <div className='embla-thumbs__viewport' ref={emblaThumbsRef}>
            <div className='embla-thumbs__container md:grid-cols-3'>
              {slides.map(({ src, title }, i) => (
                <Thumb
                  key={i}
                  onClick={() => onThumbClick(i)}
                  selected={i === selectedIndex}
                >
                  <div className='relative aspect-video w-full overflow-hidden'>
                    <Image
                      fill
                      priority
                      className='object-fill rounded-lg'
                      src={src || '/placeholder.svg?height=600&width=800'}
                      alt={title}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                </Thumb>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

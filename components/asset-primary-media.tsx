import { cn } from '@/lib/utils'
import { PrimaryMediaType } from '@prisma/client'
import Image from 'next/image'
import { FC } from 'react'

export const AssetPrimaryMedia: FC<{
  src: string
  alt: string
  type: PrimaryMediaType
  classNames?: {
    container?: string
    image?: string
    video?: string
  }
}> = ({ src, alt, type, classNames }) => {
  const getPrimaryMedia = () => {
    switch (type) {
      case PrimaryMediaType.IMAGE:
        return (
          <Image
            fill
            priority
            src={src}
            alt={alt}
            className={cn('object-fill rounded-lg', classNames?.image)}
          />
        )
      case PrimaryMediaType.VIDEO:
        return (
          <iframe
            src={src}
            title={alt}
            className={cn('w-full h-full rounded-lg', classNames?.video)}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        )

      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'relative h-24 w-48 self-center flex-shrink-0',
        classNames?.container,
      )}
    >
      {getPrimaryMedia()}
    </div>
  )
}

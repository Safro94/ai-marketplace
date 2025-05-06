import Image from 'next/image'
import { FC } from 'react'

export const AssetImage: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <div className='relative h-24 w-48 self-center flex-shrink-0'>
      <Image fill src={src} alt={alt} className='object-fill rounded-lg' />
    </div>
  )
}

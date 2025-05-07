import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'

interface Props {
  phrase: string
  description: string
  image: StaticImport
}

export const AuthSidePanel = ({ image, phrase, description }: Props) => {
  return (
    <div className='hidden md:block bg-primary text-white relative'>
      <div className='h-full flex flex-col items-center justify-center p-8'>
        <div className='max-w-md mx-auto text-center mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold mb-2'>{phrase}</h2>
          <p className='text-xl text-white/80'>{description}</p>
        </div>

        {/* Isomorphic vector illustration */}
        <div className='w-full max-w-xl'>
          <Image width={600} height={500} src={image} alt='Image' />
        </div>

        {/* Decorative elements */}
        <div className='mt-12 w-full max-w-xs'>
          <div className='flex justify-between items-center'>
            <div className='w-2 h-2 rounded-full bg-white'></div>
            <div className='w-16 h-1 rounded-full bg-white/30'></div>
            <div className='w-4 h-4 rounded-full bg-white/50'></div>
            <div className='w-12 h-1 rounded-full bg-white/30'></div>
            <div className='w-2 h-2 rounded-full bg-white'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

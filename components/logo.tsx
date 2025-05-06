import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import icon from '../public/favicon.svg'
import { Badge } from './ui/badge'

interface Props {
  className?: string
}

export const Logo: FC<Props> = ({ className }) => {
  return (
    <Link href={ROUTES.home()} className={cn('flex items-center', className)}>
      <div className='flex items-center gap-1'>
        <Image src={icon} alt='AIAssetHub icon' priority className='w-8 h-8' />

        <div className='flex items-center gap-1'>
          <span className='text-lg font-bold text-primary dark:text-[#6a2baa] bg-clip-text'>
            AI<span className='text-cyan-500'>Asset</span>Hub
          </span>

          <Badge
            variant='outline'
            className='hidden md:block text-[10px] px-2 bg-purple-100 text-purple-800 border-purple-200'
          >
            BETA
          </Badge>
        </div>
      </div>
    </Link>
  )
}

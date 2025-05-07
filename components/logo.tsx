import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import icon from '../public/favicon.svg'
import { Badge } from './ui/badge'

interface Props {
  className?: string
  showBeta?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  colorVariant?: 'default' | 'inverted' | 'monochrome'
}

export const Logo: FC<Props> = ({
  className,
  showBeta = true,
  size = 'md',
  colorVariant = 'default',
}) => {
  const sizeConfig = {
    xs: {
      iconSize: 'w-4 h-4',
      fontSize: 'text-xs',
      badgeSize: 'text-[8px] px-1',
    },
    sm: {
      iconSize: 'w-6 h-6',
      fontSize: 'text-sm',
      badgeSize: 'text-[9px] px-1.5',
    },
    md: {
      iconSize: 'w-8 h-8',
      fontSize: 'text-lg',
      badgeSize: 'text-[10px] px-2',
    },
    lg: {
      iconSize: 'w-10 h-10',
      fontSize: 'text-xl',
      badgeSize: 'text-[11px] px-2',
    },
    xl: {
      iconSize: 'w-12 h-12',
      fontSize: 'text-2xl',
      badgeSize: 'text-[12px] px-2.5',
    },
  }

  // Color variants
  const colorConfig = {
    default: {
      primary: 'text-primary dark:text-[#6a2baa]',
      secondary: 'text-cyan-500',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    inverted: {
      primary: 'text-white',
      secondary: 'text-cyan-300',
      badge: 'bg-purple-700 text-white border-purple-500',
    },
    monochrome: {
      primary: 'text-gray-800 dark:text-white',
      secondary: 'text-gray-800 dark:text-white',
      badge:
        'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600',
    },
  }

  const { iconSize, fontSize, badgeSize } = sizeConfig[size] || sizeConfig.md
  const { primary, secondary, badge } =
    colorConfig[colorVariant] || colorConfig.default

  return (
    <Link href={ROUTES.home()} className={cn('flex items-center', className)}>
      <div className='flex items-center gap-1'>
        <Image src={icon} alt='AIAssetHub icon' priority className={iconSize} />

        <div className='flex items-center gap-1'>
          <span className={`font-bold ${fontSize} ${primary} bg-clip-text`}>
            AI<span className={secondary}>Asset</span>Hub
          </span>

          {showBeta && (
            <Badge
              variant='outline'
              className={`hidden md:block ${badgeSize} ${badge}`}
            >
              BETA
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}

import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { FC } from 'react'
import { Badge } from './ui/badge'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon'
  className?: string
}

export const Logo: FC<Props> = ({
  size = 'md',
  variant = 'full',
  className,
}) => {
  const sizes = {
    sm: { icon: 24, text: 16 },
    md: { icon: 32, text: 20 },
    lg: { icon: 48, text: 28 },
    xl: { icon: 64, text: 36 },
  }

  const iconSize = sizes[size].icon
  const fontSize = sizes[size].text

  return (
    <Link href={ROUTES.home()} className={cn('flex items-center', className)}>
      <div className='flex items-center gap-2'>
        {/* Logo Icon */}
        <div
          className='relative'
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
          }}
        >
          {/* Outer hexagon */}
          <div
            className='absolute inset-0 bg-gradient-to-br from-[#6a2baa] to-[#1e0a46] rounded-xl transform rotate-45'
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
            }}
          />

          {/* Inner circle */}
          <div
            className='absolute bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'
            style={{
              width: `${iconSize * 0.5}px`,
              height: `${iconSize * 0.5}px`,
            }}
          />

          {/* AI symbol */}
          <div
            className='absolute text-[#1e0a46] font-bold transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 flex items-center justify-center'
            style={{
              fontSize: `${iconSize * 0.3}px`,
              width: `${iconSize * 0.5}px`,
              height: `${iconSize * 0.5}px`,
            }}
          >
            AI
          </div>

          {/* Cyan accent */}
          <div
            className='absolute bg-cyan-400 rounded-full'
            style={{
              width: `${iconSize * 0.2}px`,
              height: `${iconSize * 0.2}px`,
              right: `${iconSize * 0.1}px`,
              bottom: `${iconSize * 0.1}px`,
            }}
          />
        </div>

        {/* Logo Text */}
        {variant === 'full' && (
          <div className='flex items-center gap-1'>
            <span
              className='font-bold bg-gradient-to-r from-[#6a2baa] to-[#1e0a46] text-transparent bg-clip-text'
              style={{ fontSize: `${fontSize}px` }}
            >
              AI<span className='text-cyan-500'>Asset</span>Hub
            </span>

            <Badge
              variant='outline'
              className='text-[10px] px-2 bg-purple-100 text-purple-800 border-purple-200'
            >
              BETA
            </Badge>
          </div>
        )}
      </div>
    </Link>
  )
}

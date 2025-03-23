import { cn } from '@/lib/utils'
import Link from 'next/link'
import { FC } from 'react'

interface LogoProps {
  className?: string
  variant?: 'default' | 'small'
}

export const Logo: FC<LogoProps> = ({ className, variant = 'default' }) => {
  return (
    <Link href='/' className={cn('flex items-center', className)}>
      <div className='relative'>
        <div className='flex items-center'>
          <svg
            width={variant === 'small' ? '28' : '36'}
            height={variant === 'small' ? '28' : '36'}
            viewBox='0 0 36 36'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='mr-2'
          >
            <path
              d='M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z'
              fill='url(#paint0_linear)'
            />
            <path
              d='M25.9667 10.0333L21.9 14.1M21.9 14.1L17.8333 10.0333M21.9 14.1L25.9667 18.1667M21.9 14.1L17.8333 18.1667M21.9 14.1L14.1 14.1M14.1 14.1L10.0333 10.0333M14.1 14.1L10.0333 18.1667M14.1 14.1L14.1 21.9M14.1 21.9L10.0333 25.9667M14.1 21.9L14.1 25.9667M14.1 21.9L18.1667 25.9667M14.1 21.9L18.1667 17.8333'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <defs>
              <linearGradient
                id='paint0_linear'
                x1='0'
                y1='0'
                x2='36'
                y2='36'
                gradientUnits='userSpaceOnUse'
              >
                <stop stopColor='#A78BFA' />
                <stop offset='1' stopColor='#8B5CF6' />
              </linearGradient>
            </defs>
          </svg>
          <span
            className={cn(
              'font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-500',
              variant === 'default' ? 'text-xl' : 'text-base',
            )}
          >
            AIAssets
          </span>
        </div>
      </div>
    </Link>
  )
}

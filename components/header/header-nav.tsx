'use client'

import { cn, getCreatorsLinks } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  isCreator: boolean
  hasPendingApplication: boolean
  onClick?: () => void
  className?: string
}

export const HeaderNav: FC<Props> = ({
  isCreator,
  hasPendingApplication,
  children,
  onClick,
  className,
}) => {
  const pathname = usePathname()
  const links = getCreatorsLinks(isCreator, hasPendingApplication)

  return (
    <nav className={cn('flex gap-6', className)}>
      {links.map((item) => (
        <Link
          prefetch
          key={item.name}
          href={item.href}
          onClick={onClick}
          className={cn(
            'text-base font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-foreground'
              : 'text-muted-foreground',
          )}
        >
          {item.name}
        </Link>
      ))}

      {children}
    </nav>
  )
}

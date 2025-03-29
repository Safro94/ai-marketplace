'use client'

import { cn, getCreatorsLinks } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface Props {
  isCreator: boolean
  hasPendingApplication: boolean
}

export const HeaderNav: FC<Props> = ({ isCreator, hasPendingApplication }) => {
  const pathname = usePathname()
  const links = getCreatorsLinks(isCreator, hasPendingApplication)

  return (
    <nav className='hidden md:flex gap-6'>
      {links.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-foreground'
              : 'text-muted-foreground',
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

'use client'

import { SidebarLink } from '@/lib/types'
import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface Props {
  links: SidebarLink[]
}

export const DashboardSidebar: FC<Props> = ({ links }) => {
  const pathname = usePathname()

  return (
    <div className='flex flex-col md:w-64 bg-secondary/50 border-r border-border'>
      <div className='hidden md:flex items-center h-16 px-6 border-b border-border'>
        <h1 className='text-lg font-bold'>Dashboard panel</h1>
      </div>

      <div className='flex flex-col flex-1 overflow-y-auto'>
        <nav className='flex-1 px-2 py-4 space-y-1'>
          {links.map((item) => {
            const IconComponent = LucideIcons[
              item.icon
            ] as LucideIcons.LucideIcon

            const regex = new RegExp(item.match)
            const isActive = regex.test(pathname)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <IconComponent
                  className={cn(
                    'md:mr-3 h-5 w-5',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground',
                  )}
                />
                <span className='hidden md:block'>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

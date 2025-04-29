'use client'

import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Home, List, LucideIcon, Package } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAVIGATION_LINKS: {
  name: string
  href: string
  icon: LucideIcon
  match: RegExp
}[] = [
  {
    name: 'Dashboard',
    href: ROUTES.creatorDashboard(),
    icon: Home,
    match: /^\/creator-dashboard$/, // Matches only the dashboard route
  },
  {
    name: 'Products',
    href: ROUTES.creatorDashboardAssets(),
    icon: List,
    match: /^\/creator-dashboard\/assets/,
  },
  {
    name: 'Sales',
    href: ROUTES.creatorDashboardSales(),
    icon: Package,
    match: /^\/creator-dashboard\/sales/,
  },
  // { name: 'Analytics', href: ROUTES.creatorDashboarAnalytics(), icon: BarChart },
]

export const CreatorSidebar = () => {
  const pathname = usePathname()

  return (
    <div className='flex flex-col md:w-64 bg-secondary/50 border-r border-border'>
      <div className='hidden md:flex items-center h-16 px-6 border-b border-border'>
        <h1 className='text-lg font-bold'>Creator panel</h1>
      </div>

      <div className='flex flex-col flex-1 overflow-y-auto'>
        <nav className='flex-1 px-2 py-4 space-y-1'>
          {NAVIGATION_LINKS.map((item) => {
            const isActive = item.match.test(pathname)

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
                <item.icon
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

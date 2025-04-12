'use client'

import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { FileText, Home, LucideIcon, ShoppingBag, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAVIGATION_LINKS: {
  name: string
  href: string
  icon: LucideIcon
}[] = [
  { name: 'Dashboard', href: ROUTES.admin(), icon: Home },
  { name: 'Users', href: ROUTES.adminUsers(), icon: Users },
  { name: 'Assets', href: ROUTES.adminAssets(), icon: ShoppingBag },
  {
    name: 'Creator Applications',
    href: ROUTES.adminCreatorApplications(),
    icon: FileText,
  },
  // { name: 'Analytics', href: ROUTES.adminAnalytics(), icon: BarChart },
  // { name: 'Settings', href: ROUTES.adminSettings(), icon: Settings },
]

export const AdminSidebar = () => {
  const pathname = usePathname()

  return (
    <div className='flex flex-col w-64 bg-secondary/50 border-r border-border'>
      <div className='flex items-center h-16 px-6 border-b border-border'>
        <h1 className='text-lg font-bold'>Admin Panel</h1>
      </div>

      <div className='flex flex-col flex-1 overflow-y-auto'>
        <nav className='flex-1 px-2 py-4 space-y-1'>
          {NAVIGATION_LINKS.map((item) => {
            const isActive = pathname === item.href

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
                    'mr-3 h-5 w-5',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground',
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

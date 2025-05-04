import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { APP_DATA, ROUTES } from '@/lib/constants'
import { SidebarLink } from '@/lib/types'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: `Creator Dashboard | ${APP_DATA.name}`,
  description: `Creator dashboard for managing the ${APP_DATA.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

const NAVIGATION_LINKS: SidebarLink[] = [
  {
    name: 'Overview',
    href: ROUTES.creatorDashboard(),
    icon: 'Home',
    match: '^\/creator-dashboard$',
  },
  {
    name: 'Products',
    href: ROUTES.creatorDashboardAssets(),
    icon: 'List',
    match: '^\/creator-dashboard\/assets',
  },
  {
    name: 'Sales',
    href: ROUTES.creatorDashboardSales(),
    icon: 'Package',
    match: '^\/creator-dashboard\/sales',
  },
  {
    name: 'Affiliate program',
    href: ROUTES.creatorDashboarAffiliate(),
    icon: 'Handshake',
    match: '^\/creator-dashboard\/affiliate',
  },
  // { name: 'Analytics', href: ROUTES.creatorDashboarAnalytics(), icon: BarChart },
]

export default async function CreatorLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen'>
      <DashboardSidebar links={NAVIGATION_LINKS} />

      <div className='flex-1 p-4 md:p-8 overflow-hidden overflow-x-auto'>
        {children}
      </div>
    </div>
  )
}

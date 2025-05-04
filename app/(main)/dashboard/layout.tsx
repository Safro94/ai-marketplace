import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { APP_DATA, ROUTES } from '@/lib/constants'
import { SidebarLink } from '@/lib/types'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: `User Dashboard | ${APP_DATA.name}`,
  description: 'Manage your purchased assets and account',
  robots: {
    index: false,
    follow: false,
  },
}

const NAVIGATION_LINKS: SidebarLink[] = [
  {
    name: 'Overview',
    href: ROUTES.dashboard(),
    icon: 'Home',
    match: '^\/dashboard$',
  },
  {
    name: 'Downloads',
    href: ROUTES.dashboardDownloads(),
    icon: 'Download',
    match: '^\/dashboard\/downloads',
  },
  {
    name: 'Favorites',
    href: ROUTES.dashboardFavorites(),
    icon: 'Heart',
    match: '^\/dashboard\/favorites',
  },
  {
    name: 'Reviews',
    href: ROUTES.dashboardReviews(),
    icon: 'Star',
    match: '^\/dashboard\/reviews',
  },
  {
    name: 'Affiliate program',
    href: ROUTES.dashboardAffiliate(),
    icon: 'Handshake',
    match: '^\/dashboard\/affiliate',
  },
]

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen'>
      <DashboardSidebar links={NAVIGATION_LINKS} />

      <div className='flex-1 p-4 md:p-8 overflow-hidden overflow-x-auto'>
        {children}
      </div>
    </div>
  )
}

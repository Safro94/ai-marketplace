import { APP_DATA, ROUTES } from '@/lib/constants'
import { validateAdminProfile } from '@/lib/permissions'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { AdminSidebar } from './_components/admin-sidebar'

export const metadata: Metadata = {
  title: `Admin Dashboard | ${APP_DATA.name}`,
  description: `Admin dashboard for managing the ${APP_DATA.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: PropsWithChildren) {
  await validateAdminProfile(ROUTES.admin())

  return (
    <div className='flex min-h-screen'>
      <AdminSidebar />

      <div className='flex-1 p-8'>{children}</div>
    </div>
  )
}

import { ROUTES } from '@/lib/constants'
import { validateAdminProfile } from '@/lib/db/permissions'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { AdminSidebar } from './_components/sidebar'

export const metadata: Metadata = {
  title: 'Admin Dashboard | AIAssets Marketplace',
  description: 'Admin dashboard for managing the AIAssets marketplace',
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

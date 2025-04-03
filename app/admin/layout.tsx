import { ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/session'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { AdminSidebar } from './sidebar'

export const metadata: Metadata = {
  title: 'Admin Dashboard | AIAssets Marketplace',
  description: 'Admin dashboard for managing the AIAssets marketplace',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: PropsWithChildren) {
  const { user } = await validateSession(ROUTES.admin())

  // Check if user is an admin
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id, isAdmin: true },
  })

  if (!profile?.isAdmin) {
    redirect('/?error=unauthorized')
  }

  return (
    <div className='flex min-h-screen'>
      <AdminSidebar />

      <div className='flex-1 p-8'>{children}</div>
    </div>
  )
}

import { APP_DATA } from '@/lib/constants'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { CreatorSidebar } from './_components/creator-sidebar'

export const metadata: Metadata = {
  title: `Creator Dashboard | ${APP_DATA.name}`,
  description: `Creator dashboard for managing the ${APP_DATA.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CreatorLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen'>
      <CreatorSidebar />

      <div className='flex-1 p-4 md:p-8 overflow-hidden overflow-x-auto'>
        {children}
      </div>
    </div>
  )
}

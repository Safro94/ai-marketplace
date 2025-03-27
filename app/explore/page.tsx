import { ROUTES } from '@/lib/constants'
import type { Metadata } from 'next'
import { AssetFilters } from './asset-filters'
import { AssetGrid } from './asset-grid'

export const metadata: Metadata = {
  title: 'Explore AI Assets | Browse Our Marketplace',
  description:
    'Browse and discover high-quality AI assets for your projects. Filter by category, price, and more to find the perfect AI tools and templates.',
  alternates: {
    canonical: ROUTES.explore(),
  },
  openGraph: {
    title: 'Explore AI Assets | Browse Our Marketplace',
    description:
      'Browse and discover high-quality AI assets for your projects. Filter by category, price, and more to find the perfect AI tools and templates.',
    url: '/explore',
  },
}

export default function ExplorePage() {
  return (
    <div className='container py-8'>
      <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6'>
        <aside className='w-full md:w-64 lg:w-72 shrink-0'>
          <AssetFilters />
        </aside>

        <main className='flex-1'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold tracking-tight mb-2'>
              Explore AI Assets
            </h1>

            <p className='text-muted-foreground'>
              Browse our curated collection of high-quality AI assets
            </p>
          </div>

          <AssetGrid />
        </main>
      </div>
    </div>
  )
}

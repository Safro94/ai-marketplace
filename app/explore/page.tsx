import { PageContainer } from '@/components/page-container'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/toast'
import { EXPLORE_PARAMS, ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { tryCatch } from '@/lib/utils'
import type { Metadata } from 'next'
import { AssetGrid } from './(grid)/asset-grid'
import { AssetFilters } from './asset-filters'
import { ExploreCategoriesSelector } from './explore-categories-selector'
import {
  getCategoriesWithCount,
  getExploreAssets,
  getUseCases,
} from './explore-utils'

interface Props {
  searchParams: Promise<{ category: string }>
}

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
    url: ROUTES.explore(),
  },
}

export default async function ExplorePage({ searchParams }: Props) {
  let category
  const categorySlug = (await searchParams)[EXPLORE_PARAMS.CATEGORY]

  if (categorySlug) {
    category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    })
  }

  const { data: assetData, error: assetsError } = await tryCatch(
    getExploreAssets(searchParams, category?.id),
  )

  if (assetsError) {
    toast.error('An error occurred', {
      description: 'There was an error while fetching the assets',
    })
  }

  const { data: useCases, error: useCasesError } = await tryCatch(getUseCases())

  if (useCasesError) {
    toast.error('An error occurred', {
      description: 'There was an error while fetching the use cases',
    })
  }

  const { data, error } = await tryCatch(getCategoriesWithCount())

  if (error) {
    toast.error('An error occurred', {
      description: 'There was an error while fetching the categories',
    })
  }

  return (
    <PageContainer className='min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>
          Explore AI Assets
        </h1>

        <p className='text-muted-foreground'>
          Browse our curated collection of high-quality AI assets
        </p>

        {data?.length && (
          <ScrollArea className='py-4'>
            <div className='flex items-center gap-4'>
              <ExploreCategoriesSelector
                categories={data}
                initialCategorySlug={category?.slug}
              />
            </div>

            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        )}
      </div>

      <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6'>
        <aside className='w-full md:w-64 lg:w-72 shrink-0'>
          <AssetFilters
            useCases={useCases}
            initialCategory={category?.slug}
            maxPrice={
              assetData?.assets.length
                ? Math.max(...assetData?.assets.map((asset) => asset.basePrice))
                : 0
            }
          />
        </aside>

        <main className='flex-1'>
          <AssetGrid
            assets={assetData?.assets}
            pagination={assetData?.pagination}
          />
        </main>
      </div>
    </PageContainer>
  )
}

import { PageContainer } from '@/components/page-container'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/toast'
import {
  getCategoriesBySlug,
  getCategoriesWithCount,
} from '@/data-access/categories'
import { EXPLORE_PARAMS, ROUTES } from '@/lib/constants'
import { tryCatch } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import type { Metadata } from 'next'
import { AssetGrid } from './(grid)/asset-grid'
import { AssetFilters } from './_components/asset-filters'
import { ExploreCategoriesSelector } from './_components/explore-categories-selector'
import { getExploreAssets, getUseCases } from './_components/explore-utils'

interface Props {
  searchParams: Promise<{ category: string; q: string }>
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
  let categories: Prisma.PromiseReturnType<typeof getCategoriesBySlug> = []
  const categorySlug = (await searchParams)[EXPLORE_PARAMS.CATEGORY]

  if (categorySlug) {
    categories = await getCategoriesBySlug(categorySlug)
  }

  const { data: assetData, error: assetsError } = await tryCatch(
    getExploreAssets(searchParams, categories),
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

  const { data: categoriesWithCount, error } = await tryCatch(
    getCategoriesWithCount(),
  )

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

        {categoriesWithCount?.length && (
          <ScrollArea className='py-4'>
            <div className='flex items-center gap-4'>
              <ExploreCategoriesSelector
                categories={categoriesWithCount}
                initialCategories={categorySlug}
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
            maxPrice={
              assetData?.assets.length
                ? Math.max(...assetData?.assets.map((asset) => asset.basePrice))
                : 0
            }
          />
        </aside>

        <div className='flex-1'>
          <AssetGrid
            assets={assetData?.assets}
            pagination={assetData?.pagination}
          />
        </div>
      </div>
    </PageContainer>
  )
}

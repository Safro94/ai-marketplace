import { toast } from '@/components/ui/toast'
import { ROUTES } from '@/lib/constants'
import { getCategories } from '@/lib/db/categories'
import prisma from '@/lib/prisma'
import { tryCatch } from '@/lib/utils'
import type { Metadata } from 'next'
import { AssetGrid } from './(grid)/asset-grid'
import { AssetFilters } from './asset-filters'
import { getExploreAssets, getUseCases } from './explore-utils'

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
  const categorySlug = (await searchParams).category

  if (categorySlug) {
    category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    })
  }

  //       // Add sort option if not already in params
  //       if (!params.has(EXPLORE_PARAMS.SORT_BY)) {
  //         params.set(EXPLORE_PARAMS.SORT_BY, sortOption)
  //       }

  //       // Add initial category if provided and not already in params
  //       if (initialCategory && !params.has(EXPLORE_PARAMS.CATEGORY)) {
  //         params.set(EXPLORE_PARAMS.CATEGORY, initialCategory)
  //       }
  const { data: assetData, error: assetsError } = await tryCatch(
    getExploreAssets(searchParams, category?.id),
  )

  if (assetsError) {
    toast.error('An error occurred', {
      description: 'There was an error while fetching the assets',
    })
  }

  const { data: categories, error: categoriesError } =
    await tryCatch(getCategories())

  if (categoriesError) {
    toast.error('An error occurred', {
      description: 'There was an error while fetching the categories',
    })
  }

  const { data: useCases, error: useCasesError } = await tryCatch(getUseCases())

  if (useCasesError) {
    toast.error('An error occurred', {
      description: 'There was an error while fetching the use cases',
    })
  }

  return (
    <div className='container py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>
          Explore AI Assets
        </h1>

        <p className='text-muted-foreground'>
          Browse our curated collection of high-quality AI assets
        </p>
      </div>

      <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6'>
        <aside className='w-full md:w-64 lg:w-72 shrink-0'>
          <AssetFilters
            categories={categories}
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
    </div>
  )
}

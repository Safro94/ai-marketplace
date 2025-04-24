import { PageContainer } from '@/components/page-container'
import { ExploreSkeleton } from '@/components/skeletons/explore-skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/toast'
import { getCategoriesWithCount } from '@/data-access/categories'
import { ROUTES } from '@/lib/constants'
import { EXPLORE_PARAMS } from '@/lib/types'
import { tryCatch } from '@/lib/utils'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AssetsGridContainer } from './_components/assets-grid'
import { ExploreCategoriesSelector } from './_components/explore-categories-selector'

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
  const categorySlug = (await searchParams)[EXPLORE_PARAMS.CATEGORY]

  const { data: categoriesWithCount, error } = await tryCatch(
    getCategoriesWithCount(),
  )

  if (error) {
    toast.error('An error occurred', {
      description: 'There was an error while fetching the categories',
    })
  }

  const urlCategoriesArray = categorySlug?.split(',')
  const filteredCategoriesIds = categoriesWithCount
    ?.filter((item) => urlCategoriesArray?.includes(item.slug))
    ?.map((item) => item.id)

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
                initialCategories={urlCategoriesArray}
              />
            </div>

            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        )}
      </div>

      <div className='flex-1'>
        <Suspense
          key={JSON.stringify(await searchParams)}
          fallback={<ExploreSkeleton />}
        >
          <AssetsGridContainer
            searchParams={searchParams}
            filteredCategoriesIds={filteredCategoriesIds}
          />
        </Suspense>
      </div>
    </PageContainer>
  )
}

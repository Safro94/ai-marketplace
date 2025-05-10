import { ErrorToast } from '@/components/error-toast'
import { getCategoriesWithCount } from '@/data-access/categories'
import { ROUTES } from '@/lib/constants'
import { EXPLORE_PARAMS } from '@/lib/types'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const CategoryShowcase = async () => {
  const { data, error } = await getCategoriesWithCount()

  return (
    <>
      <Suspense>
        {error && (
          <ErrorToast error='There was an error while fetching the categories' />
        )}
      </Suspense>

      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {data?.map((category, i) => {
          const IconComponent =
            // @ts-expect-error error
            LucideIcons[category.iconName ?? 'MessageSquare']

          return (
            <Link
              key={i}
              href={`${ROUTES.explore()}?${[EXPLORE_PARAMS.CATEGORY]}=${category.slug}`}
              className='group bg-gray-50 dark:bg-background dark:border dark:border-primary rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden'
            >
              <div className='absolute inset-0 bg-primary/5 transform origin-bottom scale-y-0 transition-transform group-hover:scale-y-100' />

              <div className='relative z-10'>
                <div className='w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-primary dark:bg-primary-foreground text-white dark:text-primary p-3 transform group-hover:scale-110 transition-transform duration-300'>
                  <IconComponent />
                </div>

                <h3 className='text-xl font-semibold text-gray-900 dark:text-primary-foreground mb-2'>
                  {category.name}
                </h3>

                <p className='text-sm text-gray-500 dark:text-secondary-foreground mb-2'>
                  {category.description}
                </p>

                <p className='text-sm font-medium text-primary dark:text-secondary-foreground'>
                  {category.count}{' '}
                  {category.count === 1 ? 'product' : 'products'}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

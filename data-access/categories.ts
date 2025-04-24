import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { AssetStatus } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'
import prisma from '../lib/prisma'

export const getCategoriesWithCount = withErrorHandler(async () => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.categoriesWithCount())
  unstable_cacheLife('hours')

  // Fetch categories from the database
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  // Count assets in each category and get featured assets
  const categoriesWithData = await Promise.all(
    categories.map(async (category) => {
      // Count assets in this category
      const count = await prisma.asset.count({
        where: {
          categoryId: category.id,
          status: AssetStatus.PUBLISHED,
        },
      })

      return {
        ...category,
        count,
      }
    }),
  )

  return categoriesWithData
})

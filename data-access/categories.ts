import { AssetStatus } from '@prisma/client'
import 'server-only'
import prisma from '../lib/prisma'

export const getCategoriesCount = async () => {
  return await prisma.category.count()
}

export const getCategoriesBySlug = async (categorySlug: string) => {
  return await prisma.category.findMany({
    where: {
      slug: {
        in: categorySlug.split(','),
      },
    },
  })
}

export const getCategoriesWithCount = async () => {
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
}

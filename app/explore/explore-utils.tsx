import { EXPLORE_PARAMS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { AssetStatus, Category, Prisma } from '@prisma/client'

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

export const getUseCases = async () => {
  const useCases = await prisma.asset.findMany({
    where: {
      useCase: {
        not: null,
      },
    },
    select: {
      useCase: true,
    },
    distinct: ['useCase'],
  })

  // Transform to the expected format
  const formattedUseCases = useCases
    .filter((item) => item.useCase) // Remove null values
    .map((item) => ({
      id: item.useCase,
      label: item.useCase
        ?.split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }))

  return formattedUseCases
}

export const getExploreAssets = async (
  searchParams: Promise<{ [key: string]: string }>,
  categories?: Category[],
) => {
  const params = await searchParams

  const query = params[EXPLORE_PARAMS.QUERY]
  const useCase = params[EXPLORE_PARAMS.USE_CASES]
  const minPrice = params[EXPLORE_PARAMS.MIN_PRICE]
    ? Number(params[EXPLORE_PARAMS.MIN_PRICE])
    : undefined
  const minRating = params[EXPLORE_PARAMS.MIN_RATING]
    ? Number(params[EXPLORE_PARAMS.MIN_RATING])
    : undefined
  const sortBy = params[EXPLORE_PARAMS.SORT_BY] || 'featured'
  const page = Number(params[EXPLORE_PARAMS.PAGE] || '1')
  const limit = Number(params.limit || '12')
  const skip = (page - 1) * limit

  const where: Prisma.AssetWhereInput = {
    status: AssetStatus.PUBLISHED,
  }

  // Text search
  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { tags: { hasSome: [query] } },
    ]
  }

  // Category filter
  if (categories?.length) {
    where.categoryId = {
      in: categories.map((category) => category.id),
    }
  }

  // Use case filter
  if (useCase) {
    where.useCase = useCase
  }

  // Price range filter
  if (minPrice !== undefined) {
    where.basePrice = {
      gte: minPrice,
    }
  }

  // Rating filter
  if (minRating !== undefined) {
    where.averageRating = { gte: minRating }
  }

  // Determine sort order
  let orderBy = {}
  switch (sortBy) {
    case 'price-low':
      orderBy = { price: 'asc' }
      break
    case 'price-high':
      orderBy = { price: 'desc' }
      break
    case 'rating':
      orderBy = { averageRating: 'desc' }
      break
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    default:
      // "featured" - sort by a combination of factors
      orderBy = [
        { averageRating: 'desc' },
        { sales: 'desc' },
        { createdAt: 'desc' },
      ]
  }

  // Execute the query
  const [assets, totalCount] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: {
        category: true,
        creator: {
          include: {
            user: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.asset.count({ where }),
  ])

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return {
    assets,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  }
}

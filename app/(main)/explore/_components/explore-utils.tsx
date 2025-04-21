import { getPaginatedAssets } from '@/data-access/assets'
import { EXPLORE_PARAMS } from '@/lib/types'
import { AssetStatus, Category, Prisma } from '@prisma/client'
import 'server-only'

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
  let orderBy:
    | Prisma.AssetOrderByWithRelationInput
    | Prisma.AssetOrderByWithRelationInput[]

  switch (sortBy) {
    case 'price-low':
      orderBy = { basePrice: 'asc' }
      break
    case 'price-high':
      orderBy = { basePrice: 'desc' }
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
  const [assets, totalCount] = await getPaginatedAssets({
    where,
    orderBy,
    skip,
    limit,
  })

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

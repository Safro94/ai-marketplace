import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { EXPLORE_PARAMS, EXPLORE_SORT_BY } from '@/lib/types'
import { AssetStatus, Prisma } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import { cache } from 'react'
import 'server-only'

export const getAssetCount = async (args?: Prisma.AssetCountArgs) => {
  return await prisma.asset.count(args)
}

export const getAssetBySlug = async (slug: string) => {
  return await prisma.asset.findUnique({
    where: { slug },
  })
}

export const getViewedAssetsByProfile = async (
  profileId: string,
  assetId: string,
) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.viewedAssetsByProfile(assetId, profileId))
  unstable_cacheLife('hours')

  return await prisma.profile.findFirst({
    where: {
      id: profileId,
      viewedAssets: {
        some: {
          id: assetId,
        },
      },
    },
  })
}

export const getAssetById = async <T extends Prisma.AssetInclude | undefined>(
  id: string,
  args?: T,
): Promise<Prisma.AssetGetPayload<{ include: T }> | null> => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.assetById(id))
  unstable_cacheLife('hours')

  return (await prisma.asset.findUnique({
    where: { id },
    include: args,
  })) as Prisma.AssetGetPayload<{ include: T }> | null
}

export const getAssets = cache(
  async <T extends Prisma.AssetFindManyArgs>(
    args: T,
  ): Promise<Prisma.AssetGetPayload<T>[]> => {
    return (await prisma.asset.findMany(args)) as Prisma.AssetGetPayload<T>[]
  },
)

export const getPaginatedAssets = async ({
  where,
  orderBy,
  skip,
  limit,
}: {
  where: Prisma.AssetWhereInput
  skip: number
  limit: number
  orderBy:
    | Prisma.AssetOrderByWithRelationInput
    | Prisma.AssetOrderByWithRelationInput[]
}) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.exploreAssets())
  unstable_cacheLife('hours')

  return await Promise.all([
    prisma.asset.findMany({
      where,
      select: {
        id: true,
        featuredImage: true,
        totalReviews: true,
        title: true,
        averageRating: true,
        basePrice: true,
        primaryMediaType: true,

        category: {
          select: {
            name: true,
          },
        },
        creator: {
          select: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.asset.count({ where }),
  ])
}

export const createAsset = async (data: Prisma.AssetCreateArgs['data']) => {
  return await prisma.asset.create({
    data: {
      ...data,
    },
  })
}

export const updateAsset = async ({
  assetId,
  ...rest
}: Partial<Prisma.AssetUpdateArgs['data']> & { assetId: string }) => {
  return await prisma.asset.update({
    where: { id: assetId },
    data: {
      ...rest,
    },
  })
}

export const softDeleteAssetById = async (assetId: string) => {
  return await prisma.asset.update({
    where: { id: assetId },
    data: {
      status: AssetStatus.ARCHIVED,
    },
  })
}

export const getExploreAssets = withErrorHandler(
  async (
    searchParams: Promise<{ [key: string]: string }>,
    categoriesIds?: string[],
  ) => {
    const params = await searchParams

    const isFree = Boolean(params[EXPLORE_PARAMS.FREE])
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
    const limit = Number(params.limit || '20')
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
    if (categoriesIds?.length) {
      where.categoryId = {
        in: categoriesIds,
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

    if (isFree) {
      where.basePrice = {
        equals: 0,
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
      case EXPLORE_SORT_BY.PRICE_LOW:
        orderBy = { basePrice: 'asc' }
        break
      case EXPLORE_SORT_BY.PRICE_HIGH:
        orderBy = { basePrice: 'desc' }
        break
      case EXPLORE_SORT_BY.RATING:
        orderBy = { averageRating: 'desc' }
        break
      case EXPLORE_SORT_BY.NEWEST:
        orderBy = { createdAt: 'desc' }
        break
      default:
        // "featured" - sort by a combination of factors
        orderBy = [
          { averageRating: 'desc' },
          { totalSales: 'desc' },
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
  },
)

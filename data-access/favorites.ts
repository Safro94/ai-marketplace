import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'

export const getFavorite = async (
  assetId: string,
  args: Prisma.FavoriteFindUniqueArgs,
) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.assetFavorite(assetId))
  unstable_cacheLife('hours')

  console.log('cache')

  return await prisma.favorite.findUnique(args)
}

export const getFavoritesByProfileId = async (profileId: string) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.dashboardFavorites(profileId))
  unstable_cacheLife('hours')

  return await prisma.favorite.findMany({
    where: {
      userId: profileId,
    },
    select: {
      id: true,
      asset: {
        select: {
          id: true,
          featuredImage: true,
          title: true,
          description: true,
          basePrice: true,
          creator: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const createFavorite = async (
  data: Prisma.FavoriteCreateArgs['data'],
) => {
  await prisma.favorite.create({
    data,
  })
}

export const deleteFavorite = async (id: string) => {
  await prisma.favorite.delete({
    where: {
      id,
    },
  })
}

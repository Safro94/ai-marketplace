import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import 'server-only'

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

export const getFavorite = async (args: Prisma.FavoriteFindUniqueArgs) => {
  return await prisma.favorite.findUnique(args)
}

export const getFavoritesByProfileId = async (profileId: string) => {
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

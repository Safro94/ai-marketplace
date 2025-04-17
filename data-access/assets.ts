import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
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

export const deleteAssetById = async (assetId: string) => {
  return await prisma.asset.delete({
    where: { id: assetId },
  })
}

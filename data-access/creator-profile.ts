import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'

export const getCreatorProfileByProfileId = async (profileId: string) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.creatorDashboardCreatorProfile(profileId))
  unstable_cacheLife('hours')

  return await prisma.creatorProfile.findUnique({
    where: { profileId },
  })
}

export const createCreatorProfile = async (
  data: Prisma.CreatorProfileCreateArgs['data'],
) => {
  return await prisma.creatorProfile.create({
    data,
  })
}

export const updateCreatorProfile = async (
  args: Prisma.CreatorProfileUpdateArgs,
) => {
  return await prisma.creatorProfile.update(args)
}

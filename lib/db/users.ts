import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import { CACHE_KEYS } from '../constants'

export const getUserProfile = async (userId: string) => {
  'use cache'
  unstable_cacheLife({
    stale: 3600 * 12, // 12 hours
    revalidate: 3600 * 6, // 6 hours
    expire: 86400, // 1 day
  })
  unstable_cacheTag(CACHE_KEYS.profile(userId))

  return prisma.profile.findUnique({
    where: { userId },
    include: {
      creatorProfile: true,
    },
  })
}

// Used in auth callback
export const createUserProfile = async (data: Prisma.ProfileCreateInput) => {
  return prisma.profile.create({
    data,
  })
}

export const getCreatorProfile = async (profileId: string) => {
  return prisma.creatorProfile.findUnique({
    where: { profileId },
    include: {
      profile: {
        include: {
          user: true,
        },
      },
    },
  })
}

export const createCreatorApplication = async (
  data: Prisma.CreatorApplicationCreateInput,
) => {
  return prisma.creatorApplication.create({
    data,
  })
}

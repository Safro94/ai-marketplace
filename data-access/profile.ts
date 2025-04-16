import { CACHE_KEYS } from '@/lib/constants'
import { Prisma, Role } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'
import prisma from '../lib/prisma'

export const getUserProfile = async (userId: string) => {
  'use cache'
  unstable_cacheTag(CACHE_KEYS.profile(userId))
  unstable_cacheLife({
    stale: 3600 * 12, // 12 hours
    revalidate: 3600 * 6, // 6 hours
    expire: 86400, // 1 day
  })

  return await prisma.profile.findUnique({
    where: { userId },
    include: {
      creatorProfile: {
        include: {
          paymentMethods: true,
          creatorApplication: {
            select: {
              status: true,
            },
          },
        },
      },
    },
  })
}

export const getProfileByUserId = async (
  userId: string,
  where?: Partial<Prisma.ProfileWhereUniqueInput>,
) => {
  return await prisma.profile.findUnique({
    where: { userId, ...where },
  })
}

export const createProfile = async (userId: string) => {
  await prisma.profile.create({
    data: {
      userId: userId,
      role: Role.USER,
      createdAt: new Date(),
    },
  })
}

export const updateProfile = async (args: Prisma.ProfileUpdateArgs) => {
  return await prisma.profile.update(args)
}

import prisma from '@/lib/prisma'
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
      creatorProfile: {
        include: {
          paymentMethods: true,
        },
      },
    },
  })
}

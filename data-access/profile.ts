import { createAffiliateCode } from '@/lib/affilate-codes'
import { CACHE_KEYS } from '@/lib/constants'
import { AffiliateStatus, Prisma, Role } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'
import prisma from '../lib/prisma'

export const getUserProfile = async (userId: string) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.profile(userId))
  unstable_cacheLife('hours')

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

export const getProfileById = async (profileId: string) => {
  return await prisma.profile.findUnique({
    where: { id: profileId },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export const createProfile = async (userId: string) => {
  const affiliateCode = await createAffiliateCode()

  if (!affiliateCode) {
    throw Error('Failed to generate affiliate code')
  }

  await prisma.profile.create({
    data: {
      userId: userId,
      role: Role.USER,
      createdAt: new Date(),
      profileAffiliateCodes: {
        create: {
          code: affiliateCode,
          status: AffiliateStatus.ACTIVE,
          isDefault: true,
        },
      },
    },
  })
}

export const updateProfile = async (args: Prisma.ProfileUpdateArgs) => {
  return await prisma.profile.update(args)
}

import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function getUserProfile(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
    include: {
      creatorProfile: true,
    },
  })
}

// Used in auth callback
export async function createUserProfile(data: Prisma.ProfileCreateInput) {
  return prisma.profile.create({
    data,
  })
}

export async function updateUserProfile(
  userId: string,
  data: Prisma.ProfileUpdateInput,
) {
  return prisma.profile.update({
    where: { userId },
    data,
  })
}

export async function getCreatorProfile(profileId: string) {
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

export async function createCreatorApplication(
  data: Prisma.CreatorApplicationCreateInput,
) {
  return prisma.creatorApplication.create({
    data,
  })
}

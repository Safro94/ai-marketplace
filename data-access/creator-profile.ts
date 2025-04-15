import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const getCreatorProfileByProfileId = async (profileId: string) => {
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

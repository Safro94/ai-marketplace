import prisma from '@/lib/prisma'
import { ApplicationStatus, Prisma } from '@prisma/client'
import 'server-only'

export const getPendingCreatorApplicationsCount = async () => {
  return await prisma.creatorApplication.count({
    where: { status: ApplicationStatus.PENDING },
  })
}

export const createCreatorApplication = async (
  data: Prisma.CreatorApplicationCreateArgs['data'],
) => {
  return await prisma.creatorApplication.create({
    data,
  })
}

export const getFirstCreatorApplicationByProfileId = async (
  profileId: string,
) => {
  return await prisma.creatorApplication.findFirst({
    where: {
      creatorProfile: {
        profileId,
      },
      status: ApplicationStatus.PENDING,
    },
  })
}

export const getCreatorApplicationById = async (id: string) => {
  return await prisma.creatorApplication.findUnique({
    where: { id },
    include: {
      creatorProfile: {
        select: {
          profileId: true,
          profile: {
            select: {
              user: {
                select: {
                  email: true,
                  name: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

export const getPendingCreatorApplications = async () => {
  return await prisma.creatorApplication.findMany({
    where: {
      status: ApplicationStatus.PENDING,
    },
    include: {
      creatorProfile: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      submittedAt: 'desc',
    },
  })
}

export const updateCreatorApplication = async (
  args: Prisma.CreatorApplicationUpdateArgs,
) => {
  return await prisma.creatorApplication.update(args)
}

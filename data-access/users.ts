import prisma from '@/lib/prisma'
import 'server-only'

export const getUserCount = async () => {
  return await prisma.user.count()
}

export const getUserProfiles = async () => {
  return await prisma.user.findMany({
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

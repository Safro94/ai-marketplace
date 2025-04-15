import prisma from '@/lib/prisma'
import 'server-only'

export const getLicensesCount = async () => {
  return await prisma.license.count()
}

export const getLicenses = async () => {
  return await prisma.license.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

import prisma from '../prisma'

export const getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

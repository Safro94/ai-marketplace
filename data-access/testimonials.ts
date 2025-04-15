import prisma from '@/lib/prisma'

export const getTestimonials = async (limit = 5) => {
  return await prisma.testimonial.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'

export const getTestimonials = async (limit = 5) => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.testimonials())
  unstable_cacheLife('weeks')

  return await prisma.testimonial.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

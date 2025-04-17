import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'

export const getLicenses = async () => {
  'use cache'

  unstable_cacheTag(CACHE_KEYS.licenses())
  unstable_cacheLife('weeks')

  return await prisma.license.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

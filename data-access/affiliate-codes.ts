import { createAffiliateCode } from '@/lib/affilate-codes'
import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { AffiliateStatus } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'

export const getDefaultAffiliateCodeByCreatorProfileId = async (
  creatorProfileId: string,
) => {
  'use cache'

  unstable_cacheTag(
    CACHE_KEYS.creatorProfileDefaultAffiliateCode(creatorProfileId),
  )
  unstable_cacheLife('hours')

  return await prisma.affiliateCode.findFirst({
    where: { creatorProfileId, isDefault: true },
    select: {
      code: true,
    },
  })
}

export const createAffiliateCodeDAL = async (
  creatorProfileId: string,
  isDefault: boolean = true,
) => {
  const data = await getDefaultAffiliateCodeByCreatorProfileId(creatorProfileId)
  const newCode = await createAffiliateCode()

  if (!data?.code) {
    throw new Error('Failed to get current affiliate code')
  }

  if (!newCode) {
    throw new Error('Failed to generate affiliate code')
  }

  await prisma.affiliateCode.update({
    where: { code: data.code },
    data: {
      isDefault: false,
      status: AffiliateStatus.INACTIVE,
    },
  })

  return await prisma.affiliateCode.create({
    data: {
      code: newCode,
      creatorProfileId,
      isDefault,
    },
  })
}
